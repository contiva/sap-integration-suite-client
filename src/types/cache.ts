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
  /** Unix-Timestamp in Millisekunden seit Epoch (Date.now()) */
  cachedAt: number;
  /** Unix-Timestamp in Millisekunden seit Epoch (Date.now()) */
  expiresAt: number;
  /** Unix-Timestamp in Millisekunden seit Epoch (Date.now()) */
  revalidateAfter: number;
}

/**
 * Cache configuration options
 */
export interface CacheOptions {
  /** Time-to-live in seconds (how long to keep in cache) */
  ttl: number;
  /** Time in seconds after which to revalidate the cache (relative, not absolute timestamp) */
  revalidateAfter: number;
}

/**
 * Lightweight runtime cache statistics (hot-path compatible)
 */
export interface CacheStats {
  /** Number of cache hits */
  hits: number;
  /** Number of cache misses */
  misses: number;
  /** Number of cache errors */
  errors: number;
}

/**
 * Status update data for an artifact
 * 
 * Status-Felder gemäß SAP Integration Suite Runtime-Artifact-API
 */
export interface ArtifactStatusUpdate {
  /** The deployment status of the artifact (e.g., 'STARTED', 'STOPPED', 'ERROR') */
  Status?: string;
  /** The user who deployed the artifact */
  DeployedBy?: string;
  /** The timestamp when the artifact was deployed (ISO 8601 format) */
  DeployedOn?: string;
}

/**
 * Cache statistics for admin/debug purposes
 * 
 * **WARNING**: This API is expensive (uses MEMORY USAGE + SCAN) and should not be used in hot-path code.
 * Primarily intended for admin/debug/monitoring purposes.
 */
export interface CacheAdminStats {
  /** Total number of cache keys */
  readonly totalKeys: number;
  /** Total size of all cache entries in bytes (expensive to calculate) */
  readonly totalSize: number;
  /** Average TTL of all cache entries in seconds */
  readonly averageTtl?: number;
  /** Oldest cache entry information */
  readonly oldestEntry?: { key: string; age: number };
  /** Newest cache entry information */
  readonly newestEntry?: { key: string; age: number };
}

/**
 * Information about a specific cache key
 * 
 * **WARNING**: This API uses MEMORY USAGE which is expensive and should not be used in hot-path code.
 */
export interface CacheKeyInfo {
  /** The cache key */
  readonly key: string;
  /** Whether the key exists */
  readonly exists: boolean;
  /** Size of the cache entry in bytes */
  readonly size: number;
  /** Remaining TTL in seconds (-1 if key doesn't expire) */
  readonly ttl: number;
  /** Age of the cache entry in seconds (now - cachedAt) */
  readonly age: number;
  /** Unix-Timestamp in Millisekunden seit Epoch (Date.now()) */
  readonly expiresAt: number;
  /** Unix-Timestamp in Millisekunden seit Epoch (Date.now()) */
  readonly revalidateAfter: number;
}

