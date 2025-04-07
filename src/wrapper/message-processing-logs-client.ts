/**
 * SAP Message Processing Logs Client
 * 
 * This file contains a client class for interacting with the 
 * Message Processing Logs API of SAP Cloud Integration.
 * 
 * @module sap-integration-suite-client/message-processing-logs
 */

import { 
  Api as MessageProcessingLogsApi,
  ComSapHciApiMessageProcessingLog,
  ComSapHciApiMessageProcessingLogAdapterAttribute,
  ComSapHciApiMessageProcessingLogAttachment,
  ComSapHciApiMessageProcessingLogCustomHeaderProperty,
  ComSapHciApiMessageProcessingLogErrorInformation,
  ComSapHciApiIdMapToId,
  ComSapHciApiIdMapFromId2,
  ComSapHciApiIdempotentRepositoryEntry,
  ComSapHciApiGenericIdempotentRepositoryEntry,
  ComSapHciApiArchivingKeyPerformanceIndicators
} from '../types/sap.MessageProcessingLogs';

import { 
  EnhancedMessageProcessingLog,
  MessageProcessingLogsOptions,
  DateFieldFilter 
} from '../types/enhanced-logs';

import { SapDateUtils } from '../utils/date-formatter';
import { enhanceLogsWithDates } from '../utils/log-enhancer';
import { buildODataFilter } from '../utils/odata-filter-builder';
import { ResponseNormalizer } from '../utils/response-normalizer';

/**
 * SAP Message Processing Logs Client
 * 
 * Provides simplified access to the Message Processing Logs API.
 */
export class MessageProcessingLogsClient {
  private api: MessageProcessingLogsApi<unknown>;
  private normalizer: ResponseNormalizer;

  /**
   * Creates a new MessageProcessingLogsClient
   * 
   * @param {MessageProcessingLogsApi<unknown>} api - The underlying API instance
   */
  constructor(api: MessageProcessingLogsApi<unknown>) {
    this.api = api;
    this.normalizer = new ResponseNormalizer();
  }

  /**
   * Retrieves message processing logs based on specified criteria.
   * 
   * @param {MessageProcessingLogsOptions} [options] Optional parameters for filtering and pagination.
   * @returns {Promise<{ logs: EnhancedMessageProcessingLog[], count?: number }>} Promise resolving to the logs with Date objects and optional count.
   * 
   * @example
   * // Get the top 10 failed logs
   * const { logs } = await client.getMessageProcessingLogs({ 
   *   top: 10, 
   *   filter: "Status eq 'FAILED'", 
   *   orderby: ['LogEnd desc'] 
   * });
   * 
   * @example
   * // Get logs with count
   * const { logs, count } = await client.getMessageProcessingLogs({ 
   *   filter: "IntegrationFlowName eq 'MyFlow'", 
   *   inlinecount: true 
   * });
   * console.log(`Total logs for MyFlow: ${count}`);
   * 
   * @example
   * // Get logs from the last hour using Date objects with filterObj
   * const oneHourAgo = new Date();
   * oneHourAgo.setHours(oneHourAgo.getHours() - 1);
   * const { logs } = await client.getMessageProcessingLogs({
   *   filterObj: {
   *     LogEnd: { gt: oneHourAgo }
   *   }
   * });
   * 
   * @example
   * // Get logs from the last hour using startDate parameter
   * const oneHourAgo = new Date();
   * oneHourAgo.setHours(oneHourAgo.getHours() - 1);
   * const { logs } = await client.getMessageProcessingLogs({
   *   startDate: oneHourAgo,
   *   orderby: ['LogEnd desc']
   * });
   * 
   * @example
   * // Get logs with Status and specific date range
   * const { logs } = await client.getMessageProcessingLogs({
   *   filterObj: {
   *     Status: 'COMPLETED',
   *     LogEnd: { 
   *       ge: new Date('2023-04-01'), 
   *       lt: new Date('2023-04-02')
   *     }
   *   }
   * });
   * 
   * @example
   * // Use raw filter with datetime - the client will automatically handle date format
   * const { logs } = await client.getMessageProcessingLogs({
   *   filter: "IntegrationFlowName eq 'MyFlow' and LogStart ge datetime'2023-04-01T00:00:00Z'",
   * });
   */
  async getMessageProcessingLogs(options: MessageProcessingLogsOptions = {}): Promise<{ logs: EnhancedMessageProcessingLog[], count?: number }> {
    // Build filter from filterObj if provided
    let filterObj = options.filterObj || {};
    
    // Handle startDate and endDate parameters by adding them to filterObj
    if (options.startDate || options.endDate) {
      // Initialize LogEnd filter object if it doesn't exist
      filterObj.LogEnd = filterObj.LogEnd || {};
      
      // Add startDate as ge (greater than or equal) filter
      if (options.startDate) {
        filterObj.LogEnd.ge = options.startDate;
      }
      
      // Add endDate as le (less than or equal) filter
      if (options.endDate) {
        filterObj.LogEnd.le = options.endDate;
      }
    }
    
    // Build the OData filter string
    let filter = options.filter;
    if (Object.keys(filterObj).length > 0) {
      filter = buildODataFilter(filterObj);
    }
    
    // Sanitize any datetime values in the filter
    if (filter && filter.includes('datetime')) {
      filter = SapDateUtils.sanitizeFilterDatetimes(filter);
    }
    
    const response = await this.api.messageProcessingLogs.messageProcessingLogsList({
      $top: options.top,
      $skip: options.skip,
      $filter: filter,
      $orderby: options.orderby,
      $select: options.select,
      $inlinecount: options.inlinecount ? ['allpages'] : undefined,
    });
    
    const originalLogs = this.normalizer.normalizeArrayResponse(response.data, 'getMessageProcessingLogs');
    // Convert date strings to Date objects using the utility function
    const logs = enhanceLogsWithDates(originalLogs);
    
    // The count is returned as string property __count if $inlinecount is used
    const countString = (response.data?.d as any)?.__count;
    const count = countString ? parseInt(countString, 10) : undefined;

    return { logs, count };
  }

  /**
   * Retrieves a specific message processing log by its Message GUID.
   * The returned log will have LogStart and LogEnd as Date objects.
   * 
   * @param {string} messageGuid The unique Message GUID of the log entry.
   * @param {object} [options] Optional parameters for selecting properties and expanding related entities.
   * @param {('CorrelationId' | 'ApplicationMessageId' | 'ApplicationMessageType' | 'IntegrationFlowName' | 'IntegrationArtifact' | 'Status' | 'CustomStatus' | 'LogLevel' | 'LogStart' | 'LogEnd' | 'Sender' | 'Receiver' | 'AlternateWebLink' | 'ArchivingStatus' | 'ArchivingSenderChannelMessages' | 'ArchivingReceiverChannelMessages' | 'ArchivingLogAttachments' | 'ArchivingPersistedMessages')[]} [options.select] Properties to select.
   * @param {('AdapterAttributes' | 'CustomHeaderProperties')[]} [options.expand] Related entities to expand.
   * @returns {Promise<EnhancedMessageProcessingLog | undefined>} Promise resolving to the log entry with Date objects or undefined if not found.
   * 
   * @example
   * const log = await client.getMessageProcessingLogById('005056ab-1234-1edc-abcd-1234567890ab');
   * if (log && log.LogEnd) {
   *   console.log(`Log end time: ${log.LogEnd.toLocaleTimeString()}`);
   * }
   */
  async getMessageProcessingLogById(messageGuid: string, options: {
    select?: ('CorrelationId' | 'ApplicationMessageId' | 'ApplicationMessageType' | 'IntegrationFlowName' | 'IntegrationArtifact' | 'Status' | 'CustomStatus' | 'LogLevel' | 'LogStart' | 'LogEnd' | 'Sender' | 'Receiver' | 'AlternateWebLink' | 'ArchivingStatus' | 'ArchivingSenderChannelMessages' | 'ArchivingReceiverChannelMessages' | 'ArchivingLogAttachments' | 'ArchivingPersistedMessages')[];
    expand?: ('AdapterAttributes' | 'CustomHeaderProperties')[];
  } = {}): Promise<EnhancedMessageProcessingLog | undefined> {
    const response = await this.api.messageProcessingLogsMessageGuid.messageProcessingLogsList(messageGuid, {
      $select: options.select,
      $expand: options.expand,
    });
    
    const log = this.normalizer.normalizeEntityResponse(response.data, 'getMessageProcessingLogById');
    
    if (!log) return undefined;
    
    // Convert to enhanced log with Date objects using the utility function
    const enhancedLogs = enhanceLogsWithDates([log]);
    return enhancedLogs[0];
  }

  /**
   * Retrieves adapter attributes for a specific message processing log.
   * 
   * @param {string} messageGuid The Message GUID of the log entry.
   * @param {('Id' | 'AdapterId' | 'AdapterMessageId' | 'Name' | 'Value')[]} [select] Properties to select.
   * @returns {Promise<ComSapHciApiMessageProcessingLogAdapterAttribute[]>} Promise resolving to the list of adapter attributes.
   * 
   * @example
   * const attributes = await client.getLogAdapterAttributes('guid...');
   */
  async getLogAdapterAttributes(
    messageGuid: string,
    select?: ('Id' | 'AdapterId' | 'AdapterMessageId' | 'Name' | 'Value')[]
  ): Promise<ComSapHciApiMessageProcessingLogAdapterAttribute[]> {
    const response = await this.api.messageProcessingLogsMessageGuid.adapterAttributesList(messageGuid, {
      $select: select,
    });
    return this.normalizer.normalizeArrayResponse(response.data, 'getLogAdapterAttributes');
  }

  /**
   * Retrieves attachments for a specific message processing log.
   * 
   * @param {string} messageGuid The Message GUID of the log entry.
   * @returns {Promise<ComSapHciApiMessageProcessingLogAttachment[]>} Promise resolving to the list of attachments.
   * 
   * @example
   * const attachments = await client.getLogAttachments('guid...');
   */
  async getLogAttachments(messageGuid: string): Promise<ComSapHciApiMessageProcessingLogAttachment[]> {
    const response = await this.api.messageProcessingLogsMessageGuid.attachmentsList(messageGuid);
    return this.normalizer.normalizeArrayResponse(response.data, 'getLogAttachments');
  }

  /**
   * Retrieves custom header properties for a specific message processing log.
   * 
   * @param {string} messageGuid The Message GUID of the log entry.
   * @param {object} [options] Optional parameters for filtering, pagination, sorting, and selection.
   * @param {number} [options.top] Maximum number of properties to retrieve.
   * @param {number} [options.skip] Number of properties to skip.
   * @param {string} [options.filter] OData filter string.
   * @param {('Name' | 'Name desc' | 'Name,Value' | 'Value desc')[]} [options.orderby] Sorting order.
   * @param {('Id' | 'Name' | 'Value')[]} [options.select] Properties to select.
   * @returns {Promise<ComSapHciApiMessageProcessingLogCustomHeaderProperty[]>} Promise resolving to the list of custom header properties.
   * 
   * @example
   * const headers = await client.getLogCustomHeaderProperties('guid...');
   */
  async getLogCustomHeaderProperties(
    messageGuid: string,
    options: {
      top?: number;
      skip?: number;
      filter?: string;
      orderby?: ('Name' | 'Name desc' | 'Name,Value' | 'Value desc')[];
      select?: ('Id' | 'Name' | 'Value')[];
    } = {}
  ): Promise<ComSapHciApiMessageProcessingLogCustomHeaderProperty[]> {
    const response = await this.api.messageProcessingLogsMessageGuid.customHeaderPropertiesList(messageGuid, {
      $top: options.top,
      $skip: options.skip,
      $filter: options.filter,
      $orderby: options.orderby,
      $select: options.select,
    });
    return this.normalizer.normalizeArrayResponse(response.data, 'getLogCustomHeaderProperties');
  }

  /**
   * Retrieves the error information object for a specific message processing log.
   * 
   * @param {string} messageGuid The Message GUID of the log entry.
   * @returns {Promise<ComSapHciApiMessageProcessingLogErrorInformation | undefined>} Promise resolving to the error information object or undefined.
   * 
   * @example
   * const errorInfo = await client.getLogErrorInformation('guid...');
   * if (errorInfo) {
   *   console.log(`Error Step ID: ${errorInfo.LastErrorModelStepId}`);
   * }
   */
  async getLogErrorInformation(messageGuid: string): Promise<ComSapHciApiMessageProcessingLogErrorInformation | undefined> {
    const response = await this.api.messageProcessingLogsMessageGuid.errorInformationList(messageGuid);
    return this.normalizer.normalizeEntityResponse(response.data, 'getLogErrorInformation');
  }

  /**
   * Retrieves the error information text for a specific message processing log.
   * 
   * Note: The generated API client returns `void`, but the actual response body contains the text.
   * This method attempts to cast the response data to string.
   * 
   * @param {string} messageGuid The Message GUID of the log entry.
   * @returns {Promise<string | undefined>} Promise resolving to the error text or undefined.
   * 
   * @example
   * const errorText = await client.getLogErrorInformationText('guid...');
   * if (errorText) {
   *   console.error("Error:", errorText);
   * }
   */
  async getLogErrorInformationText(messageGuid: string): Promise<string | undefined> {
    const response = await this.api.messageProcessingLogsMessageGuid.errorInformationValueList(messageGuid);
    // API spec says void, but data is likely in response.data
    return response.data as unknown as string | undefined;
  }

  // --- ID Mapper Methods ---

  /**
   * Retrieves all target IDs mapped to a given source ID in the ID Mapper.
   * 
   * @param {string} sourceId The source ID.
   * @returns {Promise<ComSapHciApiIdMapToId[]>} Promise resolving to a list of target ID mappings.
   * 
   * @example
   * const targetMappings = await client.getIdMapperTargetIds('SourceSystemID123');
   */
  async getIdMapperTargetIds(sourceId: string): Promise<ComSapHciApiIdMapToId[]> {
    const response = await this.api.idMapFromIdsSourceId.toIdsList(sourceId);
    return this.normalizer.normalizeArrayResponse(response.data, 'getIdMapperTargetIds');
  }

  /**
   * Retrieves all source IDs mapped to a given target ID in the ID Mapper.
   * 
   * @param {string} targetId The target ID.
   * @returns {Promise<ComSapHciApiIdMapFromId2[]>} Promise resolving to a list of source ID mappings.
   * 
   * @example
   * const sourceMappings = await client.getIdMapperSourceIds('TargetSystemID456');
   */
  async getIdMapperSourceIds(targetId: string): Promise<ComSapHciApiIdMapFromId2[]> {
    const response = await this.api.idMapToIdsTargetId.fromId2SList(targetId);
    return this.normalizer.normalizeArrayResponse(response.data, 'getIdMapperSourceIds');
  }

  // --- Idempotent Repository Methods ---

  /**
   * @deprecated Use getGenericIdempotentRepositoryEntriesById instead. Retrieves Idempotent Repository entries by ID.
   * 
   * @param {string} entryId Entry ID (e.g., <source directory>/<file name> for SFTP, XI message ID for XI).
   * @returns {Promise<ComSapHciApiIdempotentRepositoryEntry[]>} Promise resolving to a list of entries.
   * 
   * @example
   * const entries = await client.getIdempotentRepositoryEntriesById('InputFolder/file.xml');
   */
  async getIdempotentRepositoryEntriesById(entryId: string): Promise<ComSapHciApiIdempotentRepositoryEntry[]> {
    const response = await this.api.idempotentRepositoryEntries.idempotentRepositoryEntriesList({ id: entryId });
    return this.normalizer.normalizeArrayResponse(response.data, 'getIdempotentRepositoryEntriesById');
  }

  /**
   * @deprecated Use getGenericIdempotentRepositoryEntry instead. Retrieves a specific Idempotent Repository entry by hex-encoded source and entry.
   * 
   * @param {string} hexSource Hex-encoded source.
   * @param {string} hexEntry Hex-encoded entry ID.
   * @returns {Promise<ComSapHciApiIdempotentRepositoryEntry | undefined>} Promise resolving to the entry or undefined.
   * 
   * @example
   * const entry = await client.getIdempotentRepositoryEntry('7573...', '496e...');
   */
  async getIdempotentRepositoryEntry(hexSource: string, hexEntry: string): Promise<ComSapHciApiIdempotentRepositoryEntry | undefined> {
    const response = await this.api.idempotentRepositoryEntriesHexSourceHexSourceHexEntryHexEntry.idempotentRepositoryEntriesHexSourceHexEntryList(hexSource, hexEntry);
    // Assuming the response structure contains the entry directly, adjust if needed.
    return response.data as ComSapHciApiIdempotentRepositoryEntry | undefined; 
  }

  /**
   * @deprecated Use deleteGenericIdempotentRepositoryEntry instead. Deletes a specific Idempotent Repository entry.
   * 
   * @param {string} hexSource Hex-encoded source.
   * @param {string} hexEntry Hex-encoded entry ID.
   * @returns {Promise<void>} Promise resolving when the entry is deleted.
   * 
   * @example
   * await client.deleteIdempotentRepositoryEntry('7573...', '496e...');
   */
  async deleteIdempotentRepositoryEntry(hexSource: string, hexEntry: string): Promise<void> {
    await this.api.idempotentRepositoryEntriesHexSourceHexSourceHexEntryHexEntry.idempotentRepositoryEntriesHexSourceHexEntryDelete(hexSource, hexEntry);
  }

  /**
   * Retrieves Generic Idempotent Repository entries by ID.
   * 
   * @param {string} entryId Entry ID (e.g., <source directory>/<file name> for SFTP, XI message ID for XI).
   * @returns {Promise<ComSapHciApiGenericIdempotentRepositoryEntry[]>} Promise resolving to a list of entries.
   * 
   * @example
   * const entries = await client.getGenericIdempotentRepositoryEntriesById('InputFolder/file.xml');
   */
  async getGenericIdempotentRepositoryEntriesById(entryId: string): Promise<ComSapHciApiGenericIdempotentRepositoryEntry[]> {
    const response = await this.api.genericIdempotentRepositoryEntries.genericIdempotentRepositoryEntriesList({ id: entryId });
    return this.normalizer.normalizeArrayResponse(response.data, 'getGenericIdempotentRepositoryEntriesById');
  }

  /**
   * Retrieves a specific Generic Idempotent Repository entry by hex-encoded identifiers.
   * 
   * @param {string} hexVendor Hex-encoded vendor.
   * @param {string} hexSource Hex-encoded source.
   * @param {string} hexEntry Hex-encoded entry ID.
   * @param {string} hexComponent Hex-encoded component.
   * @returns {Promise<ComSapHciApiGenericIdempotentRepositoryEntry | undefined>} Promise resolving to the entry or undefined.
   * 
   * @example
   * const entry = await client.getGenericIdempotentRepositoryEntry('5341...', '7573...', '496e...', '5346...');
   */
  async getGenericIdempotentRepositoryEntry(
    hexVendor: string, 
    hexSource: string, 
    hexEntry: string, 
    hexComponent: string
  ): Promise<ComSapHciApiGenericIdempotentRepositoryEntry | undefined> {
    const response = await this.api.genericIdempotentRepositoryEntriesHexVendorHexVendorHexSourceHexSourceHexEntryHexEntryHexComponentHexComponent.genericIdempotentRepositoryEntriesHexVendorHexSourceHexEntryHexComponentList(
      hexVendor, 
      hexSource, 
      hexEntry, 
      hexComponent
    );
    // Assuming the response structure contains the entry directly, adjust if needed.
    return response.data as ComSapHciApiGenericIdempotentRepositoryEntry | undefined; 
  }

  /**
   * Deletes a specific Generic Idempotent Repository entry.
   * 
   * @param {string} hexVendor Hex-encoded vendor.
   * @param {string} hexSource Hex-encoded source.
   * @param {string} hexEntry Hex-encoded entry ID.
   * @param {string} hexComponent Hex-encoded component.
   * @returns {Promise<void>} Promise resolving when the entry is deleted.
   * 
   * @example
   * await client.deleteGenericIdempotentRepositoryEntry('5341...', '7573...', '496e...', '5346...');
   */
  async deleteGenericIdempotentRepositoryEntry(
    hexVendor: string, 
    hexSource: string, 
    hexEntry: string, 
    hexComponent: string
  ): Promise<void> {
    await this.api.genericIdempotentRepositoryEntriesHexVendorHexVendorHexSourceHexSourceHexEntryHexEntryHexComponentHexComponent.genericIdempotentRepositoryEntriesHexVendorHexSourceHexEntryHexComponentDelete(
      hexVendor, 
      hexSource, 
      hexEntry, 
      hexComponent
    );
  }

  // --- External Logging Methods (Cloud Foundry only) ---

  /**
   * Activates external logging on the tenant.
   * Note: Only available in Cloud Foundry environment.
   * 
   * @param {('NONE' | 'INFO' | 'ERROR')} [defaultLogLevel='NONE'] Default external log level for new/existing flows without individual configuration.
   * @returns {Promise<object>} Promise resolving to the response object (structure might vary).
   * 
   * @example
   * try {
   *   const result = await client.activateExternalLogging('INFO');
   *   console.log('External logging activated:', result);
   * } catch (error) {
   *   console.error('Failed to activate external logging:', error);
   * }
   */
  async activateExternalLogging(defaultLogLevel: ('NONE' | 'INFO' | 'ERROR') = 'NONE'): Promise<object> {
    const response = await this.api.activateExternalLogging.activateExternalLoggingCreate({ defaultLogLevel: [defaultLogLevel] });
    return response.data as object; // Return type is generic object
  }

  /**
   * Deactivates external logging on the tenant.
   * Note: Only available in Cloud Foundry environment.
   * 
   * @returns {Promise<object>} Promise resolving to the response object (structure might vary).
   * 
   * @example
   * await client.deactivateExternalLogging();
   */
  async deactivateExternalLogging(): Promise<object> {
    const response = await this.api.deactivateExternalLogging.deactivateExternalLoggingCreate();
    return response.data as object;
  }

  /**
   * Retrieves the external logging activation status for a tenant.
   * Note: Only available in Cloud Foundry environment.
   * 
   * @param {string} tenantName The name of the tenant.
   * @returns {Promise<object>} Promise resolving to the status object (structure might vary).
   * 
   * @example
   * const status = await client.getExternalLoggingStatus('my-tenant-name');
   * console.log('External logging status:', status);
   */
  async getExternalLoggingStatus(tenantName: string): Promise<object> {
    const response = await this.api.externalLoggingActivationStatusTenantName.externalLoggingActivationStatusList(tenantName);
    return response.data as object;
  }

  // --- Data Archiving Methods (Cloud Foundry only) ---

  /**
   * Activates the archiving functionality on the tenant.
   * Note: Only available in Cloud Foundry environment.
   * 
   * @returns {Promise<object>} Promise resolving to the response object (structure might vary).
   * 
   * @example
   * await client.activateArchivingConfiguration();
   */
  async activateArchivingConfiguration(): Promise<object> {
    const response = await this.api.activateArchivingConfiguration.activateArchivingConfigurationCreate();
    return response.data as object;
  }

  /**
   * Retrieves the archiving configuration for a tenant.
   * Note: Only available in Cloud Foundry environment.
   * 
   * @param {string} tenantName The name of the tenant.
   * @returns {Promise<object>} Promise resolving to the configuration object (structure might vary).
   * 
   * @example
   * const config = await client.getArchivingConfiguration('my-tenant-name');
   * console.log('Archiving config:', config);
   */
  async getArchivingConfiguration(tenantName: string): Promise<object> {
    const response = await this.api.archivingConfigurationsTenantName.archivingConfigurationsList(tenantName);
    return response.data as object;
  }

  /**
   * Retrieves Key Performance Indicators (KPIs) for archiving runs.
   * Note: Only available in Cloud Foundry environment.
   * 
   * @param {string} [filter] OData filter string (e.g., "RunStatus eq 'COMPLETED'").
   * @returns {Promise<ComSapHciApiArchivingKeyPerformanceIndicators[]>} Promise resolving to a list of KPI objects.
   * 
   * @example
   * const kpis = await client.getArchivingKpis("RunStatus eq 'COMPLETED'");
   * kpis.forEach(kpi => console.log(`Run ${kpi.RunStart}: ${kpi.MplsArchived} archived`));
   */
  async getArchivingKpis(filter?: string): Promise<ComSapHciApiArchivingKeyPerformanceIndicators[]> {
    const response = await this.api.archivingKeyPerformanceIndicators.archivingKeyPerformanceIndicatorsList({ $filter: filter });
    return this.normalizer.normalizeArrayResponse(response.data, 'getArchivingKpis');
  }
}
