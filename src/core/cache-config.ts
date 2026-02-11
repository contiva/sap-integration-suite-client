/**
 * Cache configuration constants and utilities
 * 
 * FIX P3-2: TTL values are now configurable via configureCacheTTL()
 * This allows backends to pass their own TTL configuration instead of using hardcoded defaults.
 * 
 * @module cache-config
 */

/**
 * Default Cache TTL (Time-to-Live) values in seconds
 */
const DEFAULT_CACHE_TTL = {
  /** 30 days in seconds */
  STANDARD: 30 * 24 * 60 * 60, // 2592000 seconds
};

/**
 * Default Revalidation time values in seconds
 */
const DEFAULT_REVALIDATE_AFTER = {
  /** 1 hour in seconds */
  STANDARD: 60 * 60, // 3600 seconds
  /** 5 minutes in seconds */
  RUNTIME: 5 * 60, // 300 seconds
};

/**
 * Current (potentially customized) Cache TTL values
 * FIX P3-2: Mutable to allow runtime configuration
 */
export let CACHE_TTL: { STANDARD: number } = { ...DEFAULT_CACHE_TTL };

/**
 * Current (potentially customized) Revalidation time values
 * FIX P3-2: Mutable to allow runtime configuration
 */
export let REVALIDATE_AFTER: { STANDARD: number; RUNTIME: number } = { ...DEFAULT_REVALIDATE_AFTER };

/**
 * Cache TTL configuration options
 */
export interface CacheTTLConfig {
  /** TTL for standard endpoints in seconds (default: 30 days) */
  standardTTL?: number;
  /** Revalidation time for standard endpoints in seconds (default: 1 hour) */
  standardRevalidate?: number;
  /** Revalidation time for runtime endpoints in seconds (default: 5 minutes) */
  runtimeRevalidate?: number;
}

/**
 * Configures cache TTL values at runtime
 * 
 * FIX P3-2: Allows backends to pass their own TTL configuration
 * Call this during initialization before making any cache operations.
 * 
 * @param config - TTL configuration options
 * 
 * @example
 * ```typescript
 * import { configureCacheTTL } from '@contiva/sap-integration-suite-client';
 * 
 * // Use backend's configured TTL values
 * configureCacheTTL({
 *   standardTTL: parseInt(process.env.CACHE_TTL_SECONDS, 10) || 2592000,
 *   standardRevalidate: parseInt(process.env.CACHE_REVALIDATE_SECONDS, 10) || 3600,
 *   runtimeRevalidate: parseInt(process.env.CACHE_RUNTIME_REVALIDATE_SECONDS, 10) || 300,
 * });
 * ```
 */
export function configureCacheTTL(config: CacheTTLConfig): void {
  if (config.standardTTL !== undefined && config.standardTTL > 0) {
    CACHE_TTL.STANDARD = config.standardTTL;
    console.log(`[CacheConfig] CACHE_TTL.STANDARD set to ${config.standardTTL}s (${(config.standardTTL / 86400).toFixed(1)} days)`);
  }
  
  if (config.standardRevalidate !== undefined && config.standardRevalidate > 0) {
    REVALIDATE_AFTER.STANDARD = config.standardRevalidate;
    console.log(`[CacheConfig] REVALIDATE_AFTER.STANDARD set to ${config.standardRevalidate}s (${(config.standardRevalidate / 3600).toFixed(1)} hours)`);
  }
  
  if (config.runtimeRevalidate !== undefined && config.runtimeRevalidate > 0) {
    REVALIDATE_AFTER.RUNTIME = config.runtimeRevalidate;
    console.log(`[CacheConfig] REVALIDATE_AFTER.RUNTIME set to ${config.runtimeRevalidate}s (${(config.runtimeRevalidate / 60).toFixed(1)} minutes)`);
  }
}

/**
 * Resets cache TTL values to defaults
 * Useful for testing or when reconfiguration is needed
 */
export function resetCacheTTL(): void {
  CACHE_TTL = { ...DEFAULT_CACHE_TTL };
  REVALIDATE_AFTER = { ...DEFAULT_REVALIDATE_AFTER };
  console.log('[CacheConfig] TTL values reset to defaults');
}

/**
 * Gets current TTL configuration (for debugging/logging)
 */
export function getCacheTTLConfig(): { ttl: typeof CACHE_TTL; revalidate: typeof REVALIDATE_AFTER } {
  return {
    ttl: { ...CACHE_TTL },
    revalidate: { ...REVALIDATE_AFTER },
  };
}

/**
 * Background revalidation timeout in milliseconds
 * Increased from 5s to 30s to allow queue processing more time to complete
 */
export const REVALIDATION_TIMEOUT_MS = 30000; // 30 seconds

/**
 * URL patterns that should NOT be cached
 */
const UNCACHEABLE_PATTERNS = [
  '/value', // OData value accessor (payloads)
  '/$value', // Alternative OData value accessor
  '/download', // Download endpoints
] as const;

/**
 * URL patterns for runtime APIs that need shorter revalidation times
 */
const RUNTIME_API_PATTERNS = [
  '/MessageProcessingLogs',
  '/LogFiles',
  '/IntegrationRuntimeArtifacts',
] as const;

/**
 * Checks if a URL should be cached
 * 
 * @param url - The URL to check
 * @returns true if the URL is cacheable, false otherwise
 */
export function isCacheableUrl(url: string): boolean {
  // Check if URL contains any uncacheable patterns
  for (const pattern of UNCACHEABLE_PATTERNS) {
    if (url.includes(pattern)) {
      return false;
    }
  }
  return true;
}

/**
 * Determines if a URL is a runtime API that needs shorter revalidation
 * 
 * @param url - The URL to check
 * @returns true if it's a runtime API, false otherwise
 */
export function isRuntimeApi(url: string): boolean {
  for (const pattern of RUNTIME_API_PATTERNS) {
    if (url.includes(pattern)) {
      return true;
    }
  }
  return false;
}

/**
 * Gets the appropriate revalidation time for a URL
 * 
 * @param url - The URL to get revalidation time for
 * @returns Revalidation time in seconds
 */
export function getRevalidationTime(url: string): number {
  return isRuntimeApi(url) ? REVALIDATE_AFTER.RUNTIME : REVALIDATE_AFTER.STANDARD;
}

