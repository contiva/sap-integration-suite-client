/**
 * Central configuration for collection endpoints that can contain artifacts
 * 
 * This module provides a centralized list of SAP API collection endpoints
 * that may contain artifacts. These endpoints are used by updateArtifactStatus
 * to find and update artifacts in collection caches.
 * 
 * @module cache-collections-config
 */

/**
 * Collection endpoint patterns that can contain artifacts
 * These patterns are used to find collection cache keys when updating artifact status
 */
export const COLLECTION_ENDPOINTS = [
  'GET:/IntegrationRuntimeArtifacts*',        // All deployed artifacts
  'GET:/IntegrationPackages*',                // All packages
  'GET:/IntegrationDesigntimeArtifacts*',    // All design-time artifacts
  'GET:/MessageMappingDesigntimeArtifacts*', // All message mappings
  'GET:/ValueMappingDesigntimeArtifacts*',   // All value mappings
  'GET:/ScriptCollectionDesigntimeArtifacts*', // All script collections
] as const;

/**
 * Type representing a collection endpoint pattern
 */
export type CollectionEndpoint = (typeof COLLECTION_ENDPOINTS)[number];

/**
 * Generates cache key patterns for collection endpoints with hostname prefix
 * 
 * @param hostname - The SAP hostname to use in the cache key pattern
 * @returns Array of cache key patterns (e.g. 'sap:hostname:GET:/IntegrationRuntimeArtifacts*')
 * 
 * @example
 * const patterns = getCollectionPatterns('my-tenant.sap-api.com');
 * // Returns: [
 * //   'sap:my-tenant.sap-api.com:GET:/IntegrationRuntimeArtifacts*',
 * //   'sap:my-tenant.sap-api.com:GET:/IntegrationPackages*',
 * //   ...
 * // ]
 */
export function getCollectionPatterns(hostname: string): string[] {
  const trimmed = hostname?.trim();
  if (!trimmed) {
    return [];
  }
  
  return COLLECTION_ENDPOINTS.map(endpoint => `sap:${trimmed}:${endpoint}`);
}

/**
 * Gets the list of collection endpoints (without hostname prefix)
 * Useful for documentation or debugging
 * 
 * @returns Array of collection endpoint patterns
 */
export function getCollectionEndpoints(): readonly CollectionEndpoint[] {
  return COLLECTION_ENDPOINTS;
}

