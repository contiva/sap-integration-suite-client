/**
 * Log Enhancement Utilities
 * 
 * Utilities for enhancing SAP logs with additional functionality
 * 
 * @module sap-integration-suite-client/utils/log-enhancer
 */

import { ComSapHciApiMessageProcessingLog } from '../types/sap.MessageProcessingLogs';
import { EnhancedMessageProcessingLog } from '../types/enhanced-logs';
import { SapDateUtils } from './date-formatter';

/**
 * Converts SAP date strings to Date objects in log entries
 * 
 * @param {ComSapHciApiMessageProcessingLog[]} logs Array of logs to enhance
 * @returns {EnhancedMessageProcessingLog[]} Enhanced logs with Date objects
 */
export function enhanceLogsWithDates(logs: ComSapHciApiMessageProcessingLog[]): EnhancedMessageProcessingLog[] {
  return logs.map(log => {
    const enhanced = {
      ...log,
      // Preserve original string values
      LogStartString: log.LogStart,
      LogEndString: log.LogEnd,
      // Initialize with null to satisfy type
      LogStart: null as Date | null,
      LogEnd: null as Date | null
    } as EnhancedMessageProcessingLog;
    
    // Convert date strings to Date objects
    if (log.LogStart) {
      enhanced.LogStart = SapDateUtils.parseSapDate(log.LogStart);
    }
    
    if (log.LogEnd) {
      enhanced.LogEnd = SapDateUtils.parseSapDate(log.LogEnd);
    }
    
    return enhanced;
  });
} 