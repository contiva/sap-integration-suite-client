/**
 * SAP B2B Scenarios Client
 * 
 * This file contains a client class for interacting with the 
 * B2B Scenarios API of SAP Cloud Integration. This API allows access to 
 * business documents, orphaned interchanges, acknowledgements, and related data
 * in B2B integration scenarios.
 * 
 * @module sap-integration-suite-client/b2b-scenarios
 */

import { 
  Api as B2BScenariosApi,
  ComSapHciApiOrphanedInterchange,
  ComSapHciApiBusinessDocument,
} from '../types/sap.B2BScenarios';

import { ResponseNormalizer } from '../utils/response-normalizer';

/**
 * SAP B2B Scenarios Client
 * 
 * Provides simplified access to the B2B Scenarios API.
 */
export class B2BScenariosClient {
  private api: B2BScenariosApi<unknown>;
  private normalizer: ResponseNormalizer;

  /**
   * Creates a new B2BScenariosClient
   * 
   * @param {B2BScenariosApi<unknown>} api - The underlying API instance
   */
  constructor(api: B2BScenariosApi<unknown>) {
    this.api = api;
    this.normalizer = new ResponseNormalizer();
  }

  // --- Orphaned Interchanges Methods ---

  /**
   * Retrieves all orphaned interchanges.
   * 
   * @param {Object} options Optional parameters for the request
   * @param {number} [options.top] Maximum number of entries to return
   * @param {number} [options.skip] Number of entries to skip
   * @param {string} [options.filter] OData filter expression
   * @returns {Promise<ComSapHciApiOrphanedInterchange[]>} Promise resolving to a list of orphaned interchanges
   * 
   * @example
   * const orphanedInterchanges = await client.getOrphanedInterchanges({ top: 100 });
   */
  async getOrphanedInterchanges(options: {
    top?: number;
    skip?: number;
    filter?: string;
  } = {}): Promise<ComSapHciApiOrphanedInterchange[]> {
    const response = await this.api.orphanedInterchanges.orphanedInterchangesList({
      $top: options.top,
      $skip: options.skip,
      $filter: options.filter,
    });
    return this.normalizer.normalizeArrayResponse(response.data, 'getOrphanedInterchanges');
  }

  /**
   * Retrieves a specific orphaned interchange by ID.
   * 
   * @param {string} id The ID of the orphaned interchange
   * @returns {Promise<ComSapHciApiOrphanedInterchange | undefined>} Promise resolving to the orphaned interchange
   * 
   * @example
   * const orphanedInterchange = await client.getOrphanedInterchangeById('interchange-id');
   */
  async getOrphanedInterchangeById(
    id: string
  ): Promise<ComSapHciApiOrphanedInterchange | undefined> {
    const response = await this.api.orphanedInterchangesId.orphanedInterchangesList(id);
    return this.normalizer.normalizeEntityResponse(response.data, 'getOrphanedInterchangeById');
  }

  // --- Business Documents Methods ---

  /**
   * Retrieves all business documents.
   * 
   * @param {Object} options Optional parameters for the request
   * @param {number} [options.top] Maximum number of entries to return
   * @param {number} [options.skip] Number of entries to skip
   * @param {string} [options.filter] OData filter expression
   * @returns {Promise<ComSapHciApiBusinessDocument[]>} Promise resolving to a list of business documents
   * 
   * @example
   * const documents = await client.getBusinessDocuments({ 
   *   top: 50, 
   *   filter: "ProcessingStatus eq 'FAILED'" 
   * });
   */
  async getBusinessDocuments(options: {
    top?: number;
    skip?: number;
    filter?: string;
  } = {}): Promise<ComSapHciApiBusinessDocument[]> {
    const response = await this.api.businessDocuments.businessDocumentsList({
      $top: options.top,
      $skip: options.skip,
      $filter: options.filter,
    });
    return this.normalizer.normalizeArrayResponse(response.data, 'getBusinessDocuments');
  }

  /**
   * Retrieves a specific business document by ID.
   * 
   * @param {string} id The ID of the business document
   * @returns {Promise<ComSapHciApiBusinessDocument | undefined>} Promise resolving to the business document
   * 
   * @example
   * const document = await client.getBusinessDocumentById('doc-id');
   */
  async getBusinessDocumentById(
    id: string
  ): Promise<ComSapHciApiBusinessDocument | undefined> {
    const response = await this.api.businessDocumentsId.businessDocumentsList(id);
    return this.normalizer.normalizeEntityResponse(response.data, 'getBusinessDocumentById');
  }

  /**
   * Downloads a specific business document payload.
   * 
   * @param {string} payloadId The ID of the payload
   * @returns {Promise<any>} Promise resolving to the payload content
   * 
   * @example
   * const payloadContent = await client.getBusinessDocumentPayloadContent('payload-id');
   */
  async getBusinessDocumentPayloadContent(payloadId: string): Promise<any> {
    const response = await this.api.businessDocumentPayloadsId.valueList(payloadId);
    return response.data;
  }

  /**
   * Downloads a specific technical acknowledgement payload.
   * 
   * @param {string} ackId The ID of the technical acknowledgement
   * @returns {Promise<any>} Promise resolving to the acknowledgement content
   * 
   * @example
   * const ackContent = await client.getTechnicalAcknowledgementContent('ack-id');
   */
  async getTechnicalAcknowledgementContent(ackId: string): Promise<any> {
    const response = await this.api.technicalAcknowledgementsId.valueList(ackId);
    return response.data;
  }

  /**
   * Downloads a specific functional acknowledgement payload.
   * 
   * @param {string} ackId The ID of the functional acknowledgement
   * @returns {Promise<any>} Promise resolving to the acknowledgement content
   * 
   * @example
   * const ackContent = await client.getFunctionalAcknowledgementContent('ack-id');
   */
  async getFunctionalAcknowledgementContent(ackId: string): Promise<any> {
    const response = await this.api.functionalAcknowledgementsId.valueList(ackId);
    return response.data;
  }

  /**
   * Returns the underlying API instance for advanced usage.
   * 
   * @returns {B2BScenariosApi<unknown>} The underlying API instance
   */
  getApi(): B2BScenariosApi<unknown> {
    return this.api;
  }
}
