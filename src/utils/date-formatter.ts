/**
 * Utility functions for formatting SAP timestamps in API responses
 * 
 * @module date-formatter
 * @packageDocumentation
 */

/**
 * Converts an SAP timestamp to a readable date format
 * 
 * @param {string | number | null | undefined} timestamp - SAP timestamp as string or number (milliseconds since epoch)
 * @returns {string} Formatted date as string, or the original value if no valid conversion is possible
 * 
 * @example
 * // Basic usage
 * const formattedDate = formatSapTimestamp("1617189600000");
 * // Returns: "31.03.2021, 12:00:00" (depending on locale)
 * 
 * @example
 * // Handle invalid values
 * formatSapTimestamp(null); // Returns: ""
 * formatSapTimestamp("invalid"); // Returns: "invalid"
 */
export function formatSapTimestamp(timestamp: string | number | null | undefined): string {
  if (!timestamp) return '';
  
  try {
    // Convert string to number if needed
    const timestampNum = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
    
    // Check if the value is a valid number
    if (isNaN(timestampNum)) return String(timestamp);
    
    // Create a Date object
    const date = new Date(timestampNum);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) return String(timestamp);
    
    // Format the date as ISO string with local timezone
    return date.toLocaleString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch (error) {
    // On error, return the original value
    return String(timestamp);
  }
}

/**
 * Recursively traverse an object and apply timestamp formatting to timestamp fields
 * 
 * This function identifies potential timestamp fields based on field name patterns
 * (containing 'date' or 'time') and also specific known SAP timestamp field names.
 * 
 * @param {any} obj - The object to process
 * @returns {any} The processed object with formatted timestamps
 * 
 * @example
 * // Format timestamps in an API response
 * const response = await client.integrationContent.integrationPackages.integrationPackagesList();
 * const formattedResponse = formatSapTimestampsInObject(response.data);
 * 
 * // This will format fields like CreationDate, ModifiedDate, etc.
 */
export function formatSapTimestampsInObject(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  
  // Recursively process arrays
  if (Array.isArray(obj)) {
    return obj.map(item => formatSapTimestampsInObject(item));
  }
  
  // New object for the formatted output
  const formattedObj: any = {};
  
  for (const key in obj) {
    // Check if the value is a nested object
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Recursive call for nested objects
      formattedObj[key] = formatSapTimestampsInObject(obj[key]);
    } else if (
      typeof obj[key] === 'string' || 
      typeof obj[key] === 'number'
    ) {
      // Check if the key could be a timestamp field
      if (
        key.toLowerCase().includes('date') || 
        key.toLowerCase().includes('time') ||
        key === 'CreationDate' ||
        key === 'ModifiedDate' ||
        key === 'LastUpdated' ||
        key === 'DeployedOn' ||
        key === 'LogStart' ||
        key === 'LogEnd'
      ) {
        formattedObj[key] = formatSapTimestamp(obj[key]);
      } else {
        formattedObj[key] = obj[key];
      }
    } else {
      formattedObj[key] = obj[key];
    }
  }
  
  return formattedObj;
} 