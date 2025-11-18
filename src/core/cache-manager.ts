/**
 * Redis-based cache manager for SAP API responses
 * 
 * @module cache-manager
 */

import { createClient, RedisClientType } from 'redis';
import { CachedData, CacheOptions } from '../types/cache';
import { REVALIDATION_TIMEOUT_MS } from './cache-config';
import * as crypto from 'crypto';

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

  /**
   * Creates a new CacheManager instance
   * 
   * @param connectionString - Redis connection string
   * @param enabled - Whether caching is enabled
   * @param encryptionSecret - Optional secret for encrypting cache values (recommended: use OAuth client secret)
   */
  constructor(connectionString: string, enabled: boolean = true, encryptionSecret?: string) {
    this.connectionString = connectionString;
    this.isEnabled = enabled;
    
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
    if (this.isEnabled && this.connectionString) {
      this.connectPromise = this.initialize()
        .then(() => {
          this.connectPromise = null;
        })
        .catch((error) => {
          this.connectPromise = null;
          throw error;
        });
      
      return this.connectPromise;
    }
  }

  /**
   * Initializes the Redis client connection
   */
  private async initialize(): Promise<void> {
    try {
      // Parse the connection string (Azure Redis format)
      // Format: host:port,password=xxx,ssl=True,abortConnect=False
      const parts = this.connectionString.split(',');
      
      if (!parts[0] || !parts[0].includes(':')) {
        throw new Error(`Invalid Redis connection string format. Expected format: host:port,password=xxx,ssl=True`);
      }
      
      const [host, port] = parts[0].split(':');
      
      if (!host || !port) {
        throw new Error(`Invalid Redis connection string format. Missing host or port.`);
      }
      
      let password = '';
      let ssl = false;
      
      for (const part of parts) {
        if (part.startsWith('password=')) {
          password = part.substring('password='.length);
        } else if (part.startsWith('ssl=')) {
          ssl = part.substring('ssl='.length).toLowerCase() === 'true';
        }
      }

      this.client = createClient({
        socket: {
          host,
          port: parseInt(port, 10),
          tls: ssl,
        },
        password,
      });

      // Error handling
      this.client.on('error', (err: Error) => {
        console.error('[CacheManager] Redis client error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        console.log('[CacheManager] Redis client connected');
        this.isConnected = true;
      });

      this.client.on('disconnect', () => {
        console.log('[CacheManager] Redis client disconnected');
        this.isConnected = false;
      });

      // Connect to Redis
      await this.client.connect();
    } catch (error) {
      console.error('[CacheManager] Failed to initialize Redis:', error);
      this.isConnected = false;
      this.client = null;
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
      
      // Encrypt if encryption is enabled
      const encryptedData = this.encrypt(jsonData);

      await this.client.setEx(key, options.ttl, encryptedData);
    } catch (error) {
      console.error('[CacheManager] Error setting cache:', error);
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
   * Revalidates cache in the background with timeout
   * 
   * @param key - The cache key to revalidate
   * @param fetchFn - Function that fetches fresh data
   * @param options - Cache options for the new data
   */
  async revalidateInBackground(
    key: string,
    fetchFn: () => Promise<any>,
    options: CacheOptions
  ): Promise<void> {
    if (!this.isEnabled || !this.isConnected) {
      return;
    }

    // Don't await - run in background
    let timeoutId: NodeJS.Timeout | null = null;
    
    Promise.race([
      fetchFn(),
      new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Revalidation timeout')), REVALIDATION_TIMEOUT_MS);
      }),
    ])
      .then(async (freshData) => {
        // Clear timeout to prevent memory leak
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        // Update cache with fresh data
        await this.set(key, freshData, options);
        if (process.env.DEBUG === 'true') {
          console.log(`[CacheManager] Background revalidation successful for key: ${key}`);
        }
      })
      .catch((error) => {
        // Clear timeout to prevent memory leak
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        // Silently fail - keep old cache
        if (process.env.DEBUG === 'true') {
          console.log(`[CacheManager] Background revalidation failed for key: ${key}`, error.message);
        }
      });
  }

  /**
   * Closes the Redis connection and removes all event listeners
   */
  async close(): Promise<void> {
    if (this.client) {
      // Remove all event listeners to prevent memory leaks
      this.client.removeAllListeners('error');
      this.client.removeAllListeners('connect');
      this.client.removeAllListeners('disconnect');
      
      // Close connection if connected
      if (this.isConnected) {
      await this.client.quit();
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
}

