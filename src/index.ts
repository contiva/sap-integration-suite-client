/**
 * SAP Cloud Platform Integration API Client
 * A library for interacting with SAP CPI APIs
 */

// Core Client and Config
import SapClient, { SapClientConfig } from './clients/sap-client';

// Utilities
import { formatSapTimestampsInObject } from './utils/date-formatter';

// Types
import * as IntegrationContentTypes from './types/sap.IntegrationContent';
import * as LogFilesTypes from './types/sap.LogFiles';
import * as MessageProcessingLogsTypes from './types/sap.MessageProcessingLogs';
import * as MessageStoreTypes from './types/sap.MessageStore';
import * as SecurityContentTypes from './types/sap.SecurityContent';

// Create default client instance for backward compatibility
const defaultClient = new SapClient();

// Export Core Client class as default
export default SapClient;

// Export main components
export {
  // Default client instance for backward compatibility
  defaultClient,
  
  // Client config interface
  SapClientConfig,
  
  // Client
  SapClient,
  
  // Utilities
  formatSapTimestampsInObject,
  
  // Types
  IntegrationContentTypes,
  LogFilesTypes,
  MessageProcessingLogsTypes,
  MessageStoreTypes,
  SecurityContentTypes
}; 