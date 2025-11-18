/**
 * Cache configuration constants and utilities
 * 
 * @module cache-config
 */

/**
 * Cache TTL (Time-to-Live) constants in seconds
 */
export const CACHE_TTL = {
  /** 30 days in seconds */
  STANDARD: 30 * 24 * 60 * 60, // 2592000 seconds
} as const;

/**
 * Revalidation time constants in seconds
 */
export const REVALIDATE_AFTER = {
  /** 1 hour in seconds */
  STANDARD: 60 * 60, // 3600 seconds
  /** 5 minutes in seconds */
  RUNTIME: 5 * 60, // 300 seconds
} as const;

/**
 * Background revalidation timeout in milliseconds
 */
export const REVALIDATION_TIMEOUT_MS = 5000; // 5 seconds

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

