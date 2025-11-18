/**
 * Redis-based cache manager for SAP API responses
 * 
 * @module cache-manager
 */

import { createClient, RedisClientType } from 'redis';
import { CachedData, CacheOptions } from '../types/cache';
import { REVALIDATION_TIMEOUT_MS } from './cache-config';

/**
 * Manages caching operations with Redis
 */
export class CacheManager {
  private client: RedisClientType | null = null;
  private isConnected: boolean = false;
  private isEnabled: boolean = false;
  private connectionString: string;

  /**
   * Creates a new CacheManager instance
   * 
   * @param connectionString - Redis connection string
   * @param enabled - Whether caching is enabled
   */
  constructor(connectionString: string, enabled: boolean = true) {
    this.connectionString = connectionString;
    this.isEnabled = enabled;
    
    // Don't initialize in constructor - let caller await it
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
    
    // If already connecting, wait for it
    if (this.client && !this.isConnected) {
      // Wait a bit for connection to complete
      for (let i = 0; i < 50; i++) {
        if (this.isConnected) {
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return;
    }
    
    // Otherwise, initialize
    if (this.isEnabled && this.connectionString) {
      await this.initialize();
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
      const [host, port] = parts[0].split(':');
      
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
      const data = await this.client.get(key);
      if (!data) {
        return null;
      }

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

      await this.client.setEx(key, options.ttl, JSON.stringify(cachedData));
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
   * Closes the Redis connection
   */
  async close(): Promise<void> {
    if (this.client && this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
    }
  }

  /**
   * Checks if the cache manager is ready to use
   */
  isReady(): boolean {
    return this.isEnabled && this.isConnected;
  }
}

