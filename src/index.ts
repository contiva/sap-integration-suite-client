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

// Utilities
import { formatSapTimestampsInObject } from './utils/date-formatter';

// Types
import * as IntegrationContentTypes from './types/sap.IntegrationContent';
import * as LogFilesTypes from './types/sap.LogFiles';
import * as MessageProcessingLogsTypes from './types/sap.MessageProcessingLogs';
import * as MessageStoreTypes from './types/sap.MessageStore';
import * as SecurityContentTypes from './types/sap.SecurityContent';

/**
 * Default client instance for backward compatibility
 * 
 * This client reads configuration from environment variables:
 * - SAP_BASE_URL
 * - SAP_OAUTH_CLIENT_ID
 * - SAP_OAUTH_CLIENT_SECRET
 * - SAP_OAUTH_TOKEN_URL
 * 
 * @deprecated Consider creating your own client instance with explicit configuration
 */
const defaultClient = new SapClient();

// Export Core Client class as default
export default SapClient;

/**
 * Export named components from the library
 */
export {
  /**
   * Default client instance that reads from environment variables
   * Use only if you have environment variables properly configured
   */
  defaultClient,
  
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
  SecurityContentTypes
}; 