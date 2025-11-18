/**
 * OData Filter Builder Utilities
 * 
 * Utilities for building OData filter expressions
 * 
 * @module sap-integration-suite-client/utils/odata-filter-builder
 */

import { SapDateUtils } from './date-formatter';
import { DateFieldFilter } from '../types/enhanced-logs';

/**
 * Escapes single quotes in OData string values
 * In OData, single quotes must be escaped by doubling them: ' becomes ''
 * 
 * @param value - The string value to escape
 * @returns Escaped string safe for use in OData filters
 */
function escapeODataString(value: string): string {
  return value.replace(/'/g, "''");
}

/**
 * Builds an OData filter string from a filter object
 * 
 * @param filterObj Object containing filter criteria
 * @returns Formatted OData filter string
 */
export function buildODataFilter(filterObj: Record<string, any>): string {
  const filterParts: string[] = [];
  
  Object.entries(filterObj).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    
    // Handle date fields
    if (key === 'LogStart' || key === 'LogEnd') {
      if (typeof value === 'object') {
        // Handle date filter object with comparison operators
        const dateFilter = value as DateFieldFilter;
        
        if (dateFilter.gt instanceof Date) {
          filterParts.push(SapDateUtils.createDateTimeFilter(key, 'gt', dateFilter.gt));
        }
        if (dateFilter.ge instanceof Date) {
          filterParts.push(SapDateUtils.createDateTimeFilter(key, 'ge', dateFilter.ge));
        }
        if (dateFilter.lt instanceof Date) {
          filterParts.push(SapDateUtils.createDateTimeFilter(key, 'lt', dateFilter.lt));
        }
        if (dateFilter.le instanceof Date) {
          filterParts.push(SapDateUtils.createDateTimeFilter(key, 'le', dateFilter.le));
        }
        if (dateFilter.eq instanceof Date) {
          filterParts.push(SapDateUtils.createDateTimeFilter(key, 'eq', dateFilter.eq));
        }
        if (dateFilter.ne instanceof Date) {
          filterParts.push(SapDateUtils.createDateTimeFilter(key, 'ne', dateFilter.ne));
        }
      } else if (value instanceof Date) {
        // Handle direct Date object (defaults to equals)
        filterParts.push(SapDateUtils.createDateTimeFilter(key, 'eq', value));
      }
    } 
    // Handle string fields
    else if (typeof value === 'string') {
      filterParts.push(`${key} eq '${escapeODataString(value)}'`);
    } 
    // Handle boolean fields
    else if (typeof value === 'boolean') {
      filterParts.push(`${key} eq ${value}`);
    }
    // Handle numeric fields
    else if (typeof value === 'number') {
      filterParts.push(`${key} eq ${value}`);
    }
  });
  
  return filterParts.join(' and ');
} 