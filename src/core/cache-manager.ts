/**
 * Redis-based cache manager for SAP API responses
 * 
 * @module cache-manager
 */

import { createClient, RedisClientType } from 'redis';
import { CachedData, CacheOptions, CacheAdminStats, CacheKeyInfo } from '../types/cache';
import { REVALIDATION_TIMEOUT_MS } from './cache-config';
import * as crypto from 'crypto';
import { setNestedValue, getNestedValue, addArtifactToCacheArray, removeArtifactFromCacheArray } from '../utils/cache-update-helper';
import { cacheLogger } from '../utils/cache-logger';

/**
 * Manages caching operations with Redis
 */
export class CacheManager {
  private client: RedisClientType | null = null;
  private isConnected: boolean = false;
  private isEnabled: boolean = false;
  private connectionString: string;
  private connectPromise: Promise<void> | null = null;
  private encryptionKey: Buffer | null = null;
  private encryptionEnabled: boolean = false;
  private connectedAt: number | null = null;
  
  // Failover and retry configuration
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000; // Start with 1 second
  private maxReconnectDelay: number = 30000; // Max 30 seconds
  private currentReconnectAttempt: number = 0;
  private isReconnecting: boolean = false;
  
  // Rate-limiting queue for background revalidations to prevent 429 errors
  private _revalidationQueue: Array<() => Promise<void>> = [];
  private _revalidationExecuting: Set<Promise<void>> = new Set();
  private _revalidationConcurrency: number = 1; // Sequential execution to avoid SAP rate limits
  private _revalidationDelay: number = 1000; // 1 second delay between requests to avoid SAP rate limits
  private _revalidationProcessing: boolean = false; // Flag to prevent parallel queue processing
  private _maxQueueLength: number = 100; // Maximum queue length before dropping tasks
  private _queueDropStrategy: 'oldest' | 'newest' | 'warn' = 'oldest'; // How to handle queue overflow
  
  /**
   * Tracks ongoing revalidation operations to prevent duplicate SAP API calls
   * 
   * Maps cache keys to their revalidation promises. When multiple requests
   * arrive for the same stale cache key, subsequent requests will be skipped
   * while the first revalidation is in progress.
   * 
   * Memory Management:
   * - Keys are automatically removed after revalidation completes (success or failure)
   * - All entries are cleared when the cache manager is closed
   * 
   * @private
   * @since 1.x.x (Queue Deduplication Feature)
   */
  private _revalidationInProgress: Map<string, Promise<void>> = new Map();

  /**
   * Creates a new CacheManager instance
   * 
   * @param connectionString - Redis connection string
   * @param enabled - Whether caching is enabled
   * @param encryptionSecret - Optional secret for encrypting cache values (recommended: use OAuth client secret)
   * @param maxQueueLength - Maximum revalidation queue length (default: 100)
   * @param queueDropStrategy - Strategy for handling queue overflow: 'oldest' (drop oldest tasks), 'newest' (drop newest/incoming tasks), 'warn' (only warn, no limit)
   */
  constructor(
    connectionString: string, 
    enabled: boolean = true, 
    encryptionSecret?: string,
    maxQueueLength: number = 100,
    queueDropStrategy: 'oldest' | 'newest' | 'warn' = 'oldest'
  ) {
    this.connectionString = connectionString;
    this.isEnabled = enabled;
    this._maxQueueLength = maxQueueLength;
    this._queueDropStrategy = queueDropStrategy;
    
    // Initialize encryption if secret is provided
    if (encryptionSecret) {
      this.initializeEncryption(encryptionSecret);
    }
    
    // Don't initialize in constructor - let caller await it
  }
  
  /**
   * Initializes encryption key from the provided secret
   * Uses PBKDF2 to derive a secure encryption key
   * 
   * @param secret - The secret to derive the encryption key from
   */
  private initializeEncryption(secret: string): void {
    try {
      // Use PBKDF2 to derive a 256-bit key from the secret
      // Salt is fixed but that's okay since the secret itself should be unique per tenant
      const salt = 'sap-cache-encryption-v1';
      this.encryptionKey = crypto.pbkdf2Sync(secret, salt, 100000, 32, 'sha256');
      this.encryptionEnabled = true;
      console.log('[CacheManager] Cache encryption enabled (AES-256-GCM)');
    } catch (error) {
      console.error('[CacheManager] Failed to initialize encryption:', error);
      this.encryptionKey = null;
      this.encryptionEnabled = false;
    }
  }
  
  /**
   * Encrypts data using AES-256-GCM
   * 
   * @param data - The data to encrypt
   * @returns Encrypted data with IV prepended
   */
  private encrypt(data: string): string {
    if (!this.encryptionEnabled || !this.encryptionKey) {
      return data;
    }
    
    try {
      // Generate a random IV for each encryption
      const iv = crypto.randomBytes(16);
      
      // Create cipher with AES-256-GCM
      const cipher = crypto.createCipheriv('aes-256-gcm', this.encryptionKey, iv);
      
      // Encrypt the data
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Get the auth tag
      const authTag = cipher.getAuthTag();
      
      // Combine IV + authTag + encrypted data
      // Format: [IV(16 bytes)][AuthTag(16 bytes)][EncryptedData]
      return iv.toString('hex') + authTag.toString('hex') + encrypted;
    } catch (error) {
      console.error('[CacheManager] Encryption failed:', error);
      // Return unencrypted data as fallback
      return data;
    }
  }
  
  /**
   * Decrypts data using AES-256-GCM
   * 
   * @param encryptedData - The encrypted data with IV prepended
   * @returns Decrypted data
   */
  private decrypt(encryptedData: string): string {
    if (!this.encryptionEnabled || !this.encryptionKey) {
      return encryptedData;
    }
    
    try {
      // Extract IV (first 32 hex chars = 16 bytes)
      const iv = Buffer.from(encryptedData.slice(0, 32), 'hex');
      
      // Extract auth tag (next 32 hex chars = 16 bytes)
      const authTag = Buffer.from(encryptedData.slice(32, 64), 'hex');
      
      // Extract encrypted data (rest)
      const encrypted = encryptedData.slice(64);
      
      // Create decipher
      const decipher = crypto.createDecipheriv('aes-256-gcm', this.encryptionKey, iv);
      decipher.setAuthTag(authTag);
      
      // Decrypt the data
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('[CacheManager] Decryption failed:', error);
      // Try to return as-is (might be unencrypted legacy data)
      return encryptedData;
    }
  }
  
  /**
   * Initializes and connects to Redis
   * Must be called before using the cache manager
   */
  async connect(): Promise<void> {
    // If already connected, return immediately
    if (this.isConnected) {
      return;
    }
    
    // If a connection is already in progress, wait for it
    if (this.connectPromise) {
      return this.connectPromise;
    }
    
    // Otherwise, start a new connection
    if (this.isEnabled && this.connectionString && this.connectionString.trim().length > 0) {
      this.connectPromise = this.initialize()
        .then(() => {
          this.connectPromise = null;
        })
        .catch((error) => {
          this.connectPromise = null;
          // Disable cache manager on connection failure
          this.disable();
          throw error;
        });
      
      return this.connectPromise;
    }
    
    // If cache is disabled or connection string is empty, don't try to connect
    if (!this.isEnabled) {
      return Promise.resolve();
    }
    
    // If connection string is empty, disable cache and return
    if (!this.connectionString || this.connectionString.trim().length === 0) {
      this.disable();
      return Promise.resolve();
    }
  }

  /**
   * Initializes the Redis client connection
   */
  private async initialize(): Promise<void> {
    try {
      // Validate connection string is not empty
      if (!this.connectionString || this.connectionString.trim().length === 0) {
        throw new Error('Redis connection string is empty or invalid');
      }

      // Parse the connection string (Azure Redis format)
      // Format: host:port,password=xxx,ssl=True,abortConnect=False
      // Also supports: redis://host:port or rediss://host:port
      let connectionPart = this.connectionString.split(',')[0];
      
      // Remove protocol prefix if present (redis:// or rediss://)
      connectionPart = connectionPart.replace(/^redis[s]?:\/\//, '');
      
      if (!connectionPart || !connectionPart.includes(':')) {
        throw new Error(`Invalid Redis connection string format. Expected format: host:port,password=xxx,ssl=True or redis://host:port`);
      }
      
      const [host, port] = connectionPart.split(':');
      
      if (!host || !host.trim() || !port || !port.trim()) {
        throw new Error(`Invalid Redis connection string format. Missing host or port.`);
      }
      
      // Validate and parse port
      const portNumber = parseInt(port.trim(), 10);
      if (isNaN(portNumber) || portNumber < 0 || portNumber > 65535) {
        throw new Error(`Invalid Redis port: ${port.trim()}. Port must be a number between 0 and 65535.`);
      }
      
      // Parse additional parameters from connection string
      const parts = this.connectionString.split(',');
      let password = '';
      let ssl = false;
      
      // Check if SSL is indicated by protocol (rediss://)
      if (this.connectionString.startsWith('rediss://')) {
        ssl = true;
      }
      
      for (const part of parts) {
        if (part.startsWith('password=')) {
          password = part.substring('password='.length);
        } else if (part.startsWith('ssl=')) {
          ssl = part.substring('ssl='.length).toLowerCase() === 'true';
        }
      }

      this.client = createClient({
        socket: {
          host: host.trim(),
          port: portNumber,
          tls: ssl,
          connectTimeout: 5000, // 5 second timeout for connection attempts
          reconnectStrategy: (retries) => {
            // Exponential backoff with max delay
            if (retries >= this.maxReconnectAttempts) {
              console.error(`[CacheManager] Max reconnection attempts (${this.maxReconnectAttempts}) reached. Giving up.`);
              return false; // Stop reconnecting
            }
            
            const delay = Math.min(
              this.reconnectDelay * Math.pow(2, retries),
              this.maxReconnectDelay
            );
            
            console.log(`[CacheManager] Reconnection attempt ${retries + 1}/${this.maxReconnectAttempts} in ${delay}ms...`);
            return delay;
          },
        },
        password,
      });

      // Error handling with failover support
      this.client.on('error', (err: Error) => {
        console.error('[CacheManager] Redis client error:', err);
        this.isConnected = false;
        
        // Don't trigger reconnection if we're already reconnecting
        if (!this.isReconnecting) {
          this.isReconnecting = true;
        }
      });

      this.client.on('connect', () => {
        console.log('[CacheManager] Redis client connected');
        this.isConnected = true;
        this.connectedAt = Date.now();
        this.currentReconnectAttempt = 0; // Reset reconnection counter on success
        this.isReconnecting = false;
      });

      this.client.on('reconnecting', () => {
        console.log('[CacheManager] Redis client reconnecting...');
        this.isConnected = false;
        this.isReconnecting = true;
        this.currentReconnectAttempt++;
      });

      this.client.on('disconnect', () => {
        console.log('[CacheManager] Redis client disconnected');
        this.isConnected = false;
      });
      
      this.client.on('ready', () => {
        console.log('[CacheManager] Redis client ready');
        this.isConnected = true;
        this.connectedAt = Date.now();
        this.currentReconnectAttempt = 0;
        this.isReconnecting = false;
      });

      // Connect to Redis with timeout
      const connectPromise = this.client.connect();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Redis connection timeout after 5 seconds'));
        }, 5000);
      });
      
      await Promise.race([connectPromise, timeoutPromise]);
    } catch (error) {
      console.error('[CacheManager] Failed to initialize Redis:', error);
      this.isConnected = false;
      // Clean up client on error
      if (this.client) {
        try {
          // Remove all event listeners to prevent memory leaks
          this.client.removeAllListeners('error');
          this.client.removeAllListeners('connect');
          this.client.removeAllListeners('disconnect');
        } catch {
          // Ignore cleanup errors
        }
        this.client = null;
      }
      // Disable cache manager if connection fails
      this.disable();
      throw error; // Re-throw to allow caller to handle
    }
  }

  /**
   * Gets cached data by key
   * 
   * @param key - The cache key
   * @returns Cached data or null if not found
   */
  async get(key: string): Promise<CachedData | null> {
    if (!this.isEnabled || !this.isConnected || !this.client) {
      return null;
    }

    try {
      const encryptedData = await this.client.get(key);
      if (!encryptedData) {
        return null;
      }

      // Decrypt if encryption is enabled
      const data = this.decrypt(encryptedData);

      return JSON.parse(data) as CachedData;
    } catch (error) {
      console.error('[CacheManager] Error getting cache:', error);
      return null;
    }
  }

  /**
   * Sets cached data with options
   * 
   * @param key - The cache key
   * @param data - The data to cache
   * @param options - Cache options (TTL and revalidation time)
   */
  async set(key: string, data: any, options: CacheOptions): Promise<void> {
    if (!this.isEnabled || !this.isConnected || !this.client) {
      if (process.env.DEBUG === 'true') {
        cacheLogger.debug(
          'Cache set skipped: cache not enabled or not connected',
          'CacheManager',
          { 
            key, 
            isEnabled: this.isEnabled, 
            isConnected: this.isConnected, 
            hasClient: !!this.client 
          }
        );
      }
      return;
    }

    // Validate input parameters
    if (!key || typeof key !== 'string' || key.trim().length === 0) {
      cacheLogger.error(
        'Invalid cache key provided',
        'CacheManager',
        { key: String(key) },
        new Error('Cache key must be a non-empty string')
      );
      return;
    }

    if (data === undefined || data === null) {
      cacheLogger.warn(
        'Attempting to cache null or undefined data',
        'CacheManager',
        { key }
      );
      // Continue anyway - null/undefined might be valid cache values
    }

    if (!options || typeof options.ttl !== 'number' || options.ttl <= 0) {
      cacheLogger.error(
        'Invalid cache options provided',
        'CacheManager',
        { key, options },
        new Error('TTL must be a positive number')
      );
      return;
    }

    if (typeof options.revalidateAfter !== 'number' || options.revalidateAfter <= 0) {
      cacheLogger.error(
        'Invalid revalidateAfter in cache options',
        'CacheManager',
        { key, options },
        new Error('revalidateAfter must be a positive number')
      );
      return;
    }

    try {
      const now = Date.now();
      const cachedData: CachedData = {
        data,
        cachedAt: now,
        expiresAt: now + (options.ttl * 1000),
        revalidateAfter: now + (options.revalidateAfter * 1000),
      };

      const jsonData = JSON.stringify(cachedData);
      if (!jsonData) {
        cacheLogger.error(
          'Failed to stringify cache data',
          'CacheManager',
          { key },
          new Error('JSON.stringify returned empty result')
        );
        return;
      }
      
      // Encrypt if encryption is enabled
      const encryptedData = this.encrypt(jsonData);
      if (!encryptedData) {
        cacheLogger.error(
          'Failed to encrypt cache data',
          'CacheManager',
          { key },
          new Error('Encryption returned empty result')
        );
        return;
      }

      // Set the cache entry with TTL
      const result = await this.client.setEx(key, options.ttl, encryptedData);
      
      // Verify the operation was successful
      // Redis setEx returns 'OK' on success, but newer clients might return different values
      if (result !== 'OK' && result !== null && result !== undefined) {
        // Check if the key was actually set by verifying it exists
        const exists = await this.client.exists(key);
        if (!exists) {
          cacheLogger.error(
            'Cache setEx operation may have failed - key does not exist after set',
            'CacheManager',
            { key, setExResult: result },
            new Error('Key verification failed after setEx')
          );
          return;
        }
      }

      if (process.env.DEBUG === 'true') {
        cacheLogger.debug(
          'Successfully set cache entry',
          'CacheManager',
          { key, ttl: options.ttl }
        );
      }
    } catch (error) {
      cacheLogger.error(
        'Error setting cache',
        'CacheManager',
        { key, ttl: options?.ttl },
        error as Error
      );
      // Re-throw to allow caller to handle if needed, but since return type is void, we just log
    }
  }

  /**
   * Determines if cached data should be revalidated
   * 
   * @param cachedData - The cached data to check
   * @param forceRevalidate - Force revalidation regardless of time
   * @returns true if revalidation is needed
   */
  shouldRevalidate(cachedData: CachedData, forceRevalidate: boolean = false): boolean {
    if (forceRevalidate) {
      return true;
    }

    const now = Date.now();
    return now >= cachedData.revalidateAfter;
  }

  /**
   * Checks if cached data is expired
   * 
   * @param cachedData - The cached data to check
   * @returns true if the data is expired
   */
  isExpired(cachedData: CachedData): boolean {
    const now = Date.now();
    return now >= cachedData.expiresAt;
  }

  /**
   * Processes the revalidation queue with rate limiting
   * @private
   */
  private async _processRevalidationQueue(): Promise<void> {
    // Prevent parallel processing
    if (this._revalidationProcessing) {
      return;
    }

    // If we're at concurrency limit, wait
    if (this._revalidationExecuting.size >= this._revalidationConcurrency) {
      return;
    }

    // If queue is empty, nothing to do
    if (this._revalidationQueue.length === 0) {
      this._revalidationProcessing = false;
      return;
    }

    // Mark as processing
    this._revalidationProcessing = true;

    // Get next task from queue
    const task = this._revalidationQueue.shift();
    if (!task) {
      this._revalidationProcessing = false;
      return;
    }

    const queueLength = this._revalidationQueue.length;
    const executingCount = this._revalidationExecuting.size;
    console.log(`[CacheManager] 🔄 Processing revalidation queue - Queue: ${queueLength}, Executing: ${executingCount}`);

    // ALWAYS add delay before processing to avoid rate limits (except for the very first task)
    // This ensures sequential processing with proper spacing
    if (this._revalidationExecuting.size > 0) {
      console.log(`[CacheManager] ⏳ Waiting ${this._revalidationDelay}ms before next revalidation...`);
      await new Promise(resolve => setTimeout(resolve, this._revalidationDelay));
    }

    // Execute task
    const promise = task()
      .then(() => {
        this._revalidationExecuting.delete(promise);
        this._revalidationProcessing = false;
        // Process next item in queue after a short delay
        setTimeout(() => {
          this._processRevalidationQueue().catch(() => {});
        }, 0);
      })
      .catch(() => {
        this._revalidationExecuting.delete(promise);
        this._revalidationProcessing = false;
        // Process next item in queue after a short delay
        setTimeout(() => {
          this._processRevalidationQueue().catch(() => {});
        }, 0);
      });

    this._revalidationExecuting.add(promise);
  }

  /**
   * Cleans up revalidation tracking after completion
   * 
   * This method is called in the `finally` block of each revalidation task
   * to ensure the cache key is removed from `_revalidationInProgress`,
   * regardless of whether the revalidation succeeded or failed.
   * 
   * Memory Safety:
   * - Guaranteed cleanup through `finally` block
   * - Safe to call multiple times (idempotent)
   * - Handles non-existent keys gracefully
   * 
   * Debug Logging:
   * When DEBUG=true, logs the cleanup operation and the current number
   * of revalidations still in progress.
   * 
   * @param key - The cache key that completed revalidation
   * @private
   * @since 1.x.x (Queue Deduplication Feature)
   */
  private _cleanupRevalidation(key: string): void {
    if (this._revalidationInProgress.has(key)) {
      this._revalidationInProgress.delete(key);
      
      if (process.env.DEBUG === 'true') {
        console.log(`[CacheManager] 🧹 Cleaned up revalidation for key: ${key.substring(0, 80)}... (${this._revalidationInProgress.size} still in progress)`);
      }
    }
  }

  /**
   * Revalidates cache in the background with timeout and rate limiting
   * Supports differential updates for collection endpoints
   * 
   * Queue Deduplication:
   * Prevents multiple concurrent revalidations of the same cache key.
   * If a revalidation for a given key is already in progress, subsequent
   * requests will be skipped to avoid duplicate SAP API calls.
   * 
   * Example scenario:
   * - 50 users request the same stale artifact data simultaneously
   * - Without deduplication: 50 SAP API calls
   * - With deduplication: 1 SAP API call
   * 
   * @param key - The cache key to revalidate
   * @param fetchFn - Function that fetches fresh data
   * @param options - Cache options for the new data
   * @param enableDifferential - Enable differential updates (only for collections)
   * @param isCollectionEndpoint - Whether this is a collection endpoint
   */
  async revalidateInBackground(
    key: string,
    fetchFn: () => Promise<any>,
    options: CacheOptions,
    enableDifferential: boolean = false,
    isCollectionEndpoint: boolean = false
  ): Promise<void> {
    if (!this.isEnabled || !this.isConnected) {
      return;
    }

    // Check if a revalidation for this key is already in progress
    if (this._revalidationInProgress.has(key)) {
      if (process.env.DEBUG === 'true') {
        console.log(`[CacheManager] ⏭️  Skipping duplicate revalidation for key: ${key.substring(0, 80)}...`);
      }
      return; // Skip adding to queue
    }

    // Log when adding to queue
    if (this._revalidationQueue.length === 0) {
      console.log(`[CacheManager] 📥 Starting revalidation queue - First task: ${key.substring(0, 80)}...`);
    }

    // Add to queue instead of executing immediately
    const task = async (): Promise<void> => {
      let timeoutId: NodeJS.Timeout | null = null;
      
      try {
        // Registriere Promise in Map BEVOR fetch startet
        const revalidationPromise = (async () => {
          const freshData = await Promise.race([
            fetchFn(),
            new Promise((_, reject) => {
              timeoutId = setTimeout(() => reject(new Error('Revalidation timeout')), REVALIDATION_TIMEOUT_MS);
            }),
          ]);

          // Clear timeout to prevent memory leak
          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          // If differential updates are enabled and this is a collection endpoint, perform differential merge
          if (enableDifferential && isCollectionEndpoint) {
            try {
              // Import the helper functions dynamically to avoid circular dependencies
              const { compareArtifacts, mergeArtifactsDifferentially } = await import('../utils/cache-update-helper');
              
              // Get old cache data
              const oldCachedData = await this.get(key);
              
              if (oldCachedData) {
                // Extract artifacts arrays from both old and new data
                const oldArtifacts = this.extractArtifactsArray(oldCachedData.data);
                const newArtifacts = this.extractArtifactsArray(freshData);
                
                if (oldArtifacts && newArtifacts) {
                  // Compare artifacts
                  const comparison = compareArtifacts(oldArtifacts, newArtifacts);
                  
                  if (process.env.DEBUG === 'true') {
                    console.log(`[CacheManager] Differential revalidation for ${key}: ` +
                      `Added: ${comparison.added.length}, ` +
                      `Updated: ${comparison.updated.length}, ` +
                      `Removed: ${comparison.removed.length}, ` +
                      `Unchanged: ${comparison.unchanged.length}`);
                  }
                  
                  // Merge differentially
                  const mergedData = mergeArtifactsDifferentially(
                    oldCachedData,
                    newArtifacts,
                    comparison,
                    {
                      ttl: options.ttl,
                      revalidateAfter: options.revalidateAfter,
                    }
                  );
                  
                  // Save merged data directly to Redis
                  await this.saveCachedData(key, mergedData);
                  
                  if (process.env.DEBUG === 'true') {
                    console.log(`[CacheManager] Differential revalidation successful for key: ${key}`);
                  }
                  return;
                }
              }
            } catch (diffError) {
              // Log error but fall back to full replacement
              console.warn(`[CacheManager] Differential update failed, falling back to full replacement:`, diffError);
            }
          }
          
          // Default behavior: Full replacement
          await this.set(key, freshData, options);
          if (process.env.DEBUG === 'true') {
            console.log(`[CacheManager] Background revalidation successful for key: ${key}`);
          }
        })();

        // Registriere in Map
        this._revalidationInProgress.set(key, revalidationPromise);
        
        // Warte auf Abschluss
        await revalidationPromise;
        
      } catch (error: any) {
        // Clear timeout to prevent memory leak
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        // Log 429 errors specifically
        if (error?.message?.includes('429') || error?.status === 429 || error?.response?.status === 429) {
          console.warn(`[CacheManager] ⚠️ Background revalidation rate limited (429) for key: ${key} - Queue length: ${this._revalidationQueue.length}, Executing: ${this._revalidationExecuting.size}`);
        }
        // Silently fail - keep old cache
        if (process.env.DEBUG === 'true') {
          console.log(`[CacheManager] Background revalidation failed for key: ${key}`, error.message);
        }
      } finally {
        // CLEANUP: Entferne Key aus Map nach Abschluss
        this._cleanupRevalidation(key);
      }
    };

    // Check queue limit and apply drop strategy
    if (this._queueDropStrategy !== 'warn' && this._revalidationQueue.length >= this._maxQueueLength) {
      if (this._queueDropStrategy === 'oldest') {
        // Drop oldest task (shift from front)
        this._revalidationQueue.shift();
        console.warn(`[CacheManager] ⚠️ Queue limit reached (${this._maxQueueLength}), dropped OLDEST task. Adding new task: ${key.substring(0, 80)}...`);
      } else if (this._queueDropStrategy === 'newest') {
        // Drop newest task (don't add current task)
        console.warn(`[CacheManager] ⚠️ Queue limit reached (${this._maxQueueLength}), dropping NEWEST task: ${key.substring(0, 80)}...`);
        return; // Don't add to queue
      }
    }
    
    // Add to queue
    this._revalidationQueue.push(task);
    
    // Log queue status
    if (this._revalidationQueue.length > 10) {
      console.warn(`[CacheManager] ⚠️ Revalidation queue is growing: ${this._revalidationQueue.length}/${this._maxQueueLength} items queued, Executing: ${this._revalidationExecuting.size}, Processing: ${this._revalidationProcessing}`);
    }
    
    // Start processing queue if not already processing
    if (!this._revalidationProcessing) {
      this._processRevalidationQueue().catch(() => {});
    }
  }

  /**
   * Extracts artifacts array from various cache data formats
   * Supports: Direct array, OData v2/v4, IntegrationPackages, IntegrationRuntimeArtifacts
   * 
   * @param data - The cache data to extract from
   * @returns Array of artifacts or null if format not recognized
   */
  private extractArtifactsArray(data: any): any[] | null {
    if (!data) return null;
    
    // Format 1: Direct array
    if (Array.isArray(data)) {
      return data;
    }
    // Format 2: OData v2 format (d.results)
    if (data?.d?.results && Array.isArray(data.d.results)) {
      return data.d.results;
    }
    // Format 3: OData v4 format (value array)
    if (data?.value && Array.isArray(data.value)) {
      return data.value;
    }
    // Format 4: IntegrationPackages format
    if (data?.IntegrationPackages && Array.isArray(data.IntegrationPackages)) {
      return data.IntegrationPackages;
    }
    // Format 5: IntegrationRuntimeArtifacts format
    if (data?.IntegrationRuntimeArtifacts && Array.isArray(data.IntegrationRuntimeArtifacts)) {
      return data.IntegrationRuntimeArtifacts;
    }
    
    return null;
  }

  /**
   * Saves CachedData directly to Redis (internal helper for differential updates)
   * 
   * @param key - The cache key
   * @param cachedData - The complete CachedData object to save
   */
  private async saveCachedData(key: string, cachedData: CachedData): Promise<void> {
    if (!this.isEnabled || !this.isConnected || !this.client) {
      return;
    }

    try {
      // Calculate remaining TTL in seconds
      const now = Date.now();
      const remainingTtl = Math.max(0, Math.ceil((cachedData.expiresAt - now) / 1000));
      
      // Serialize and optionally encrypt
      const serialized = JSON.stringify(cachedData);
      const value = this.encrypt(serialized);
      
      // Save to Redis with TTL
      if (remainingTtl > 0) {
        await this.client.set(key, value, { EX: remainingTtl });
      } else {
        // If TTL is 0 or negative, delete the key
        await this.client.del(key);
      }
    } catch (error) {
      console.error('[CacheManager] Error saving cached data:', error);
      throw error;
    }
  }

  /**
   * Closes the Redis connection and removes all event listeners
   */
  async close(): Promise<void> {
    if (this.client) {
      // Wait for pending revalidations to complete
      if (this._revalidationInProgress.size > 0) {
        console.log(`[CacheManager] ⏳ Waiting for ${this._revalidationInProgress.size} revalidations to complete...`);
        
        try {
          await Promise.race([
            Promise.allSettled(Array.from(this._revalidationInProgress.values())),
            new Promise((resolve) => setTimeout(resolve, 5000)),
          ]);
        } catch (error) {
          console.warn('[CacheManager] Some revalidations did not complete before closing:', error);
        }
        
        this._revalidationInProgress.clear();
      }
      
      // Remove all event listeners to prevent memory leaks
      this.client.removeAllListeners('error');
      this.client.removeAllListeners('connect');
      this.client.removeAllListeners('disconnect');
      
      // Close connection if connected, with timeout
      if (this.isConnected || this.client.isOpen) {
        try {
          const quitPromise = this.client.quit();
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
              reject(new Error('Redis quit timeout after 2 seconds'));
            }, 2000);
          });
          
          await Promise.race([quitPromise, timeoutPromise]);
        } catch (error) {
          // Ignore errors during quit (connection might already be closed)
          console.warn('[CacheManager] Error during Redis quit (ignored):', error instanceof Error ? error.message : String(error));
        }
      }
      
      this.isConnected = false;
      this.client = null;
    }
  }

  /**
   * Checks if the cache manager is ready to use
   */
  isReady(): boolean {
    return this.isEnabled && this.isConnected;
  }

  /**
   * Disables the cache manager
   * Useful when connection fails and cache should be disabled
   */
  disable(): void {
    this.isEnabled = false;
  }

  /**
   * Finds cache keys matching a pattern using Redis SCAN
   * Uses SCAN instead of KEYS for better performance in production
   * 
   * @param pattern - The pattern to match (supports wildcards like *)
   * @returns Array of matching cache keys
   * 
   * @example
   * const keys = await cacheManager.findKeysByPattern('sap:hostname:GET:/IntegrationRuntimeArtifacts*');
   */
  async findKeysByPattern(pattern: string): Promise<string[]> {
    if (!this.isEnabled || !this.isConnected || !this.client) {
      return [];
    }

    try {
      const keys: string[] = [];
      let cursor = 0;

      do {
        const result = await this.client.scan(cursor, {
          MATCH: pattern,
          COUNT: 100, // Scan in batches of 100
        });
        
        cursor = result.cursor;
        keys.push(...result.keys);
      } while (cursor !== 0);

      return keys;
    } catch (error) {
      cacheLogger.error(
        'Error finding keys by pattern',
        'CacheManager',
        { pattern },
        error as Error
      );
      return [];
    }
  }

  /**
   * Updates a partial cache entry by applying an update function
   * Reads the cache entry, applies the update function, and writes it back
   * 
   * @param key - The cache key to update
   * @param updateFn - Function that receives the cached data and returns updated data
   * @returns true if update was successful, false otherwise
   * 
   * @example
   * await cacheManager.updatePartial('my-key', (cachedData) => {
   *   cachedData.data.status = 'updated';
   *   return cachedData;
   * });
   */
  async updatePartial(key: string, updateFn: (cachedData: CachedData) => CachedData): Promise<boolean> {
    if (!this.isEnabled || !this.isConnected || !this.client) {
      return false;
    }

    try {
      // Read current cache entry
      const cachedData = await this.get(key);
      if (!cachedData) {
        cacheLogger.debug(
          'Cache key not found for update',
          'CacheManager',
          { key }
        );
        return false;
      }

      // Apply update function
      const updatedData = updateFn(cachedData);

      // Calculate remaining TTL
      const now = Date.now();
      
      // Validate expiresAt is a valid number
      if (!updatedData.expiresAt || typeof updatedData.expiresAt !== 'number' || isNaN(updatedData.expiresAt)) {
        cacheLogger.error(
          'Invalid expiresAt in cached data',
          'CacheManager',
          { key, expiresAt: updatedData.expiresAt },
          new Error('expiresAt must be a valid number')
        );
        return false;
      }

      // Calculate remaining TTL in seconds
      // Use Math.ceil instead of Math.floor to be more lenient with timing
      const remainingTtlMs = updatedData.expiresAt - now;
      const remainingTtl = Math.max(0, Math.ceil(remainingTtlMs / 1000));
      
      // Allow updates if TTL is still valid (greater than 0)
      // Add 2 seconds tolerance for validation to handle race conditions and test isolation
      // This means we allow updates if expired by less than 2 seconds
      if (remainingTtl <= 0 && remainingTtlMs < -2000) {
        // Cache entry expired by more than 2 seconds, don't update
        cacheLogger.debug(
          'Cache entry expired, skipping update',
          'CacheManager',
          { 
            key, 
            expiresAt: updatedData.expiresAt, 
            now, 
            remainingTtlMs,
            remainingTtl 
          }
        );
        return false;
      }

      // Write updated cache entry back
      const jsonData = JSON.stringify(updatedData);
      const encryptedData = this.encrypt(jsonData);
      
      await this.client.setEx(key, remainingTtl, encryptedData);

      cacheLogger.debug(
        'Successfully updated cache key',
        'CacheManager',
        { key, remainingTtl }
      );

      return true;
    } catch (error) {
      cacheLogger.error(
        'Error updating partial cache',
        'CacheManager',
        { key },
        error as Error
      );
      return false;
    }
  }

  /**
   * Deletes a single cache entry by key
   * 
   * @param key - The cache key to delete
   * @returns true if the key was deleted, false if the key doesn't exist or an error occurred
   * 
   * @example
   * const deleted = await cacheManager.delete('sap:hostname:GET:/IntegrationRuntimeArtifacts(\'artifactId\')');
   */
  async delete(key: string): Promise<boolean> {
    if (!this.isEnabled || !this.isConnected || !this.client) {
      return false;
    }

    try {
      const result = await this.client.del(key);
      // Redis DEL returns the number of keys deleted (0 or 1)
      const deleted = result > 0;
      
      if (deleted) {
        cacheLogger.debug('Cache key deleted', 'CacheManager', { key });
      }
      
      return deleted;
    } catch (error) {
      cacheLogger.error(
        'Error deleting cache key',
        'CacheManager',
        { key },
        error as Error
      );
      return false;
    }
  }

  /**
   * Deletes all cache entries matching a pattern
   * Uses findKeysByPattern internally to find matching keys, then deletes them
   * 
   * @param pattern - The pattern to match (supports wildcards like *)
   * @returns The number of keys deleted
   * 
   * @example
   * const deletedCount = await cacheManager.deleteByPattern('sap:hostname:GET:/IntegrationRuntimeArtifacts*');
   */
  async deleteByPattern(pattern: string): Promise<number> {
    if (!this.isEnabled || !this.isConnected || !this.client) {
      return 0;
    }

    try {
      const startTime = Date.now();
      
      // Find all keys matching the pattern
      const keys = await this.findKeysByPattern(pattern);
      
      if (keys.length === 0) {
        cacheLogger.debug(
          'No keys found for pattern',
          'CacheManager',
          { pattern }
        );
        return 0;
      }

      // Delete all keys in a single operation
      const result = await this.client.del(keys);
      const duration = Date.now() - startTime;
      
      // Redis DEL returns the number of keys deleted
      if (result > 0) {
        cacheLogger.info(
          'Cache keys deleted by pattern',
          'CacheManager',
          {
            pattern,
            keysFound: keys.length,
            keysDeleted: result,
            duration,
          }
        );
      }
      
      return result;
    } catch (error) {
      cacheLogger.error(
        'Error deleting cache keys by pattern',
        'CacheManager',
        { pattern },
        error as Error
      );
      return 0;
    }
  }

  /**
   * Updates a single field in a cache entry using a dot-notation path
   * 
   * @param key - The cache key to update
   * @param fieldPath - The dot-notation path to the field (e.g. 'data.Status' or 'data.d.results[0].Status')
   * @param value - The value to set
   * @returns true if the update was successful, false otherwise
   * 
   * @example
   * await cacheManager.updateField('my-key', 'data.Status', 'STARTED');
   */
  async updateField(key: string, fieldPath: string, value: any): Promise<boolean> {
    let updateSuccess = false;
    const result = await this.updatePartial(key, (cachedData) => {
      updateSuccess = setNestedValue(cachedData, fieldPath, value);
      return cachedData;
    });
    return result && updateSuccess;
  }

  /**
   * Updates multiple fields in a cache entry using dot-notation paths
   * 
   * @param key - The cache key to update
   * @param updates - Object mapping field paths to values
   * @returns true if the update was successful, false otherwise
   * 
   * @example
   * await cacheManager.updateFields('my-key', {
   *   'data.Status': 'STARTED',
   *   'data.DeployedBy': 'user@example.com',
   *   'data.DeployedOn': '2024-01-01T00:00:00Z'
   * });
   */
  async updateFields(key: string, updates: Record<string, any>): Promise<boolean> {
    let allUpdatesSuccessful = true;
    const result = await this.updatePartial(key, (cachedData) => {
      // Apply all updates
      for (const [fieldPath, value] of Object.entries(updates)) {
        const success = setNestedValue(cachedData, fieldPath, value);
        if (!success) {
          allUpdatesSuccessful = false;
        }
      }
      return cachedData;
    });
    return result && allUpdatesSuccessful;
  }

  /**
   * Updates an item in an array within a cache entry
   * Finds the item by ID and updates its fields
   * 
   * @param key - The cache key to update
   * @param arrayPath - The dot-notation path to the array (e.g. 'data.d.results' or 'data.IntegrationPackages')
   * @param itemId - The ID of the item to update (matches 'Id' or 'id' property)
   * @param updates - Object mapping field names to values to update
   * @returns true if the update was successful, false otherwise
   * 
   * @example
   * await cacheManager.updateInArray('my-key', 'data.d.results', 'artifact1', {
   *   Status: 'STARTED',
   *   DeployedBy: 'user@example.com'
   * });
   */
  async updateInArray(
    key: string,
    arrayPath: string,
    itemId: string,
    updates: Record<string, any>
  ): Promise<boolean> {
    let updateSuccessful = false;
    const result = await this.updatePartial(key, (cachedData) => {
      // Get the array using the path
      const array = getNestedValue(cachedData, arrayPath);
      
      if (!Array.isArray(array)) {
        cacheLogger.debug(
          'Array not found at path',
          'CacheManager',
          { arrayPath, key }
        );
        return cachedData; // No-op if array not found
      }

      // Find the item with matching ID
      const itemIndex = array.findIndex(
        (item: any) => item && (item.Id === itemId || item.id === itemId)
      );

      if (itemIndex === -1) {
        cacheLogger.debug(
          'Item not found in array',
          'CacheManager',
          { itemId, arrayPath, key }
        );
        return cachedData; // No-op if item not found
      }

      // Update the item
      const updatedItem = { ...array[itemIndex], ...updates };
      array[itemIndex] = updatedItem;

      // Set the updated array back
      const setSuccess = setNestedValue(cachedData, arrayPath, array);
      if (setSuccess) {
        updateSuccessful = true;
      }

      return cachedData;
    });
    return result && updateSuccessful;
  }

  /**
   * Performs multiple cache updates in a single batch using Redis Pipeline
   * 
   * **CRITICAL**: Uses Redis Pipeline for performance (50-100 updates = 1 roundtrip instead of 50-100)
   * 
   * @param updates - Array of update operations, each containing a key and updates object
   * @returns Object with success and failed counts
   * 
   * @example
   * const result = await cacheManager.batchUpdate([
   *   { key: 'key1', updates: { 'data.Status': 'STARTED' } },
   *   { key: 'key2', updates: { 'data.Status': 'STOPPED' } }
   * ]);
   * // result: { success: 2, failed: 0 }
   */
  async batchUpdate(
    updates: Array<{ key: string; updates: Record<string, any> }>
  ): Promise<{ success: number; failed: number }> {
    if (!this.isEnabled || !this.isConnected || !this.client || updates.length === 0) {
      return { success: 0, failed: updates.length };
    }

    let success = 0;
    let failed = 0;
    const startTime = Date.now();

    try {
      // Step 1: Get all cache entries using Pipeline
      const getPipeline = this.client.multi();

      for (const { key } of updates) {
        getPipeline.get(key);
      }

      // Execute GET pipeline
      const getResults = await getPipeline.exec();

      // Step 2: Process updates and prepare SET operations
      const setPipeline = this.client.multi();
      const validUpdates: Array<{ key: string; ttl: number; data: string }> = [];

      if (getResults) {
        for (let i = 0; i < updates.length && i < getResults.length; i++) {
          const { key, updates: fieldUpdates } = updates[i];
          const getResult = getResults[i];

          try {
            // Check if GET was successful
            // In newer Redis client, results are direct values, not [error, value] tuples
            if (!getResult) {
              // Error occurred during GET
              failed++;
              continue;
            }

            // Handle both tuple format [error, value] and direct value format
            const encryptedData = Array.isArray(getResult) && getResult.length === 2
              ? (getResult[0] === null ? getResult[1] as string | null : null)
              : (getResult as string | null);
            if (!encryptedData) {
              // Key doesn't exist - this can happen in test isolation scenarios
              // Log for debugging but don't fail the entire batch
              if (process.env.DEBUG === 'true') {
                cacheLogger.debug(
                  'Cache key not found in batch update (may be deleted by other tests)',
                  'CacheManager',
                  { key }
                );
              }
              failed++;
              continue;
            }

            // Decrypt and parse
            const data = this.decrypt(encryptedData);
            const cachedData = JSON.parse(data) as CachedData;

            // Validate expiresAt is a valid number
            if (!cachedData.expiresAt || typeof cachedData.expiresAt !== 'number' || isNaN(cachedData.expiresAt)) {
              cacheLogger.debug(
                'Invalid expiresAt in cached data for batch update',
                'CacheManager',
                { key, expiresAt: cachedData.expiresAt }
              );
              failed++;
              continue;
            }

            // Apply updates
            const now = Date.now();
            
            // Calculate remaining TTL in seconds
            // Use Math.ceil instead of Math.floor to be more lenient with timing
            const remainingTtlMs = cachedData.expiresAt - now;
            const remainingTtl = Math.max(0, Math.ceil(remainingTtlMs / 1000));

            // Allow updates if TTL is still valid (greater than 0)
            // Add 2 seconds tolerance for validation to handle race conditions and test isolation
            // This means we allow updates if expired by less than 2 seconds
            if (remainingTtl <= 0 && remainingTtlMs < -2000) {
              // Cache entry expired by more than 2 seconds
              if (process.env.DEBUG === 'true') {
                cacheLogger.debug(
                  'Cache entry expired in batch update, skipping',
                  'CacheManager',
                  { 
                    key, 
                    expiresAt: cachedData.expiresAt, 
                    now, 
                    remainingTtlMs,
                    remainingTtl 
                  }
                );
              }
              failed++;
              continue;
            }

            // Apply all field updates
            let allUpdatesSuccessful = true;
            for (const [fieldPath, value] of Object.entries(fieldUpdates)) {
              const updateSuccess = setNestedValue(cachedData, fieldPath, value);
              if (!updateSuccess) {
                allUpdatesSuccessful = false;
              }
            }
            
            if (!allUpdatesSuccessful) {
              // Some updates failed
              failed++;
              continue;
            }

            // Prepare SET operation
            const jsonData = JSON.stringify(cachedData);
            const updatedEncryptedData = this.encrypt(jsonData);
            
            validUpdates.push({ key, ttl: remainingTtl, data: updatedEncryptedData });
          } catch (error) {
            cacheLogger.error(
              'Error processing batch update for key',
              'CacheManager',
              { key },
              error as Error
            );
            failed++;
          }
        }
      }

      // Step 3: Execute SET pipeline
      if (validUpdates.length > 0) {
        for (const { key, ttl, data } of validUpdates) {
          setPipeline.setEx(key, ttl, data);
        }

        const setResults = await setPipeline.exec();
        
        // Count successful SET operations
        if (setResults) {
          for (const result of setResults) {
            // Handle both tuple format [error, value] and direct value format
            const isSuccess = Array.isArray(result) && result.length === 2
              ? result[0] === null
              : result !== null && result !== undefined;
            
            if (isSuccess) {
              // SET was successful
              success++;
            } else {
              failed++;
            }
          }
        }
      }
      
      const duration = Date.now() - startTime;
      
      if (success > 0 || failed > 0) {
        cacheLogger.info(
          'Batch cache update completed',
          'CacheManager',
          {
            total: updates.length,
            success,
            failed,
            duration,
            successRate: success / updates.length,
          }
        );
      }
    } catch (error) {
      cacheLogger.error(
        'Error in batch update',
        'CacheManager',
        { total: updates.length },
        error as Error
      );
      failed += updates.length - success;
    }

    return { success, failed };
  }

  /**
   * Deletes multiple cache keys in a single batch using Redis Pipeline
   * 
   * **CRITICAL**: Uses Redis Pipeline for performance (50-100 deletes = 1 roundtrip instead of 50-100)
   * 
   * @param keys - Array of cache keys to delete
   * @returns The number of keys successfully deleted
   * 
   * @example
   * const deleted = await cacheManager.batchDelete(['key1', 'key2', 'key3']);
   */
  async batchDelete(keys: string[]): Promise<number> {
    if (!this.isEnabled || !this.isConnected || !this.client || keys.length === 0) {
      return 0;
    }

    try {
      const startTime = Date.now();
      
      // Use Redis Pipeline for batch delete
      const pipeline = this.client.multi();
      
      for (const key of keys) {
        pipeline.del(key);
      }

      const results = await pipeline.exec();
      
      if (!results) {
        return 0;
      }

      // Count successful deletions
      let deleted = 0;
      for (const result of results) {
        // Handle both tuple format [error, value] and direct value format
        if (Array.isArray(result) && result.length === 2) {
          if (result[0] === null) {
            // DEL was successful (result[0] is error, null means success)
            // result[1] is the number of keys deleted (0 or 1)
            deleted += result[1] as number;
          }
        } else if (typeof result === 'number') {
          // Direct number result (number of keys deleted)
          deleted += result;
        }
      }

      const duration = Date.now() - startTime;
      
      if (deleted > 0) {
        cacheLogger.info(
          'Batch cache delete completed',
          'CacheManager',
          {
            total: keys.length,
            deleted,
            duration,
            successRate: deleted / keys.length,
          }
        );
      }

      return deleted;
    } catch (error) {
      cacheLogger.error(
        'Error in batch delete',
        'CacheManager',
        { total: keys.length },
        error as Error
      );
      return 0;
    }
  }

  /**
   * Gets cache statistics for admin/debug purposes
   * 
   * **WARNING**: This API is expensive (uses MEMORY USAGE + SCAN) and should NOT be used in hot-path code.
   * Primarily intended for admin/debug/monitoring purposes.
   * 
   * @returns Cache statistics including total keys, size, TTL information, etc.
   * 
   * @example
   * const stats = await cacheManager.getStats();
   * console.log(`Total keys: ${stats.totalKeys}, Total size: ${stats.totalSize} bytes`);
   */
  async getStats(): Promise<CacheAdminStats> {
    if (!this.isEnabled || !this.isConnected || !this.client) {
      return {
        totalKeys: 0,
        totalSize: 0,
      };
    }

    try {
      // Get all keys using SCAN
      const allKeys: string[] = [];
      let cursor = 0;
      const pattern = 'sap:*';

      do {
        const result = await this.client.scan(cursor, {
          MATCH: pattern,
          COUNT: 100,
        });
        cursor = result.cursor;
        allKeys.push(...result.keys);
      } while (cursor !== 0);

      // Remove duplicates (shouldn't happen, but be safe)
      const uniqueKeys = Array.from(new Set(allKeys));
      const totalKeys = uniqueKeys.length;

      if (process.env.DEBUG === 'true') {
        cacheLogger.debug(
          'Cache stats scan completed',
          'CacheManager',
          { pattern, keysFound: totalKeys }
        );
      }

      if (totalKeys === 0) {
        if (process.env.DEBUG === 'true') {
          cacheLogger.debug(
            'No cache keys found for stats',
            'CacheManager',
            { pattern }
          );
        }
        return {
          totalKeys: 0,
          totalSize: 0,
        };
      }

      // Verify keys actually exist before processing
      const existingKeys: string[] = [];
      for (const key of uniqueKeys) {
        try {
          const exists = await this.client.exists(key);
          if (exists) {
            existingKeys.push(key);
          } else if (process.env.DEBUG === 'true') {
            cacheLogger.debug(
              'Key found in scan but does not exist',
              'CacheManager',
              { key }
            );
          }
        } catch (error) {
          if (process.env.DEBUG === 'true') {
            cacheLogger.debug(
              'Error checking key existence',
              'CacheManager',
              { 
                key,
                errorMessage: error instanceof Error ? error.message : String(error)
              }
            );
          }
        }
      }

      if (existingKeys.length === 0) {
        if (process.env.DEBUG === 'true') {
          cacheLogger.debug(
            'No existing cache keys found after verification',
            'CacheManager',
            { pattern, scannedKeys: totalKeys }
          );
        }
        return {
          totalKeys: 0,
          totalSize: 0,
        };
      }

      // Calculate total size using MEMORY USAGE (expensive!)
      let totalSize = 0;
      const ttlValues: number[] = [];
      const cachedAtValues: Array<{ key: string; cachedAt: number }> = [];

      // Use pipeline for MEMORY USAGE and TTL
      // Note: MEMORY USAGE is not directly available on pipeline, so we'll fetch it separately
      const pipeline = this.client.multi();
      for (const key of existingKeys) {
        pipeline.ttl(key);
      }

      const ttlResults = await pipeline.exec();
      
      // Fetch memory usage separately (not available in pipeline)
      const memoryResults: Array<number | null> = [];
      for (const key of existingKeys) {
        try {
          const sizeResult = await this.client.sendCommand(['MEMORY', 'USAGE', key]);
          memoryResults.push(typeof sizeResult === 'number' ? sizeResult : null);
        } catch (error) {
          if (process.env.DEBUG === 'true') {
            cacheLogger.debug(
              'Error getting memory usage for key',
              'CacheManager',
              { 
                key,
                errorMessage: error instanceof Error ? error.message : String(error)
              }
            );
          }
          memoryResults.push(null);
        }
      }

      if (ttlResults) {
        for (let i = 0; i < existingKeys.length; i++) {
          const key = existingKeys[i];
          const memoryResult = memoryResults[i];
          const ttlResult = ttlResults[i];

          // Handle memory result (already processed)
          if (typeof memoryResult === 'number') {
            totalSize += memoryResult;
          }

          // Handle both tuple format [error, value] and direct value format for TTL
          if (Array.isArray(ttlResult) && ttlResult.length === 2 && ttlResult[0] === null) {
            const ttl = ttlResult[1] as number;
            if (ttl > 0) {
              ttlValues.push(ttl);
            }
          }

          // Get cachedAt from the actual cache entry
          try {
            const cachedData = await this.get(key);
            if (cachedData) {
              cachedAtValues.push({ key, cachedAt: cachedData.cachedAt });
            }
          } catch {
            // Ignore errors for individual keys
          }
        }
      }

      // Calculate average TTL
      const averageTtl = ttlValues.length > 0
        ? ttlValues.reduce((sum, ttl) => sum + ttl, 0) / ttlValues.length
        : undefined;

      // Find oldest and newest entries
      let oldestEntry: { key: string; age: number } | undefined;
      let newestEntry: { key: string; age: number } | undefined;

      if (cachedAtValues.length > 0) {
        const now = Date.now();
        const entriesWithAge = cachedAtValues.map(({ key, cachedAt }) => ({
          key,
          age: Math.floor((now - cachedAt) / 1000),
        }));

        oldestEntry = entriesWithAge.reduce((oldest, current) =>
          current.age > oldest.age ? current : oldest
        );

        newestEntry = entriesWithAge.reduce((newest, current) =>
          current.age < newest.age ? current : newest
        );
      }

      const stats = {
        totalKeys: existingKeys.length,
        totalSize,
        averageTtl,
        oldestEntry,
        newestEntry,
      };
      
      cacheLogger.debug(
        'Cache statistics retrieved',
        'CacheManager',
        {
          totalKeys: existingKeys.length,
          scannedKeys: totalKeys,
          totalSize,
          averageTtl: averageTtl || undefined,
        }
      );
      
      return stats;
    } catch (error) {
      cacheLogger.error(
        'Error getting cache stats',
        'CacheManager',
        {},
        error as Error
      );
      return {
        totalKeys: 0,
        totalSize: 0,
      };
    }
  }

  /**
   * Gets cache statistics for keys matching a specific pattern
   * 
   * **WARNING**: This API is expensive (uses MEMORY USAGE + SCAN) and should not be used in hot-path code.
   * Primarily intended for admin/debug/monitoring purposes.
   * 
   * @param pattern - The pattern to match cache keys (e.g., 'sap:*:GET:/IntegrationPackages*')
   * @returns Cache statistics for matching keys
   * 
   * @example
   * const stats = await cacheManager.getStatsByPattern('sap:*:GET:/IntegrationRuntimeArtifacts*');
   * console.log(`Matching keys: ${stats.totalKeys}, Total size: ${stats.totalSize} bytes`);
   */
  async getStatsByPattern(pattern: string): Promise<CacheAdminStats> {
    if (!this.isEnabled || !this.isConnected || !this.client) {
      return {
        totalKeys: 0,
        totalSize: 0,
      };
    }

    try {
      // Find all keys matching the pattern
      const allKeys = await this.findKeysByPattern(pattern);

      const totalKeys = allKeys.length;

      if (totalKeys === 0) {
        return {
          totalKeys: 0,
          totalSize: 0,
        };
      }

      // Calculate total size using MEMORY USAGE (expensive!)
      let totalSize = 0;
      const ttlValues: number[] = [];
      const cachedAtValues: Array<{ key: string; cachedAt: number }> = [];

      // Use pipeline for TTL
      const pipeline = this.client.multi();
      for (const key of allKeys) {
        pipeline.ttl(key);
      }

      const ttlResults = await pipeline.exec();
      
      // Fetch memory usage separately (not available in pipeline)
      const memoryResults: Array<number | null> = [];
      for (const key of allKeys) {
        try {
          const sizeResult = await this.client.sendCommand(['MEMORY', 'USAGE', key]);
          memoryResults.push(typeof sizeResult === 'number' ? sizeResult : null);
        } catch {
          memoryResults.push(null);
        }
      }

      if (ttlResults) {
        for (let i = 0; i < allKeys.length; i++) {
          const key = allKeys[i];
          const memoryResult = memoryResults[i];
          const ttlResult = ttlResults[i];

          // Handle memory result
          if (typeof memoryResult === 'number') {
            totalSize += memoryResult;
          }

          // Handle both tuple format [error, value] and direct value format for TTL
          if (Array.isArray(ttlResult) && ttlResult.length === 2 && ttlResult[0] === null) {
            const ttl = ttlResult[1] as number;
            if (ttl > 0) {
              ttlValues.push(ttl);
            }
          }

          // Get cachedAt from the actual cache entry
          try {
            const cachedData = await this.get(key);
            if (cachedData) {
              cachedAtValues.push({ key, cachedAt: cachedData.cachedAt });
            }
          } catch {
            // Ignore errors for individual keys
          }
        }
      }

      // Calculate average TTL
      const averageTtl = ttlValues.length > 0
        ? ttlValues.reduce((sum, ttl) => sum + ttl, 0) / ttlValues.length
        : undefined;

      // Find oldest and newest entries
      let oldestEntry: { key: string; age: number } | undefined;
      let newestEntry: { key: string; age: number } | undefined;

      if (cachedAtValues.length > 0) {
        const now = Date.now();
        const entriesWithAge = cachedAtValues.map(({ key, cachedAt }) => ({
          key,
          age: Math.floor((now - cachedAt) / 1000),
        }));

        oldestEntry = entriesWithAge.reduce((oldest, current) =>
          current.age > oldest.age ? current : oldest
        );

        newestEntry = entriesWithAge.reduce((newest, current) =>
          current.age < newest.age ? current : newest
        );
      }

      const stats = {
        totalKeys,
        totalSize,
        averageTtl,
        oldestEntry,
        newestEntry,
      };
      
      cacheLogger.debug(
        'Cache statistics by pattern retrieved',
        'CacheManager',
        {
          pattern,
          totalKeys,
          totalSize,
          averageTtl: averageTtl || undefined,
        }
      );
      
      return stats;
    } catch (error) {
      cacheLogger.error(
        'Error getting cache stats by pattern',
        'CacheManager',
        { pattern },
        error as Error
      );
      return {
        totalKeys: 0,
        totalSize: 0,
      };
    }
  }

  /**
   * Gets the health status of the cache
   * 
   * @returns Health status including connection status, total keys, and uptime
   * 
   * @example
   * const health = await cacheManager.getCacheHealth();
   * console.log(`Cache is ${health.isHealthy ? 'healthy' : 'unhealthy'}, Uptime: ${health.uptime}s`);
   */
  async getCacheHealth(): Promise<{
    isHealthy: boolean;
    connectionStatus: 'connected' | 'disconnected' | 'error';
    totalKeys: number;
    errorRate?: number;
    lastError?: string;
    uptime: number;
  }> {
    let connectionStatus: 'connected' | 'disconnected' | 'error' = 'disconnected';
    let isHealthy = false;
    let totalKeys = 0;
    let uptime = 0;

    try {
      // Check connection status
      if (this.isEnabled && this.isConnected && this.client) {
        connectionStatus = 'connected';
        isHealthy = true;

        // Calculate uptime
        if (this.connectedAt) {
          uptime = Math.floor((Date.now() - this.connectedAt) / 1000);
        }

        // Get total keys (use findKeysByPattern for performance instead of getStats)
        try {
          const keys = await this.findKeysByPattern('sap:*');
          totalKeys = keys.length;
        } catch {
          // If pattern matching fails, try to get stats (more expensive)
          try {
            const stats = await this.getStats();
            totalKeys = stats.totalKeys;
          } catch (statsError) {
            // Ignore errors, keep totalKeys at 0
            cacheLogger.debug(
              'Error getting total keys for health check',
              'CacheManager',
              { error: statsError instanceof Error ? statsError.message : String(statsError) }
            );
          }
        }
      } else if (this.isEnabled && !this.isConnected) {
        connectionStatus = 'disconnected';
        isHealthy = false;
      } else if (!this.isEnabled) {
        connectionStatus = 'disconnected';
        isHealthy = false;
      }
    } catch (error) {
      connectionStatus = 'error';
      isHealthy = false;
      cacheLogger.error(
        'Error getting cache health',
        'CacheManager',
        {},
        error as Error
      );
    }

    return {
      isHealthy,
      connectionStatus,
      totalKeys,
      uptime,
    };
  }

  /**
   * Gets cache statistics grouped by endpoint
   * 
   * **WARNING**: This API is expensive (uses MEMORY USAGE + SCAN) and should not be used in hot-path code.
   * Primarily intended for admin/debug/monitoring purposes.
   * 
   * @param endpoint - The endpoint path (e.g., '/IntegrationPackages' or '/IntegrationRuntimeArtifacts')
   * @returns Aggregated statistics for the endpoint
   * 
   * @example
   * const stats = await cacheManager.getStatsByEndpoint('/IntegrationPackages');
   * console.log(`Endpoint: ${stats.endpoint}, Keys: ${stats.keys}, Size: ${stats.totalSize} bytes`);
   */
  async getStatsByEndpoint(endpoint: string): Promise<{
    endpoint: string;
    keys: number;
    totalSize: number;
    averageTtl?: number;
  }> {
    if (!this.isEnabled || !this.isConnected || !this.client) {
      return {
        endpoint,
        keys: 0,
        totalSize: 0,
      };
    }

    try {
      // Create pattern to match all keys for this endpoint
      // Format: sap:*:GET:/Endpoint*
      const pattern = `sap:*:GET:${endpoint}*`;
      
      // Find all keys matching the endpoint pattern
      const keys = await this.findKeysByPattern(pattern);

      const keyCount = keys.length;

      if (keyCount === 0) {
        return {
          endpoint,
          keys: 0,
          totalSize: 0,
        };
      }

      // Calculate total size and average TTL
      let totalSize = 0;
      const ttlValues: number[] = [];

      // Use pipeline for TTL
      const pipeline = this.client.multi();
      for (const key of keys) {
        pipeline.ttl(key);
      }

      const ttlResults = await pipeline.exec();
      
      // Fetch memory usage separately (not available in pipeline)
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        
        try {
          const sizeResult = await this.client.sendCommand(['MEMORY', 'USAGE', key]);
          if (typeof sizeResult === 'number') {
            totalSize += sizeResult;
          }
        } catch {
          // Ignore errors for individual keys
        }

        // Handle TTL result
        if (ttlResults && i < ttlResults.length) {
          const ttlResult = ttlResults[i];
          if (Array.isArray(ttlResult) && ttlResult.length === 2 && ttlResult[0] === null) {
            const ttl = ttlResult[1] as number;
            if (ttl > 0) {
              ttlValues.push(ttl);
            }
          }
        }
      }

      // Calculate average TTL
      const averageTtl = ttlValues.length > 0
        ? ttlValues.reduce((sum, ttl) => sum + ttl, 0) / ttlValues.length
        : undefined;

      const stats = {
        endpoint,
        keys: keyCount,
        totalSize,
        averageTtl,
      };
      
      cacheLogger.debug(
        'Cache statistics by endpoint retrieved',
        'CacheManager',
        {
          endpoint,
          keys: keyCount,
          totalSize,
          averageTtl: averageTtl || undefined,
        }
      );
      
      return stats;
    } catch (error) {
      cacheLogger.error(
        'Error getting cache stats by endpoint',
        'CacheManager',
        { endpoint },
        error as Error
      );
      return {
        endpoint,
        keys: 0,
        totalSize: 0,
      };
    }
  }

  /**
   * Gets information about a specific cache key
   * 
   * **WARNING**: This API uses MEMORY USAGE which is expensive and should NOT be used in hot-path code.
   * Primarily intended for admin/debug purposes.
   * 
   * @param key - The cache key to get information about
   * @returns Information about the cache key, or null if the key doesn't exist
   * 
   * @example
   * const info = await cacheManager.getKeyInfo('sap:hostname:GET:/IntegrationRuntimeArtifacts');
   * if (info) {
   *   console.log(`Key exists: ${info.exists}, TTL: ${info.ttl}s, Size: ${info.size} bytes`);
   * }
   */
  async getKeyInfo(key: string): Promise<CacheKeyInfo | null> {
    if (!this.isEnabled || !this.isConnected || !this.client) {
      return null;
    }

    try {
      // Check if key exists and get TTL
      const exists = await this.client.exists(key);
      if (!exists) {
        return {
          key,
          exists: false,
          size: 0,
          ttl: -1,
          age: 0,
          expiresAt: 0,
          revalidateAfter: 0,
        };
      }

      // Get TTL
      const ttl = await this.client.ttl(key);

      // Get size using MEMORY USAGE (expensive!)
      // Use sendCommand as memory() is not directly available
      const sizeResult = await this.client.sendCommand(['MEMORY', 'USAGE', key]);
      const size = typeof sizeResult === 'number' ? sizeResult : 0;

      // Get cached data to extract metadata
      const cachedData = await this.get(key);
      if (!cachedData) {
        return {
          key,
          exists: true,
          size,
          ttl,
          age: 0,
          expiresAt: 0,
          revalidateAfter: 0,
        };
      }

      const now = Date.now();
      const age = Math.floor((now - cachedData.cachedAt) / 1000);

      const info = {
        key,
        exists: true,
        size,
        ttl,
        age,
        expiresAt: cachedData.expiresAt,
        revalidateAfter: cachedData.revalidateAfter,
      };
      
      cacheLogger.debug(
        'Cache key info retrieved',
        'CacheManager',
        {
          key,
          exists: true,
          size,
          ttl,
          age,
        }
      );
      
      return info;
    } catch (error) {
      cacheLogger.error(
        'Error getting key info',
        'CacheManager',
        { key },
        error as Error
      );
      return null;
    }
  }

  /**
   * Adds an artifact to a cache entry
   * 
   * @param key - The cache key to update
   * @param artifact - The artifact to add
   * @param options - Optional configuration
   * @param options.arrayPath - Custom dot-notation path to the array (e.g. 'data.custom.path')
   * @param options.preventDuplicates - If true, prevents adding duplicate artifacts
   * @returns true if the artifact was added successfully, false otherwise
   * 
   * @example
   * const success = await cacheManager.addToCache('my-key', newArtifact, {
   *   preventDuplicates: true
   * });
   */
  async addToCache(
    key: string,
    artifact: any,
    options?: {
      arrayPath?: string;
      preventDuplicates?: boolean;
    }
  ): Promise<boolean> {
    if (!this.isEnabled || !this.isConnected || !this.client) {
      return false;
    }

    try {
      const success = await this.updatePartial(key, (cachedData) => {
        const updated = addArtifactToCacheArray(cachedData, artifact, options);
        if (!updated) {
          cacheLogger.debug(
            'Failed to add artifact to cache array',
            'CacheManager',
            { key, artifactId: artifact?.Id || artifact?.id }
          );
          return cachedData; // Return original if update failed
        }
        return updated;
      });

      if (success) {
        cacheLogger.debug(
          'Successfully added artifact to cache',
          'CacheManager',
          { key, artifactId: artifact?.Id || artifact?.id }
        );
      }

      return success;
    } catch (error) {
      cacheLogger.error(
        'Error adding artifact to cache',
        'CacheManager',
        { key, artifactId: artifact?.Id || artifact?.id },
        error as Error
      );
      return false;
    }
  }

  /**
   * Removes an artifact from a cache entry
   * 
   * @param key - The cache key to update
   * @param artifactId - The ID of the artifact to remove
   * @param options - Optional configuration
   * @param options.arrayPath - Custom dot-notation path to the array (e.g. 'data.custom.path')
   * @returns true if the artifact was removed successfully, false otherwise
   * 
   * @example
   * const success = await cacheManager.removeFromCache('my-key', 'MyArtifactId');
   */
  async removeFromCache(
    key: string,
    artifactId: string,
    options?: {
      arrayPath?: string;
    }
  ): Promise<boolean> {
    if (!this.isEnabled || !this.isConnected || !this.client) {
      return false;
    }

    try {
      const success = await this.updatePartial(key, (cachedData) => {
        const updated = removeArtifactFromCacheArray(cachedData, artifactId, options);
        if (!updated) {
          cacheLogger.debug(
            'Failed to remove artifact from cache array',
            'CacheManager',
            { key, artifactId }
          );
          return cachedData; // Return original if update failed
        }
        return updated;
      });

      if (success) {
        cacheLogger.debug(
          'Successfully removed artifact from cache',
          'CacheManager',
          { key, artifactId }
        );
      }

      return success;
    } catch (error) {
      cacheLogger.error(
        'Error removing artifact from cache',
        'CacheManager',
        { key, artifactId },
        error as Error
      );
      return false;
    }
  }

  /**
   * Adds multiple artifacts to cache entries in a single batch using Redis Pipeline
   * 
   * **CRITICAL**: Uses Redis Pipeline for performance (50-100 updates = 1 roundtrip instead of 50-100)
   * 
   * @param updates - Array of artifact addition operations, each containing a key, artifact, and optional options
   * @returns Object with success and failed counts
   * 
   * @example
   * const result = await cacheManager.batchAddToCache([
   *   { key: 'key1', artifact: { Id: 'Artifact1' }, options: { preventDuplicates: true } },
   *   { key: 'key2', artifact: { Id: 'Artifact2' } }
   * ]);
   * // result: { success: 2, failed: 0 }
   */
  async batchAddToCache(
    updates: Array<{
      key: string;
      artifact: any;
      options?: {
        arrayPath?: string;
        preventDuplicates?: boolean;
      };
    }>
  ): Promise<{ success: number; failed: number }> {
    if (!this.isEnabled || !this.isConnected || !this.client || updates.length === 0) {
      return { success: 0, failed: updates.length };
    }

    let success = 0;
    let failed = 0;
    const startTime = Date.now();

    try {
      // Step 1: Get all cache entries using Pipeline
      const getPipeline = this.client.multi();

      for (const { key } of updates) {
        getPipeline.get(key);
      }

      // Execute GET pipeline
      const getResults = await getPipeline.exec();

      // Step 2: Process artifact additions and prepare SET operations
      const setPipeline = this.client.multi();
      const validUpdates: Array<{ key: string; ttl: number; data: string }> = [];

      if (getResults) {
        for (let i = 0; i < updates.length && i < getResults.length; i++) {
          const { key, artifact, options } = updates[i];
          const getResult = getResults[i];

          try {
            // Check if GET was successful
            if (!getResult) {
              failed++;
              continue;
            }

            // Handle both tuple format [error, value] and direct value format
            const encryptedData = Array.isArray(getResult) && getResult.length === 2
              ? (getResult[0] === null ? getResult[1] as string | null : null)
              : (getResult as string | null);
            
            if (!encryptedData) {
              // Key doesn't exist
              failed++;
              continue;
            }

            // Decrypt and parse
            const data = this.decrypt(encryptedData);
            const cachedData = JSON.parse(data) as CachedData;

            // Check if entry has expired
            const now = Date.now();
            const remainingTtl = Math.max(0, Math.floor((cachedData.expiresAt - now) / 1000));

            if (remainingTtl <= 0) {
              // Cache entry expired
              failed++;
              continue;
            }

            // Add artifact to cache array
            const updated = addArtifactToCacheArray(cachedData, artifact, options);
            if (!updated) {
              // Failed to add artifact (e.g., duplicate prevented)
              failed++;
              continue;
            }

            // Prepare SET operation
            const jsonData = JSON.stringify(updated);
            const updatedEncryptedData = this.encrypt(jsonData);
            
            validUpdates.push({ key, ttl: remainingTtl, data: updatedEncryptedData });
          } catch (error) {
            cacheLogger.error(
              'Error processing batch add to cache for key',
              'CacheManager',
              { key, artifactId: artifact?.Id || artifact?.id },
              error as Error
            );
            failed++;
          }
        }
      }

      // Step 3: Execute SET pipeline
      if (validUpdates.length > 0) {
        for (const { key, ttl, data } of validUpdates) {
          setPipeline.setEx(key, ttl, data);
        }

        const setResults = await setPipeline.exec();
        
        // Count successful SET operations
        if (setResults) {
          for (const result of setResults) {
            // Handle both tuple format [error, value] and direct value format
            const isSuccess = Array.isArray(result) && result.length === 2
              ? result[0] === null
              : result !== null && result !== undefined;
            
            if (isSuccess) {
              success++;
            } else {
              failed++;
            }
          }
        }
      }
      
      const duration = Date.now() - startTime;
      
      if (success > 0 || failed > 0) {
        cacheLogger.info(
          'Batch add to cache completed',
          'CacheManager',
          {
            total: updates.length,
            success,
            failed,
            duration,
            successRate: success / updates.length,
          }
        );
      }
    } catch (error) {
      cacheLogger.error(
        'Error in batch add to cache',
        'CacheManager',
        { total: updates.length },
        error as Error
      );
      failed += updates.length - success;
    }

    return { success, failed };
  }

  /**
   * Updates the TTL (Time-To-Live) of a cache entry
   * 
   * @param key - The cache key to update
   * @param newTTL - The new TTL in seconds
   * @returns true if the TTL was updated successfully, false otherwise
   * 
   * @example
   * const success = await cacheManager.updateTTL('my-key', 3600); // Set TTL to 1 hour
   */
  async updateTTL(key: string, newTTL: number): Promise<boolean> {
    if (!this.isEnabled || !this.isConnected || !this.client) {
      return false;
    }

    try {
      // Get current cache entry
      const cachedData = await this.get(key);
      if (!cachedData) {
        cacheLogger.debug(
          'Cache key not found for TTL update',
          'CacheManager',
          { key }
        );
        return false;
      }

      // Calculate new expiration time
      const now = Date.now();
      const newExpiresAt = now + (newTTL * 1000);

      // Update expiresAt in cached data
      const updatedData: CachedData = {
        ...cachedData,
        expiresAt: newExpiresAt,
      };

      // Save with new TTL
      const jsonData = JSON.stringify(updatedData);
      const encryptedData = this.encrypt(jsonData);

      await this.client.setEx(key, newTTL, encryptedData);

      cacheLogger.debug(
        'Successfully updated TTL',
        'CacheManager',
        { key, newTTL, newExpiresAt }
      );

      return true;
    } catch (error) {
      cacheLogger.error(
        'Error updating TTL',
        'CacheManager',
        { key, newTTL },
        error as Error
      );
      return false;
    }
  }

  /**
   * Extends the TTL (Time-To-Live) of a cache entry by adding additional seconds
   * 
   * @param key - The cache key to update
   * @param additionalSeconds - The number of seconds to add to the current TTL
   * @returns true if the TTL was extended successfully, false otherwise
   * 
   * @example
   * const success = await cacheManager.extendTTL('my-key', 1800); // Add 30 minutes
   */
  async extendTTL(key: string, additionalSeconds: number): Promise<boolean> {
    if (!this.isEnabled || !this.isConnected || !this.client) {
      return false;
    }

    try {
      // Get current cache entry
      const cachedData = await this.get(key);
      if (!cachedData) {
        cacheLogger.debug(
          'Cache key not found for TTL extension',
          'CacheManager',
          { key }
        );
        return false;
      }

      // Calculate current remaining TTL
      const now = Date.now();
      const remainingTTL = Math.max(0, Math.floor((cachedData.expiresAt - now) / 1000));

      // Check if entry has already expired
      if (remainingTTL <= 0) {
        cacheLogger.debug(
          'Cache entry expired, cannot extend TTL',
          'CacheManager',
          { key, expiresAt: cachedData.expiresAt, now }
        );
        return false;
      }

      // Calculate new TTL
      const newTTL = remainingTTL + additionalSeconds;

      // Use updateTTL to set the new TTL
      return await this.updateTTL(key, newTTL);
    } catch (error) {
      cacheLogger.error(
        'Error extending TTL',
        'CacheManager',
        { key, additionalSeconds },
        error as Error
      );
      return false;
    }
  }

  /**
   * Updates TTL for multiple cache keys in a single batch using Redis Pipeline
   * 
   * **CRITICAL**: Uses Redis Pipeline for performance (50-100 updates = 1 roundtrip instead of 50-100)
   * 
   * @param updates - Array of TTL update operations, each containing a key and new TTL
   * @returns Object with success and failed counts
   * 
   * @example
   * const result = await cacheManager.batchUpdateTTL([
   *   { key: 'key1', ttl: 3600 },
   *   { key: 'key2', ttl: 7200 }
   * ]);
   * // result: { success: 2, failed: 0 }
   */
  async batchUpdateTTL(
    updates: Array<{ key: string; ttl: number }>
  ): Promise<{ success: number; failed: number }> {
    if (!this.isEnabled || !this.isConnected || !this.client || updates.length === 0) {
      return { success: 0, failed: updates.length };
    }

    let success = 0;
    let failed = 0;
    const startTime = Date.now();

    try {
      // Step 1: Get all cache entries using Pipeline
      const getPipeline = this.client.multi();

      for (const { key } of updates) {
        getPipeline.get(key);
      }

      // Execute GET pipeline
      const getResults = await getPipeline.exec();

      // Step 2: Process TTL updates and prepare SET operations
      const setPipeline = this.client.multi();
      const validUpdates: Array<{ key: string; ttl: number; data: string }> = [];

      if (getResults) {
        for (let i = 0; i < updates.length && i < getResults.length; i++) {
          const { key, ttl: newTTL } = updates[i];
          const getResult = getResults[i];

          try {
            // Check if GET was successful
            if (!getResult) {
              failed++;
              continue;
            }

            // Handle both tuple format [error, value] and direct value format
            const encryptedData = Array.isArray(getResult) && getResult.length === 2
              ? (getResult[0] === null ? getResult[1] as string | null : null)
              : (getResult as string | null);
            
            if (!encryptedData) {
              // Key doesn't exist
              failed++;
              continue;
            }

            // Decrypt and parse
            const data = this.decrypt(encryptedData);
            const cachedData = JSON.parse(data) as CachedData;

            // Calculate new expiration time
            const now = Date.now();
            const newExpiresAt = now + (newTTL * 1000);

            // Update expiresAt in cached data
            const updatedData: CachedData = {
              ...cachedData,
              expiresAt: newExpiresAt,
            };

            // Prepare SET operation
            const jsonData = JSON.stringify(updatedData);
            const updatedEncryptedData = this.encrypt(jsonData);
            
            validUpdates.push({ key, ttl: newTTL, data: updatedEncryptedData });
          } catch (error) {
            cacheLogger.error(
              'Error processing batch TTL update for key',
              'CacheManager',
              { key },
              error as Error
            );
            failed++;
          }
        }
      }

      // Step 3: Execute SET pipeline
      if (validUpdates.length > 0) {
        for (const { key, ttl, data } of validUpdates) {
          setPipeline.setEx(key, ttl, data);
        }

        const setResults = await setPipeline.exec();
        
        // Count successful SET operations
        if (setResults) {
          for (const result of setResults) {
            // Handle both tuple format [error, value] and direct value format
            const isSuccess = Array.isArray(result) && result.length === 2
              ? result[0] === null
              : result !== null && result !== undefined;
            
            if (isSuccess) {
              success++;
            } else {
              failed++;
            }
          }
        }
      }
      
      const duration = Date.now() - startTime;
      
      if (success > 0 || failed > 0) {
        cacheLogger.info(
          'Batch TTL update completed',
          'CacheManager',
          {
            total: updates.length,
            success,
            failed,
            duration,
            successRate: success / updates.length,
          }
        );
      }
    } catch (error) {
      cacheLogger.error(
        'Error in batch TTL update',
        'CacheManager',
        { total: updates.length },
        error as Error
      );
      failed += updates.length - success;
    }

    return { success, failed };
  }

  /**
   * Warms the cache by pre-loading multiple endpoints
   * 
   * @param endpoints - Array of endpoints to warm, each containing cache key, fetch function, and cache options
   * @param config - Optional configuration for warming behavior
   * @param config.timeout - Timeout per endpoint in milliseconds (default: 30000)
   * @param config.parallel - Whether to execute endpoints in parallel (default: true)
   * @returns Statistics about the warming operation (success count, failed count, duration, errors)
   * 
   * @example
   * const result = await cacheManager.warmCache([
   *   {
   *     key: 'sap:hostname:GET:/IntegrationPackages',
   *     fetchFn: () => api.getIntegrationPackages(),
   *     options: { ttl: 3600, revalidateAfter: 1800 }
   *   }
   * ]);
   */
  async warmCache(
    endpoints: Array<{
      key: string;
      fetchFn: () => Promise<any>;
      options?: CacheOptions;
    }>,
    config?: {
      timeout?: number;
      parallel?: boolean;
    }
  ): Promise<{
    success: number;
    failed: number;
    duration: number;
    errors?: Array<{ key: string; error: string }>;
  }> {
    if (!this.isEnabled || !this.isConnected || !this.client) {
      return {
        success: 0,
        failed: endpoints.length,
        duration: 0,
        errors: endpoints.map(e => ({ key: e.key, error: 'Cache not available' })),
      };
    }

    if (endpoints.length === 0) {
      return {
        success: 0,
        failed: 0,
        duration: 0,
      };
    }

    const startTime = Date.now();
    const timeout = config?.timeout ?? 30000;
    const parallel = config?.parallel !== false; // Default to true
    const errors: Array<{ key: string; error: string }> = [];
    let success = 0;
    let failed = 0;

    try {
      // Default cache options if not provided
      const defaultOptions: CacheOptions = {
        ttl: 3600, // 1 hour
        revalidateAfter: 1800, // 30 minutes
      };

      if (parallel) {
        // Parallel execution using Promise.allSettled
        const promises = endpoints.map(async (endpointConfig) => {
          const { key, fetchFn, options } = endpointConfig;
          
          try {
            // Create timeout promise
            const timeoutPromise = new Promise<never>((_, reject) => {
              setTimeout(() => reject(new Error(`Timeout after ${timeout}ms`)), timeout);
            });

            // Race between fetch and timeout
            const data = await Promise.race([fetchFn(), timeoutPromise]);

            // Cache the data
            await this.set(key, data, options || defaultOptions);

            return { key, success: true };
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            errors.push({ key, error: errorMessage });
            return { key, success: false };
          }
        });

        const results = await Promise.allSettled(promises);
        
        for (const result of results) {
          if (result.status === 'fulfilled') {
            if (result.value.success) {
              success++;
            } else {
              failed++;
            }
          } else {
            failed++;
          }
        }
      } else {
        // Sequential execution
        for (const endpointConfig of endpoints) {
          const { key, fetchFn, options } = endpointConfig;
          
          try {
            // Create timeout promise
            const timeoutPromise = new Promise<never>((_, reject) => {
              setTimeout(() => reject(new Error(`Timeout after ${timeout}ms`)), timeout);
            });

            // Race between fetch and timeout
            const data = await Promise.race([fetchFn(), timeoutPromise]);

            // Cache the data
            await this.set(key, data, options || defaultOptions);

            success++;
          } catch (error) {
            failed++;
            const errorMessage = error instanceof Error ? error.message : String(error);
            errors.push({ key, error: errorMessage });
          }
        }
      }

      const duration = Date.now() - startTime;

      cacheLogger.info(
        'Cache warming completed',
        'CacheManager',
        {
          total: endpoints.length,
          success,
          failed,
          duration,
          successRate: success / endpoints.length,
        }
      );

      return {
        success,
        failed,
        duration,
        errors: errors.length > 0 ? errors : undefined,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      cacheLogger.error(
        'Error in cache warming',
        'CacheManager',
        { total: endpoints.length },
        error as Error
      );
      
      return {
        success,
        failed: endpoints.length - success,
        duration,
        errors: errors.length > 0 ? errors : undefined,
      };
    }
  }

  /**
   * Validates a single cache entry for consistency and validity
   * 
   * @param key - The cache key to validate
   * @param options - Optional validation options
   * @param options.compareWithSap - Whether to compare cache data with SAP API (requires fetchFn)
   * @param options.fetchFn - Function to fetch fresh data from SAP API for comparison
   * @param options.autoRepair - Whether to automatically repair invalid entries
   * @returns Validation result with validity status, issues, and optional repair status
   * 
   * @example
   * const result = await cacheManager.validateCacheEntry('my-key', {
   *   compareWithSap: true,
   *   fetchFn: () => api.getData(),
   *   autoRepair: true
   * });
   */
  async validateCacheEntry(
    key: string,
    options?: {
      compareWithSap?: boolean;
      fetchFn?: () => Promise<any>;
      autoRepair?: boolean;
    }
  ): Promise<{
    isValid: boolean;
    issues: string[];
    repaired?: boolean;
    comparisonResult?: {
      matches: boolean;
      differences?: string[];
    };
  }> {
    if (!this.isEnabled || !this.isConnected || !this.client) {
      return {
        isValid: false,
        issues: ['Cache not available'],
      };
    }

    const issues: string[] = [];
    let repaired = false;

    try {
      // Get cache entry
      const cachedData = await this.get(key);
      
      if (!cachedData) {
        return {
          isValid: false,
          issues: ['Key not found'],
        };
      }

      // Validate data structure
      if (!cachedData.data) {
        issues.push('Missing data field');
      }

      // Validate timestamps
      const now = Date.now();
      
      if (cachedData.expiresAt <= now) {
        issues.push('Cache entry expired');
      }

      if (cachedData.cachedAt > now) {
        issues.push('Invalid cachedAt timestamp (future date)');
      }

      if (cachedData.expiresAt <= cachedData.cachedAt) {
        issues.push('Invalid expiresAt timestamp (before cachedAt)');
      }

      // Optional: Compare with SAP API
      let comparisonResult: { matches: boolean; differences?: string[] } | undefined;
      
      if (options?.compareWithSap && options?.fetchFn) {
        try {
          const freshData = await options.fetchFn();
          
          // Simple deep equality check (can be enhanced)
          const cachedDataStr = JSON.stringify(cachedData.data);
          const freshDataStr = JSON.stringify(freshData);
          
          const matches = cachedDataStr === freshDataStr;
          
          if (!matches) {
            issues.push('Cache data differs from SAP API');
            comparisonResult = {
              matches: false,
              differences: ['Data structure or content mismatch'],
            };
          } else {
            comparisonResult = {
              matches: true,
            };
          }
        } catch (error) {
          issues.push(`Failed to compare with SAP API: ${error instanceof Error ? error.message : String(error)}`);
        }
      }

      // Auto-repair if enabled
      if (options?.autoRepair && issues.length > 0) {
        // Check if entry is expired
        if (cachedData.expiresAt <= now) {
          // Delete expired entry
          await this.delete(key);
          repaired = true;
          issues.push('Expired entry deleted');
        } else if (issues.some(issue => issue.includes('Invalid'))) {
          // Delete invalid entry
          await this.delete(key);
          repaired = true;
          issues.push('Invalid entry deleted');
        } else if (comparisonResult && !comparisonResult.matches && options?.fetchFn) {
          // Update cache with fresh data
          try {
            const freshData = await options.fetchFn();
            await this.set(key, freshData, {
              ttl: 3600,
              revalidateAfter: 1800,
            });
            repaired = true;
            issues.push('Cache entry updated with fresh data from SAP API');
          } catch (error) {
            issues.push(`Failed to repair: ${error instanceof Error ? error.message : String(error)}`);
          }
        }
      }

      const isValid = issues.length === 0;

      return {
        isValid,
        issues,
        repaired: repaired || undefined,
        comparisonResult,
      };
    } catch (error) {
      cacheLogger.error(
        'Error validating cache entry',
        'CacheManager',
        { key },
        error as Error
      );
      return {
        isValid: false,
        issues: [`Validation error: ${error instanceof Error ? error.message : String(error)}`],
      };
    }
  }

  /**
   * Validates all cache entries matching a pattern
   * 
   * @param pattern - The pattern to match cache keys (supports wildcards like *)
   * @param options - Optional validation options
   * @param options.autoRepair - Whether to automatically repair invalid entries
   * @param options.compareWithSap - Whether to compare cache data with SAP API (requires fetchFn)
   * @param options.fetchFn - Function to fetch fresh data from SAP API for comparison (receives key as parameter)
   * @returns Validation statistics and issues per key
   * 
   * @example
   * const result = await cacheManager.validateCacheByPattern('sap:hostname:GET:/IntegrationPackages*', {
   *   autoRepair: true
   * });
   */
  async validateCacheByPattern(
    pattern: string,
    options?: {
      autoRepair?: boolean;
      compareWithSap?: boolean;
      fetchFn?: (key: string) => Promise<any>;
    }
  ): Promise<{
    total: number;
    valid: number;
    invalid: number;
    repaired: number;
    issues: Array<{ key: string; issues: string[] }>;
  }> {
    if (!this.isEnabled || !this.isConnected || !this.client) {
      return {
        total: 0,
        valid: 0,
        invalid: 0,
        repaired: 0,
        issues: [],
      };
    }

    try {
      // Find all keys matching the pattern
      const keys = await this.findKeysByPattern(pattern);
      
      if (keys.length === 0) {
        return {
          total: 0,
          valid: 0,
          invalid: 0,
          repaired: 0,
          issues: [],
        };
      }

      let valid = 0;
      let invalid = 0;
      let repaired = 0;
      const issues: Array<{ key: string; issues: string[] }> = [];

      // Validate each key
      for (const key of keys) {
        const fetchFn = options?.fetchFn 
          ? () => options.fetchFn!(key)
          : undefined;

        const result = await this.validateCacheEntry(key, {
          compareWithSap: options?.compareWithSap,
          fetchFn,
          autoRepair: options?.autoRepair,
        });

        if (result.isValid) {
          valid++;
        } else {
          invalid++;
        }

        if (result.repaired) {
          repaired++;
        }

        if (result.issues.length > 0) {
          issues.push({
            key,
            issues: result.issues,
          });
        }
      }

      cacheLogger.info(
        'Cache validation by pattern completed',
        'CacheManager',
        {
          pattern,
          total: keys.length,
          valid,
          invalid,
          repaired,
        }
      );

      return {
        total: keys.length,
        valid,
        invalid,
        repaired,
        issues,
      };
    } catch (error) {
      cacheLogger.error(
        'Error validating cache by pattern',
        'CacheManager',
        { pattern },
        error as Error
      );
      return {
        total: 0,
        valid: 0,
        invalid: 0,
        repaired: 0,
        issues: [],
      };
    }
  }

  /**
   * Gets data from cache or fetches it using the provided function
   * Implements Stale-While-Revalidate pattern:
   * - If data is in cache and fresh: return immediately
   * - If data is in cache but stale: return immediately, revalidate in background
   * - If data is expired or not in cache: fetch fresh data
   *
   * @param key - The cache key
   * @param fetchFn - Function to fetch fresh data
   * @param options - Cache options (TTL and revalidation time)
   * @param forceRefresh - Force fetching fresh data regardless of cache state
   * @returns Object containing data and cache info
   *
   * @example
   * const result = await cacheManager.getOrFetch(
   *   'sap:hostname:GET:/IntegrationPackages',
   *   async () => await api.getPackages(),
   *   { ttl: 2592000, revalidateAfter: 300 },
   *   false
   * );
   * console.log(result.data);     // The actual data
   * console.log(result.cacheInfo); // { hit: true, age: 120, status: 'HIT' }
   */
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options: CacheOptions,
    forceRefresh: boolean = false
  ): Promise<{ data: T; cacheInfo: { hit: boolean; age: number | null; status: 'HIT' | 'HIT-STALE' | 'MISS' | 'DISABLED' } }> {
    // If cache is disabled, always fetch fresh
    if (!this.isEnabled || !this.isConnected) {
      const freshData = await fetchFn();
      return {
        data: freshData,
        cacheInfo: {
          hit: false,
          age: null,
          status: 'DISABLED',
        },
      };
    }

    // If forceRefresh, skip cache and fetch fresh data
    if (forceRefresh) {
      if (process.env.DEBUG === 'true') {
        cacheLogger.debug(
          'Force refresh - fetching fresh data',
          'CacheManager',
          { key }
        );
      }

      const freshData = await fetchFn();
      await this.set(key, freshData, options);

      return {
        data: freshData,
        cacheInfo: {
          hit: false,
          age: 0,
          status: 'MISS',
        },
      };
    }

    // Try to get from cache
    const cachedData = await this.get(key);

    if (cachedData) {
      const now = Date.now();
      const age = Math.floor((now - cachedData.cachedAt) / 1000);

      // Check if data is expired
      if (this.isExpired(cachedData)) {
        // Data is expired, fetch fresh
        if (process.env.DEBUG === 'true') {
          cacheLogger.debug(
            'Cache entry expired - fetching fresh data',
            'CacheManager',
            { key, age }
          );
        }

        const freshData = await fetchFn();
        await this.set(key, freshData, options);

        return {
          data: freshData,
          cacheInfo: {
            hit: false,
            age: 0,
            status: 'MISS',
          },
        };
      }

      // Check if data should be revalidated (stale)
      if (this.shouldRevalidate(cachedData)) {
        // Data is stale but not expired - return immediately and revalidate in background
        if (process.env.DEBUG === 'true') {
          cacheLogger.debug(
            'Cache entry stale - returning cached data and revalidating in background',
            'CacheManager',
            { key, age }
          );
        }

        // Trigger background revalidation
        this.revalidateInBackground(key, fetchFn, options, false, false);

        return {
          data: cachedData.data as T,
          cacheInfo: {
            hit: true,
            age,
            status: 'HIT-STALE',
          },
        };
      }

      // Data is fresh - return from cache
      if (process.env.DEBUG === 'true') {
        cacheLogger.debug(
          'Cache hit - returning cached data',
          'CacheManager',
          { key, age }
        );
      }

      return {
        data: cachedData.data as T,
        cacheInfo: {
          hit: true,
          age,
          status: 'HIT',
        },
      };
    }

    // Cache miss - fetch fresh data
    if (process.env.DEBUG === 'true') {
      cacheLogger.debug(
        'Cache miss - fetching fresh data',
        'CacheManager',
        { key }
      );
    }

    const freshData = await fetchFn();
    await this.set(key, freshData, options);

    return {
      data: freshData,
      cacheInfo: {
        hit: false,
        age: 0,
        status: 'MISS',
      },
    };
  }

  /**
   * Returns health status of the cache manager and Redis connection
   * Useful for monitoring and failover detection
   * 
   * @returns Health status object
   */
  getHealthStatus() {
    const now = Date.now();
    const uptime = this.connectedAt ? now - this.connectedAt : 0;
    
    return {
      enabled: this.isEnabled,
      connected: this.isConnected,
      reconnecting: this.isReconnecting,
      reconnectAttempts: this.currentReconnectAttempt,
      maxReconnectAttempts: this.maxReconnectAttempts,
      uptime,
      connectedAt: this.connectedAt ? new Date(this.connectedAt).toISOString() : null,
      encryptionEnabled: this.encryptionEnabled,
      queueStatus: {
        length: this._revalidationQueue.length,
        executing: this._revalidationExecuting.size,
        processing: this._revalidationProcessing,
        maxQueueLength: this._maxQueueLength,
      },
      status: this._getConnectionStatus(),
    };
  }

  /**
   * Gets a human-readable connection status
   * 
   * @private
   * @returns Connection status string
   */
  private _getConnectionStatus(): 'healthy' | 'reconnecting' | 'degraded' | 'offline' {
    if (!this.isEnabled) return 'offline';
    if (this.isConnected && !this.isReconnecting) return 'healthy';
    if (this.isReconnecting && this.currentReconnectAttempt < this.maxReconnectAttempts) return 'reconnecting';
    if (this.currentReconnectAttempt >= this.maxReconnectAttempts) return 'offline';
    return 'degraded';
  }
}

