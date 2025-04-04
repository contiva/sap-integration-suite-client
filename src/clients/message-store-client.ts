/**
 * SAP Message Store Client
 * 
 * This file contains a client class for interacting with the 
 * Message Store API of SAP Cloud Integration. This API allows access to 
 * persisted message payloads, attachments, properties, JMS resources, 
 * Number Ranges, Data Stores, and Variables.
 * 
 * @module sap-integration-suite-client/message-store
 */

import { 
  Api as MessageStoreApi,
  ComSapHciApiMessageStoreEntry,
  ComSapHciApiMessageStoreEntryAttachment,
  ComSapHciApiMessageStoreEntryProperty,
  ComSapHciApiMessageStoreEntryAttachmentProperty,
  ComSapHciApiJmsBrokerQueueStates,
  ComSapHciApiNumberRanges,
  ComSapHciApiNumberRangesPut,
  ComSapHciApiDataStores,
  ComSapHciApiDataStoreEntries,
  ComSapHciApiVariables,
} from '../types/sap.MessageStore';

/**
 * SAP Message Store Client
 * 
 * Provides simplified access to the Message Store API.
 */
export class MessageStoreClient {
  private api: MessageStoreApi<unknown>;

  /**
   * Creates a new MessageStoreClient
   * 
   * @param {MessageStoreApi<unknown>} api - The underlying API instance
   */
  constructor(api: MessageStoreApi<unknown>) {
    this.api = api;
  }

  // --- Message Store Entry Methods ---

  /**
   * Retrieves message store entries associated with a specific Message Processing Log GUID.
   * 
   * @param {string} messageGuid The Message GUID from the Message Processing Log.
   * @returns {Promise<ComSapHciApiMessageStoreEntry[]>} Promise resolving to a list of message store entries.
   * 
   * @example
   * const entries = await client.getMessageStoreEntriesForMessage('log-guid...');
   */
  async getMessageStoreEntriesForMessage(messageGuid: string): Promise<ComSapHciApiMessageStoreEntry[]> {
    const response = await this.api.messageProcessingLogsMessageGuid.messageStoreEntriesList(messageGuid);
    return response.data?.d?.results || [];
  }

  /**
   * Retrieves a specific message store entry by its unique ID.
   * 
   * @param {string} entryId The ID of the message store entry.
   * @returns {Promise<ComSapHciApiMessageStoreEntry | undefined>} Promise resolving to the entry or undefined if not found.
   * 
   * @example
   * const entry = await client.getMessageStoreEntryById('entry-id...');
   */
  async getMessageStoreEntryById(entryId: string): Promise<ComSapHciApiMessageStoreEntry | undefined> {
    const response = await this.api.messageStoreEntriesMessageStoreEntryId.messageStoreEntriesList(entryId);
    return response.data?.d;
  }

  /**
   * Downloads the payload of a specific message store entry.
   * 
   * Note: The API spec returns `void`, but the payload is expected in the response body.
   * This method returns the raw response data, which might need casting (e.g., to string, Buffer).
   * 
   * @param {string} entryId The ID of the message store entry.
   * @returns {Promise<any>} Promise resolving to the message payload (type depends on content).
   * 
   * @example
   * try {
   *   const payload = await client.getMessageStoreEntryPayload('entry-id...');
   *   // Process payload (e.g., convert to string if text)
   *   const payloadString = Buffer.from(payload).toString(); 
   *   console.log(payloadString);
   * } catch (error) {
   *   console.error("Failed to download payload:", error);
   * }
   */
  async getMessageStoreEntryPayload(entryId: string): Promise<any> {
    const response = await this.api.messageStoreEntriesMessageStoreEntryId.valueList(entryId);
    // API spec is void, return raw data
    return response.data;
  }

  // --- Message Store Entry Attachment & Property Methods ---

  /**
   * Retrieves attachments for a specific message store entry.
   * 
   * @param {string} entryId The ID of the message store entry.
   * @returns {Promise<ComSapHciApiMessageStoreEntryAttachment[]>} Promise resolving to a list of attachments.
   * 
   * @example
   * const attachments = await client.getMessageStoreEntryAttachments('entry-id...');
   */
  async getMessageStoreEntryAttachments(entryId: string): Promise<ComSapHciApiMessageStoreEntryAttachment[]> {
    const response = await this.api.messageStoreEntriesMessageStoreEntryId.attachmentsList(entryId);
    return response.data?.d?.results || [];
  }

  /**
   * Retrieves a specific attachment metadata by its ID.
   * 
   * @param {string} attachmentId The ID of the attachment.
   * @returns {Promise<ComSapHciApiMessageStoreEntryAttachment | undefined>} Promise resolving to the attachment metadata or undefined.
   * 
   * @example
   * const attachmentInfo = await client.getMessageStoreEntryAttachmentById('attachment-id...');
   */
  async getMessageStoreEntryAttachmentById(attachmentId: string): Promise<ComSapHciApiMessageStoreEntryAttachment | undefined> {
    const response = await this.api.messageStoreEntryAttachmentsMessageStoreEntryAttachmentId.messageStoreEntryAttachmentsList(attachmentId);
    return response.data?.d;
  }

  /**
   * Downloads the content of a specific message store entry attachment.
   * 
   * Note: The API spec returns `void`, but the content is expected in the response body.
   * This method returns the raw response data, which might need casting.
   * 
   * @param {string} attachmentId The ID of the attachment.
   * @returns {Promise<any>} Promise resolving to the attachment content.
   * 
   * @example
   * const content = await client.getMessageStoreEntryAttachmentContent('attachment-id...');
   */
  async getMessageStoreEntryAttachmentContent(attachmentId: string): Promise<any> {
    const response = await this.api.messageStoreEntryAttachmentsMessageStoreEntryAttachmentId.valueList(attachmentId);
    // API spec is void, return raw data
    return response.data;
  }

  /**
   * Retrieves properties for a specific message store entry attachment.
   * 
   * @param {string} attachmentId The ID of the attachment.
   * @returns {Promise<ComSapHciApiMessageStoreEntryAttachmentProperty[]>} Promise resolving to a list of attachment properties.
   * 
   * @example
   * const props = await client.getMessageStoreEntryAttachmentProperties('attachment-id...');
   */
  async getMessageStoreEntryAttachmentProperties(attachmentId: string): Promise<ComSapHciApiMessageStoreEntryAttachmentProperty[]> {
    const response = await this.api.messageStoreEntryAttachmentsMessageStoreEntryAttachmentId.propertiesList(attachmentId);
    return response.data?.d?.results || [];
  }

  /**
   * Retrieves a specific property of a message store entry attachment by its name.
   * 
   * @param {string} attachmentId The ID of the attachment.
   * @param {string} propertyName The name of the property.
   * @returns {Promise<ComSapHciApiMessageStoreEntryAttachmentProperty | undefined>} Promise resolving to the property or undefined.
   * 
   * @example
   * const prop = await client.getMessageStoreEntryAttachmentPropertyByName('attachment-id...', 'MyProp');
   */
  async getMessageStoreEntryAttachmentPropertyByName(attachmentId: string, propertyName: string): Promise<ComSapHciApiMessageStoreEntryAttachmentProperty | undefined> {
    const response = await this.api.messageStoreEntryAttachmentPropertiesAttachmentIdMessageStoreEntryAttachmentIdNameName
      .messageStoreEntryAttachmentPropertiesAttachmentIdNameList(attachmentId, propertyName);
    return response.data?.d;
  }

  /**
   * Retrieves properties for a specific message store entry.
   * 
   * @param {string} entryId The ID of the message store entry.
   * @returns {Promise<ComSapHciApiMessageStoreEntryProperty[]>} Promise resolving to a list of entry properties.
   * 
   * @example
   * const props = await client.getMessageStoreEntryProperties('entry-id...');
   */
  async getMessageStoreEntryProperties(entryId: string): Promise<ComSapHciApiMessageStoreEntryProperty[]> {
    const response = await this.api.messageStoreEntriesMessageStoreEntryId.propertiesList(entryId);
    return response.data?.d?.results || [];
  }

  /**
   * Retrieves a specific property of a message store entry by its name.
   * 
   * @param {string} entryId The ID of the message store entry.
   * @param {string} propertyName The name of the property.
   * @returns {Promise<ComSapHciApiMessageStoreEntryProperty | undefined>} Promise resolving to the property or undefined.
   * 
   * @example
   * const prop = await client.getMessageStoreEntryPropertyByName('entry-id...', 'MyHeader');
   */
  async getMessageStoreEntryPropertyByName(entryId: string, propertyName: string): Promise<ComSapHciApiMessageStoreEntryProperty | undefined> {
    const response = await this.api.messageStoreEntryPropertiesMessageIdMessageStoreEntryIdNamePropertyName
      .messageStoreEntryPropertiesMessageIdNameList(entryId, propertyName);
    return response.data?.d;
  }

  // --- JMS Resource Methods ---

  /**
   * Retrieves information about JMS resources (queues, capacity, states).
   * 
   * @param {boolean} [expandQueueStates=false] If true, expands queue states.
   * @param {boolean} [expandInactiveQueues=false] If true, expands inactive queues.
   * @returns {Promise<ComSapHciApiJmsBrokerQueueStates>} Promise resolving to the JMS broker information.
   * 
   * @example
   * const jmsInfo = await client.getJmsBrokerInfo();
   * console.log(`Current Queue Number: ${jmsInfo.QueueNumber}`);
   * 
   * @example
   * // Get info including queue states
   * const jmsInfoWithQueues = await client.getJmsBrokerInfo(true);
   * jmsInfoWithQueues.QueueStates?.forEach(q => console.log(`${q.Name}: ${q.State}`));
   */
  async getJmsBrokerInfo(expandQueueStates = false, expandInactiveQueues = false): Promise<ComSapHciApiJmsBrokerQueueStates> {
    const expandOptions: ('QueueStates' | 'InactiveQueues')[] = [];
    if (expandQueueStates) expandOptions.push('QueueStates');
    if (expandInactiveQueues) expandOptions.push('InactiveQueues');

    const response = await this.api.jmsBrokersBroker1.jmsBrokersBroker1List({
      $expand: expandOptions.length > 0 ? expandOptions : undefined,
    });
    // The API response might not have the nested 'd' structure here based on typical OData
    // Let's assume the data is directly under response.data for this endpoint
    return response.data as ComSapHciApiJmsBrokerQueueStates;
  }

  // --- Number Range Methods ---

  /**
   * Retrieves all Number Range objects available on the tenant.
   * 
   * @returns {Promise<ComSapHciApiNumberRanges[]>} Promise resolving to a list of number ranges.
   * 
   * @example
   * const ranges = await client.getNumberRanges();
   */
  async getNumberRanges(): Promise<ComSapHciApiNumberRanges[]> {
    const response = await this.api.numberRanges.numberRangesList();
    return response.data?.d?.results || [];
  }

  /**
   * Adds a new Number Range object.
   * 
   * @param {ComSapHciApiNumberRangesPut} rangeData Data for the new number range.
   * @returns {Promise<void>} Promise resolving when the number range is added.
   * 
   * @example
   * await client.createNumberRange({
   *   Name: 'MyNewRange',
   *   MinValue: '1000',
   *   MaxValue: '9999',
   *   FieldLength: '4',
   *   Rotate: 'true'
   * });
   */
  async createNumberRange(rangeData: ComSapHciApiNumberRangesPut): Promise<void> {
    await this.api.numberRanges.numberRangesCreate(rangeData);
  }

  /**
   * Retrieves a specific Number Range object by its name.
   * 
   * @param {string} name The name of the number range.
   * @returns {Promise<ComSapHciApiNumberRanges | undefined>} Promise resolving to the number range or undefined.
   * 
   * @example
   * const range = await client.getNumberRangeByName('MyExistingRange');
   */
  async getNumberRangeByName(name: string): Promise<ComSapHciApiNumberRanges | undefined> {
    // API response for single entity might not have the 'd' wrapper
    const response = await this.api.numberRangesObjectName.numberRangesList(name);
    return response.data as ComSapHciApiNumberRanges | undefined;
  }

  /**
   * Updates an existing Number Range object.
   * 
   * @param {string} name The name of the number range to update.
   * @param {ComSapHciApiNumberRangesPut} rangeData Updated data for the number range.
   * @returns {Promise<void>} Promise resolving when the number range is updated.
   * 
   * @example
   * await client.updateNumberRange('MyExistingRange', { CurrentValue: '1500' });
   */
  async updateNumberRange(name: string, rangeData: ComSapHciApiNumberRangesPut): Promise<void> {
    await this.api.numberRangesObjectName.numberRangesUpdate(name, rangeData);
  }

  /**
   * Deletes a Number Range object.
   * 
   * @param {string} name The name of the number range to delete.
   * @returns {Promise<void>} Promise resolving when the number range is deleted.
   * 
   * @example
   * await client.deleteNumberRange('MyOldRange');
   */
  async deleteNumberRange(name: string): Promise<void> {
    await this.api.numberRangesObjectName.numberRangesDelete(name);
  }

  // --- Data Store Methods ---

  /**
   * Retrieves available Data Stores.
   *
   * @param {boolean} [overdueOnly=false] If true, only returns Data Stores with overdue messages.
   * @returns {Promise<ComSapHciApiDataStores[]>} Promise resolving to a list of Data Stores.
   *
   * @example
   * const allStores = await client.getDataStores();
   * const overdueStores = await client.getDataStores(true);
   */
  async getDataStores(overdueOnly = false): Promise<ComSapHciApiDataStores[]> {
    const response = await this.api.dataStores.dataStoresList({ 
      overdueonly: overdueOnly ? ['true'] : undefined 
    });
    return response.data?.d?.results || [];
  }

  /**
   * Retrieves a specific Data Store by its composite key.
   *
   * @param {string} dataStoreName Name of the Data Store.
   * @param {string} integrationFlowId ID of the Integration Flow.
   * @param {string[]} type Type of the Data Store (e.g., ['GLOBAL'] or ['LOCAL']). Needs to be an array.
   * @returns {Promise<ComSapHciApiDataStores | undefined>} Promise resolving to the Data Store or undefined.
   *
   * @example
   * const store = await client.getDataStore('MyStore', 'flow1', ['GLOBAL']);
   */
  async getDataStore(
    dataStoreName: string, 
    integrationFlowId: string, 
    type: string[]
  ): Promise<ComSapHciApiDataStores | undefined> {
    const response = await this.api.dataStoresDataStoreNameDataStoreNameIntegrationFlowIntegrationFlowIdTypeType
      .dataStoresDataStoreNameIntegrationFlowTypeList(dataStoreName, integrationFlowId, type);
    // API returns single object, not wrapped in 'd'
    return response.data as ComSapHciApiDataStores | undefined;
  }

  /**
   * Deletes a specific Data Store and all its entries.
   *
   * @param {string} dataStoreName Name of the Data Store.
   * @param {string} integrationFlowId ID of the Integration Flow.
   * @param {string[]} type Type of the Data Store.
   * @returns {Promise<void>} Promise resolving when the Data Store is deleted.
   *
   * @example
   * await client.deleteDataStore('OldStore', 'flow1', ['LOCAL']);
   */
  async deleteDataStore(
    dataStoreName: string, 
    integrationFlowId: string, 
    type: string[]
  ): Promise<void> {
    await this.api.dataStoresDataStoreNameDataStoreNameIntegrationFlowIntegrationFlowIdTypeType
      .dataStoresDataStoreNameIntegrationFlowTypeDelete(dataStoreName, integrationFlowId, type);
  }

  /**
   * Retrieves all entries for a specific Data Store.
   *
   * @param {string} dataStoreName Name of the Data Store.
   * @param {string} integrationFlowId ID of the Integration Flow.
   * @param {string[]} type Type of the Data Store.
   * @param {boolean} [overdueOnly=false] If true, only returns overdue entries.
   * @param {string} [messageId] Filter entries by the originating Message Processing Log GUID.
   * @returns {Promise<ComSapHciApiDataStoreEntries[]>} Promise resolving to a list of Data Store entries.
   *
   * @example
   * const entries = await client.getDataStoreEntriesForStore('MyStore', 'flow1', ['GLOBAL']);
   * const overdueEntries = await client.getDataStoreEntriesForStore('MyStore', 'flow1', ['GLOBAL'], true);
   */
  async getDataStoreEntriesForStore(
    dataStoreName: string, 
    integrationFlowId: string, 
    type: string[], 
    overdueOnly = false, 
    messageId?: string
  ): Promise<ComSapHciApiDataStoreEntries[]> {
    const response = await this.api.dataStoresDataStoreNameDataStoreNameIntegrationFlowIntegrationFlowIdTypeType
      .entriesList(dataStoreName, integrationFlowId, type, { 
        overdueonly: overdueOnly ? ['true'] : undefined,
        messageid: messageId ? [messageId] : undefined
      });
    return response.data?.d?.results || [];
  }

  /**
   * Retrieves all Data Store entries across all Data Stores.
   *
   * @param {boolean} [overdueOnly=false] If true, only returns overdue entries.
   * @param {string} [messageId] Filter entries by the originating Message Processing Log GUID.
   * @returns {Promise<ComSapHciApiDataStoreEntries[]>} Promise resolving to a list of Data Store entries.
   *
   * @example
   * const allEntries = await client.getAllDataStoreEntries();
   */
  async getAllDataStoreEntries(
    overdueOnly = false, 
    messageId?: string
  ): Promise<ComSapHciApiDataStoreEntries[]> {
    const response = await this.api.dataStoreEntries.dataStoreEntriesList({
      overdueonly: overdueOnly ? ['true'] : undefined, 
      messageid: messageId ? [messageId] : undefined
    });
    return response.data?.d?.results || [];
  }

  /**
   * Retrieves a specific Data Store entry by its composite key.
   *
   * @param {string} id Entry ID.
   * @param {string} dataStoreName Name of the Data Store.
   * @param {string} integrationFlowId ID of the Integration Flow.
   * @param {string[]} type Type of the Data Store.
   * @returns {Promise<ComSapHciApiDataStoreEntries | undefined>} Promise resolving to the Data Store entry or undefined.
   *
   * @example
   * const entry = await client.getDataStoreEntry('entry123', 'MyStore', 'flow1', ['GLOBAL']);
   */
  async getDataStoreEntry(
    id: string,
    dataStoreName: string, 
    integrationFlowId: string, 
    type: string[]
  ): Promise<ComSapHciApiDataStoreEntries | undefined> {
    const response = await this.api.dataStoreEntriesIdIdDataStoreNameDataStoreNameIntegrationFlowIntegrationFlowIdTypeType
      .dataStoreEntriesIdDataStoreNameIntegrationFlowTypeList(id, dataStoreName, integrationFlowId, type);
    // API returns single object (type ComSapHciApiDataStores mistakenly), not wrapped in 'd'
    // We cast it to the correct entry type.
    return response.data as ComSapHciApiDataStoreEntries | undefined; 
  }

  /**
   * Deletes a specific Data Store entry.
   *
   * @param {string} id Entry ID.
   * @param {string} dataStoreName Name of the Data Store.
   * @param {string} integrationFlowId ID of the Integration Flow.
   * @param {string[]} type Type of the Data Store.
   * @returns {Promise<void>} Promise resolving when the entry is deleted.
   *
   * @example
   * await client.deleteDataStoreEntry('entryToDelete', 'MyStore', 'flow1', ['GLOBAL']);
   */
  async deleteDataStoreEntry(
    id: string,
    dataStoreName: string, 
    integrationFlowId: string, 
    type: string[]
  ): Promise<void> {
    await this.api.dataStoreEntriesIdIdDataStoreNameDataStoreNameIntegrationFlowIntegrationFlowIdTypeType
      .dataStoreEntriesIdDataStoreNameIntegrationFlowTypeDelete(id, dataStoreName, integrationFlowId, type);
  }

  /**
   * Downloads the content of a specific Data Store entry.
   *
   * Note: The API spec returns `void`, but the content is expected in the response body.
   * This method returns the raw response data, which might need casting.
   *
   * @param {string} id Entry ID.
   * @param {string} dataStoreName Name of the Data Store.
   * @param {string} integrationFlowId ID of the Integration Flow.
   * @param {string[]} type Type of the Data Store.
   * @returns {Promise<any>} Promise resolving to the entry content.
   *
   * @example
   * const content = await client.downloadDataStoreEntryContent('entry123', 'MyStore', 'flow1', ['GLOBAL']);
   */
  async downloadDataStoreEntryContent(
    id: string,
    dataStoreName: string, 
    integrationFlowId: string, 
    type: string[]
  ): Promise<any> {
    const response = await this.api.dataStoreEntriesIdIdDataStoreNameDataStoreNameIntegrationFlowIntegrationFlowIdTypeType
      .valueList(id, dataStoreName, integrationFlowId, type);
    // API spec is void, return raw data
    return response.data;
  }

  // --- Variable Methods ---

  /**
   * Retrieves all Variable entries available on the tenant.
   *
   * @returns {Promise<ComSapHciApiVariables[]>} Promise resolving to a list of Variable entries.
   *
   * @example
   * const variables = await client.getVariables();
   */
  async getVariables(): Promise<ComSapHciApiVariables[]> {
    const response = await this.api.variables.variablesList();
    return response.data?.d?.results || [];
  }

  /**
   * Retrieves a specific Variable by its name and associated Integration Flow ID.
   *
   * @param {string} variableName Name of the Variable.
   * @param {string} integrationFlowId ID of the Integration Flow.
   * @returns {Promise<ComSapHciApiVariables | undefined>} Promise resolving to the Variable or undefined.
   *
   * @example
   * const variable = await client.getVariable('MyVar', 'flow1');
   */
  async getVariable(variableName: string, integrationFlowId: string): Promise<ComSapHciApiVariables | undefined> {
    const response = await this.api.variablesVariableNameVariableNameIntegrationFlowIntegrationFlowId
      .variablesVariableNameIntegrationFlowList(variableName, integrationFlowId);
    // API returns single object, not wrapped in 'd'
    return response.data as ComSapHciApiVariables | undefined;
  }

  /**
   * Deletes a specific Variable.
   *
   * @param {string} variableName Name of the Variable.
   * @param {string} integrationFlowId ID of the Integration Flow.
   * @returns {Promise<void>} Promise resolving when the Variable is deleted.
   *
   * @example
   * await client.deleteVariable('OldVar', 'flow1');
   */
  async deleteVariable(variableName: string, integrationFlowId: string): Promise<void> {
    await this.api.variablesVariableNameVariableNameIntegrationFlowIntegrationFlowId
      .variablesVariableNameIntegrationFlowDelete(variableName, integrationFlowId);
  }

  /**
   * Downloads the content of a specific Variable.
   *
   * Note: The API spec returns `void`, but the content is expected in the response body.
   * This method returns the raw response data, which might need casting.
   *
   * @param {string} variableName Name of the Variable.
   * @param {string} integrationFlowId ID of the Integration Flow.
   * @returns {Promise<any>} Promise resolving to the Variable content.
   *
   * @example
   * const content = await client.downloadVariableContent('MyVar', 'flow1');
   */
  async downloadVariableContent(variableName: string, integrationFlowId: string): Promise<any> {
    const response = await this.api.variablesVariableNameVariableNameIntegrationFlowIntegrationFlowId
      .valueList(variableName, integrationFlowId);
    // API spec is void, return raw data
    return response.data;
  }

  // Methods will be added here...

}
