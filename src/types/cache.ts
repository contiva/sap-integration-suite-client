/**
 * Cache-related TypeScript type definitions
 * 
 * @module cache-types
 */

/**
 * Represents cached data with metadata
 */
export interface CachedData {
  /** The actual cached data */
  data: any;
  /** Timestamp when the data was cached (milliseconds since epoch) */
  cachedAt: number;
  /** Timestamp when the cache entry expires completely (milliseconds since epoch) */
  expiresAt: number;
  /** Timestamp when the cache should be revalidated (milliseconds since epoch) */
  revalidateAfter: number;
}

/**
 * Cache configuration options
 */
export interface CacheOptions {
  /** Time-to-live in seconds (how long to keep in cache) */
  ttl: number;
  /** Time in seconds after which to revalidate the cache */
  revalidateAfter: number;
}

/**
 * Statistics for cache operations
 */
export interface CacheStats {
  /** Number of cache hits */
  hits: number;
  /** Number of cache misses */
  misses: number;
  /** Number of cache errors */
  errors: number;
}

