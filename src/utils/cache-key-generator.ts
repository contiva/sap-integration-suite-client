/**
 * Cache key generation utilities
 * 
 * @module cache-key-generator
 */

import * as crypto from 'crypto';

/**
 * Recursively sorts object keys for deterministic JSON stringification.
 * This ensures the same object with different key ordering produces identical output.
 * 
 * @param obj - The object to sort
 * @returns A new object with sorted keys (deep)
 * 
 * @example
 * sortObjectKeys({ b: 2, a: 1 }) // { a: 1, b: 2 }
 * sortObjectKeys({ b: { d: 4, c: 3 }, a: 1 }) // { a: 1, b: { c: 3, d: 4 } }
 */
function sortObjectKeys(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }
  
  if (typeof obj === 'object') {
    const sorted: Record<string, unknown> = {};
    const keys = Object.keys(obj as Record<string, unknown>).sort();
    for (const key of keys) {
      sorted[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
    }
    return sorted;
  }
  
  return obj;
}

/**
 * Generates a deterministic JSON string from an object.
 * Keys are sorted alphabetically at all nesting levels.
 * 
 * FIX for P0-3 Bug: Different query parameter ordering now produces identical cache keys.
 * 
 * @param obj - The object to stringify
 * @returns A deterministic JSON string
 * 
 * @example
 * stableStringify({ b: 2, a: 1 }) // '{"a":1,"b":2}'
 * stableStringify({ a: 1, b: 2 }) // '{"a":1,"b":2}' (same!)
 */
function stableStringify(obj: unknown): string {
  return JSON.stringify(sortObjectKeys(obj));
}

/**
 * Generates a unique cache key for a request
 * 
 * @param hostname - The SAP hostname
 * @param method - HTTP method (GET, POST, etc.)
 * @param url - The request URL
 * @param queryParams - Optional query parameters or body data
 * @returns A unique cache key
 * 
 * @example
 * generateCacheKey('tenant.sap.com', 'GET', '/IntegrationPackages', { top: 10 })
 * // Returns: 'sap:tenant.sap.com:GET:/IntegrationPackages:a1b2c3d4'
 */
export function generateCacheKey(
  hostname: string,
  method: string,
  url: string,
  queryParams?: any
): string {
  // Validate required parameters
  if (!hostname || !method || !url) {
    throw new Error('hostname, method, and url are required for cache key generation');
  }
  
  // Normalize URL: Remove protocol and hostname if present, then remove /api/v1 prefix
  let normalizedUrl = url;
  if (normalizedUrl.startsWith('http://') || normalizedUrl.startsWith('https://')) {
    try {
      const urlObj = new URL(normalizedUrl);
      normalizedUrl = urlObj.pathname + urlObj.search;
    } catch {
      // Falls URL-Parsing fehlschlägt, verwende URL wie sie ist
    }
  }
  // Entferne /api/v1 Prefix
  normalizedUrl = normalizedUrl.replace(/^\/api\/v1/, '');
  
  // Generate a hash for query parameters if present
  // FIX P0-3: Use stableStringify for deterministic cache keys regardless of parameter order
  let paramsHash = '';
  if (queryParams && typeof queryParams === 'object' && Object.keys(queryParams).length > 0) {
    const paramsString = stableStringify(queryParams);
    // Use SHA-256 instead of deprecated MD5
    paramsHash = crypto.createHash('sha256').update(paramsString).digest('hex').substring(0, 8);
  }
  
  // Construct the cache key
  const parts = ['sap', hostname, method, normalizedUrl];
  if (paramsHash) {
    parts.push(paramsHash);
  }
  
  return parts.join(':');
}

/**
 * Parses a URL to extract query parameters
 * 
 * @param url - The URL to parse
 * @returns An object containing query parameters
 */
export function parseQueryParams(url: string): Record<string, string> {
  try {
    const urlObj = new URL(url, 'http://dummy.com'); // Use dummy base for relative URLs
    const params: Record<string, string> = {};
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  } catch {
    return {};
  }
}

