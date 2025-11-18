/**
 * Enhanced Log Types
 * 
 * This file contains enhanced type definitions for SAP Cloud Integration logs
 * with better date handling.
 * 
 * @module sap-integration-suite-client/types/enhanced-logs
 */

import {
  ComSapHciApiMessageProcessingLog
} from './sap.MessageProcessingLogs';

/**
 * Enhanced message processing log with Date objects
 * 
 * Extends the standard SAP MessageProcessingLog type by converting
 * date string fields to JavaScript Date objects
 */
export interface EnhancedMessageProcessingLog extends Omit<ComSapHciApiMessageProcessingLog, 'LogStart' | 'LogEnd'> {
  /**
   * Log start time as a JavaScript Date object
   */
  LogStart?: Date | null;
  
  /**
   * Log end time as a JavaScript Date object
   */
  LogEnd?: Date | null;
  
  /**
   * Original log start time string in SAP format
   */
  LogStartString?: string | null;
  
  /**
   * Original log end time string in SAP format
   */
  LogEndString?: string | null;
}

/**
 * Filter operators for date fields
 */
export type DateFilterOperator = 'eq' | 'ne' | 'gt' | 'ge' | 'lt' | 'le';

/**
 * Date field filter configuration
 */
export interface DateFieldFilter {
  eq?: Date;
  ne?: Date;
  gt?: Date;
  ge?: Date;
  lt?: Date;
  le?: Date;
}

/**
 * Options for message processing logs retrieval
 */
export interface MessageProcessingLogsOptions {
  /**
   * Maximum number of logs to retrieve
   */
  top?: number;
  
  /**
   * Number of logs to skip (for pagination)
   */
  skip?: number;
  
  /**
   * OData filter string (e.g., "Status eq 'FAILED'")
   */
  filter?: string;
  
  /**
   * Object-based filter with field conditions
   */
  filterObj?: Record<string, any>;
  
  /**
   * If provided, retrieves logs with LogEnd >= startDate
   */
  startDate?: Date;
  
  /**
   * If provided, retrieves logs with LogEnd <= endDate
   */
  endDate?: Date;
  
  /**
   * Sorting order
   */
  orderby?: ('LogEnd' | 'LogEnd desc' | 'LogStart' | 'LogStart desc' | 'Status,LogEnd desc' | 'ApplicationMessageId')[];
  
  /**
   * Properties to select
   */
  select?: ('MessageGuid' | 'CorrelationId' | 'ApplicationMessageId' | 'ApplicationMessageType' | 'IntegrationFlowName' | 'IntegrationArtifact' | 'Status' | 'CustomStatus' | 'LogLevel' | 'LogStart' | 'LogEnd' | 'Sender' | 'Receiver' | 'AlternateWebLink' | 'ArchivingStatus' | 'ArchivingSenderChannelMessages' | 'ArchivingReceiverChannelMessages' | 'ArchivingLogAttachments' | 'ArchivingPersistedMessages')[];
  
  /**
   * If true, includes the total count in the response
   */
  inlinecount?: boolean;
} 