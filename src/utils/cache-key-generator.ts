/**
 * Cache key generation utilities
 * 
 * @module cache-key-generator
 */

import * as crypto from 'crypto';

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
  
  // Normalize URL by removing /api/v1 prefix if present
  const normalizedUrl = url.replace(/^\/api\/v1/, '');
  
  // Generate a hash for query parameters if present
  let paramsHash = '';
  if (queryParams && typeof queryParams === 'object' && Object.keys(queryParams).length > 0) {
    const paramsString = JSON.stringify(queryParams);
    paramsHash = crypto.createHash('md5').update(paramsString).digest('hex').substring(0, 8);
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

