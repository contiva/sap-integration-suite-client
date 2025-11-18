/**
 * Utility for extracting hostname from URLs
 * 
 * @module hostname-extractor
 */

/**
 * Extracts the hostname from a base URL
 * 
 * @param baseUrl - The base URL to extract hostname from
 * @returns The hostname without protocol and path
 * 
 * @example
 * extractHostname('https://tenant.integrationsuitetrial-api.eu10.hana.ondemand.com/api/v1')
 * // Returns: 'tenant.integrationsuitetrial-api.eu10.hana.ondemand.com'
 */
export function extractHostname(baseUrl: string): string {
  try {
    const url = new URL(baseUrl);
    return url.hostname;
  } catch {
    // Fallback: try to extract hostname manually
    const match = baseUrl.match(/(?:https?:\/\/)?([^\/]+)/);
    return match ? match[1] : baseUrl;
  }
}

