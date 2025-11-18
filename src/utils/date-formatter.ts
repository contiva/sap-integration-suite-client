/**
 * Utility functions for SAP date and timestamp formatting
 * 
 * Provides comprehensive date handling utilities for SAP Integration Suite including:
 * - Timestamp formatting for API responses
 * - OData date filters
 * - SAP date format parsing and conversion
 * 
 * @module date-formatter
 * @packageDocumentation
 */

// ---------- TIMESTAMP FORMATTING FOR API RESPONSES ----------

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
  } catch {
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

// ---------- SAP DATE FORMAT HANDLING (OData) ----------

/**
 * Utility functions for SAP date handling in OData requests
 * These are primarily used for OData filtering and date conversion
 */
export class SapDateUtils {
  /**
   * Formats a date for SAP OData filter expressions
   * 
   * @param {Date | string} date Date to format
   * @returns {string} Formatted date string for SAP OData filtering
   */
  static formatDateForFilter(date: Date | string): string {
    if (typeof date === 'string') {
      // Handle ISO string
      return date.replace(/\.\d+Z$/, '').replace(/Z$/, '');
    } else {
      // Handle Date object
      return date.toISOString().replace(/\.\d+Z$/, '').replace(/Z$/, '');
    }
  }

  /**
   * Creates an OData datetime filter expression
   * 
   * @param {string} fieldName Name of the date field
   * @param {string} operator Comparison operator (eq, ne, gt, ge, lt, le)
   * @param {Date | string} date Date value to compare against
   * @returns {string} Complete OData filter expression
   */
  static createDateTimeFilter(fieldName: string, operator: 'eq' | 'ne' | 'gt' | 'ge' | 'lt' | 'le', date: Date | string): string {
    const formattedDate = this.formatDateForFilter(date);
    return `${fieldName} ${operator} datetime'${formattedDate}'`;
  }

  /**
   * Parses an SAP OData date string to a JavaScript Date
   * 
   * @param {string} sapDateString Date string in SAP format (e.g. "/Date(1234567890)/")
   * @returns {Date | null} JavaScript Date object or null if invalid
   */
  static parseSapDate(sapDateString: string): Date | null {
    if (!sapDateString || typeof sapDateString !== 'string') return null;
    
    const match = sapDateString.match(/\/Date\((\d+)\)\//);
    if (!match || !match[1]) return null;
    
    const timestamp = parseInt(match[1], 10);
    return new Date(timestamp);
  }

  /**
   * Formats an SAP OData date string to a readable string
   * 
   * @param {string} sapDateString Date string in SAP format
   * @param {Intl.DateTimeFormatOptions} options Formatting options
   * @returns {string} Formatted date string or the original if invalid
   */
  static formatSapDate(sapDateString: string, options?: Intl.DateTimeFormatOptions): string {
    const date = this.parseSapDate(sapDateString);
    if (!date) return sapDateString;
    
    return date.toLocaleString(undefined, options);
  }

  /**
   * Ensures that all datetime values in a filter string are properly formatted
   * for SAP OData (removing 'Z' and milliseconds)
   * 
   * @param {string} filter The OData filter string to process
   * @returns {string} Filter string with correctly formatted datetime values
   */
  static sanitizeFilterDatetimes(filter: string): string {
    if (!filter) return filter;
    
    // Look for datetime'...' patterns in the filter string
    return filter.replace(/datetime'([^']*?)'/g, (match, datetimeValue) => {
      // Check if it's an ISO-like date string
      if (datetimeValue.includes('T') || datetimeValue.includes('Z')) {
        // Remove milliseconds and Z suffix
        const sanitizedDate = datetimeValue
          .replace(/\.\d+Z$/, '') // Remove milliseconds and Z
          .replace(/\.\d+$/, '')  // Remove milliseconds without Z
          .replace(/Z$/, '');     // Remove just Z if present
        
        return `datetime'${sanitizedDate}'`;
      }
      
      // Return unchanged if not an ISO-like format
      return match;
    });
  }
} 