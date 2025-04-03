/**
 * SAP Cloud Platform Integration API Client
 * Eine Bibliothek für die Interaktion mit SAP CPI APIs
 */

// Core Client
import SapClient from './clients/sap-client';

// Utilities
import Logger from './utils/logger';
import { formatSapTimestampsInObject } from './utils/date-formatter';

// Types
import * as IntegrationContentTypes from './types/sap.IntegrationContent';
import * as LogFilesTypes from './types/sap.LogFiles';
import * as MessageProcessingLogsTypes from './types/sap.MessageProcessingLogs';
import * as MessageStoreTypes from './types/sap.MessageStore';
import * as SecurityContentTypes from './types/sap.SecurityContent';

// Route Builders - optional für Express-basierte Anwendungen
import { createIntegrationContentRoutes } from './routes/integration-content.routes';
import createMessageProcessingLogsRoutes from './routes/message-processing-logs.routes';
import createLogFilesRoutes from './routes/log-files.routes';
import { createMessageStoreRoutes } from './routes/message-store.routes';
import { createSecurityContentRoutes } from './routes/security-content.routes';

// Exportiere Core Client als default
export default SapClient;

// Exportiere Hauptkomponenten
export {
  // Client
  SapClient,
  
  // Utilities
  Logger,
  formatSapTimestampsInObject,
  
  // Types
  IntegrationContentTypes,
  LogFilesTypes,
  MessageProcessingLogsTypes,
  MessageStoreTypes,
  SecurityContentTypes,
  
  // Route Builders
  createIntegrationContentRoutes,
  createMessageProcessingLogsRoutes,
  createLogFilesRoutes,
  createMessageStoreRoutes,
  createSecurityContentRoutes
}; 