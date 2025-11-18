/**
 * SAP Cloud Platform Integration API Client
 * 
 * A complete library for interacting with SAP Cloud Integration APIs.
 * Provides type-safe access to all SAP CPI API endpoints with built-in authentication handling.
 * 
 * @packageDocumentation
 * @module sap-integration-suite-client
 * @example
 * // Using the default client (requires environment variables)
 * import { defaultClient } from 'sap-integration-suite-client';
 * 
 * const packages = await defaultClient.integrationContent.integrationPackages.integrationPackagesList();
 * 
 * @example
 * // Creating a custom client
 * import SapClient from 'sap-integration-suite-client';
 * 
 * const client = new SapClient({
 *   baseUrl: 'https://tenant.sap-api.com/api/v1',
 *   oauthClientId: 'client-id',
 *   oauthClientSecret: 'client-secret',
 *   oauthTokenUrl: 'https://tenant.authentication.sap.hana.ondemand.com/oauth/token'
 * });
 */

// Core Client and Config
import SapClient, { SapClientConfig } from './clients/sap-client';
import { IntegrationContentClient } from './wrapper/integration-content-client';
import { IntegrationContentAdvancedClient } from './wrapper/custom/integration-content-advanced-client';
import { LogFilesClient } from './wrapper/log-files-client';
import { MessageProcessingLogsClient } from './wrapper/message-processing-logs-client';
import { MessageStoreClient } from './wrapper/message-store-client';
import { SecurityContentClient } from './wrapper/security-content-client';
import { B2BScenariosClient } from './wrapper/b2b-scenarios-client';
import { PartnerDirectoryClient } from './wrapper/partner-directory-client';

// Utilities
import { formatSapTimestampsInObject, SapDateUtils } from './utils/date-formatter';
import { enhanceLogsWithDates } from './utils/log-enhancer';
import { buildODataFilter } from './utils/odata-filter-builder';

// Types
import * as IntegrationContentTypes from './types/sap.IntegrationContent';
import * as LogFilesTypes from './types/sap.LogFiles';
import * as MessageProcessingLogsTypes from './types/sap.MessageProcessingLogs';
import * as MessageStoreTypes from './types/sap.MessageStore';
import * as SecurityContentTypes from './types/sap.SecurityContent';
import * as B2BScenariosTypes from './types/sap.B2BScenarios';
import * as PartnerDirectoryTypes from './types/sap.PartnerDirectory';
import * as EnhancedLogTypes from './types/enhanced-logs';

/**
 * Lazy-loaded default client
 * This ensures the client is only created when actually accessed,
 * not at import time
 */
let _defaultClient: SapClient | null = null;

/**
 * Default client getter function
 * 
 * This client reads configuration from environment variables:
 * - SAP_BASE_URL
 * - SAP_OAUTH_CLIENT_ID
 * - SAP_OAUTH_CLIENT_SECRET
 * - SAP_OAUTH_TOKEN_URL
 * 
 * The client is created only when this function is called, not at import time.
 * 
 * @returns A SapClient instance configured with environment variables
 * @deprecated Consider creating your own client instance with explicit configuration
 */
function getDefaultClient(): SapClient {
  if (!_defaultClient) {
    _defaultClient = new SapClient();
  }
  return _defaultClient;
}

// Create a proxy for lazy loading the default client
const defaultClientProxy = new Proxy({} as SapClient, {
  get: (target, prop) => {
    // Create the client on first property access
    const client = getDefaultClient();
    return client[prop as keyof SapClient];
  }
});

// Export Core Client class as default
export default SapClient;

/**
 * Export named components from the library
 */
export {
  /**
   * Default client instance that reads from environment variables
   * Use only if you have environment variables properly configured
   * 
   * Note: This client is lazy-loaded - it will only be created when actually accessed,
   * not at import time. This helps avoid environment variable issues during import.
   */
  defaultClientProxy as defaultClient,
  
  /**
   * Configuration interface for creating SapClient instances
   */
  SapClientConfig,
  
  /**
   * Main client class for interacting with SAP APIs
   */
  SapClient,
  
  /**
   * Utility function to format SAP timestamps in API responses
   * 
   * @param {any} obj - The object containing SAP timestamps to format
   * @returns {any} - The same object with formatted timestamps
   */
  formatSapTimestampsInObject,
  
  /**
   * Utility class for SAP date handling
   */
  SapDateUtils,
  
  /**
   * Utility function to enhance SAP logs with Date objects
   */
  enhanceLogsWithDates,
  
  /**
   * Utility function to build OData filter expressions
   */
  buildODataFilter,
  
  /**
   * Type definitions for Integration Content API
   */
  IntegrationContentTypes,
  
  /**
   * Type definitions for Log Files API
   */
  LogFilesTypes,
  
  /**
   * Type definitions for Message Processing Logs API
   */
  MessageProcessingLogsTypes,
  
  /**
   * Type definitions for Message Store API
   */
  MessageStoreTypes,
  
  /**
   * Type definitions for Security Content API
   */
  SecurityContentTypes,
  
  /**
   * Type definitions for B2B Scenarios API
   */
  B2BScenariosTypes,
  
  /**
   * Type definitions for Partner Directory API
   */
  PartnerDirectoryTypes,
  
  /**
   * Enhanced type definitions for Message Processing Logs
   */
  EnhancedLogTypes,
  
  /**
   * Integration Content Client
   */
  IntegrationContentClient,
  
  /**
   * Integration Content Advanced Client with extended functionality
   */
  IntegrationContentAdvancedClient,
  
  /**
   * Log Files Client Wrapper
   */
  LogFilesClient,
  
  /**
   * Message Processing Logs Client Wrapper
   */
  MessageProcessingLogsClient,
  
  /**
   * Message Store Client Wrapper
   */
  MessageStoreClient,
  
  /**
   * Security Content Client Wrapper
   */
  SecurityContentClient,
  
  /**
   * B2B Scenarios Client Wrapper
   */
  B2BScenariosClient,
  
  /**
   * Partner Directory Client Wrapper
   */
  PartnerDirectoryClient
}; 