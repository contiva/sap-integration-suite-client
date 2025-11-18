/**
 * SAP Partner Directory Client
 * 
 * This file contains a client class for interacting with the 
 * Partner Directory API of SAP Cloud Integration. This API allows management
 * of partner information, parameters, and authorized users in B2B scenarios.
 * 
 * @module sap-integration-suite-client/partner-directory
 */

import { 
  Api as PartnerDirectoryApi,
  ComSapHciApiAlternativePartner,
  ComSapHciApiAlternativePartnerCreate,
  ComSapHciApiAlternativePartnerUpdate,
  ComSapHciApiAuthorizedUser,
  ComSapHciApiAuthorizedUserCreate,
  ComSapHciApiAuthorizedUserUpdate,
  ComSapHciApiBinaryParameter,
  ComSapHciApiBinaryParameterCreate,
  ComSapHciApiBinaryParameterUpdate,
  ComSapHciApiPartner,
  ComSapHciApiStringParameter,
  ComSapHciApiStringParameterCreate,
  ComSapHciApiStringParameterUpdate,
  ComSapHciApiUserCredentialParameter,
  ComSapHciApiUserCredentialParameterCreate,
} from '../types/sap.PartnerDirectory';

import { ResponseNormalizer } from '../utils/response-normalizer';

/**
 * SAP Partner Directory Client
 * 
 * Provides simplified access to the Partner Directory API.
 */
export class PartnerDirectoryClient {
  private api: PartnerDirectoryApi<unknown>;
  private normalizer: ResponseNormalizer;

  /**
   * Creates a new PartnerDirectoryClient
   * 
   * @param {PartnerDirectoryApi<unknown>} api - The underlying API instance
   */
  constructor(api: PartnerDirectoryApi<unknown>) {
    this.api = api;
    this.normalizer = new ResponseNormalizer();
  }

  // --- Alternative Partners Methods ---

  /**
   * Retrieves all alternative partners.
   * 
   * @param {Object} options Optional parameters for the request
   * @param {number} [options.top] Maximum number of entries to return
   * @param {number} [options.skip] Number of entries to skip
   * @param {string} [options.filter] OData filter expression
   * @returns {Promise<ComSapHciApiAlternativePartner[]>} Promise resolving to a list of alternative partners
   * 
   * @example
   * const altPartners = await client.getAlternativePartners({ top: 100 });
   */
  async getAlternativePartners(options: {
    top?: number;
    skip?: number;
    filter?: string;
  } = {}): Promise<ComSapHciApiAlternativePartner[]> {
    const response = await this.api.alternativePartners.alternativePartnersList({
      $top: options.top,
      $skip: options.skip,
      $filter: options.filter,
    });
    return this.normalizer.normalizeArrayResponse(response.data, 'getAlternativePartners');
  }

  /**
   * Retrieves a specific alternative partner by its composite key.
   * 
   * @param {string} hexagency The hexadecimal agency value
   * @param {string} hexscheme The hexadecimal scheme value
   * @param {string} hexid The hexadecimal ID value
   * @returns {Promise<ComSapHciApiAlternativePartner | undefined>} Promise resolving to the alternative partner
   * 
   * @example
   * const altPartner = await client.getAlternativePartnerById('agency', 'scheme', 'id');
   */
  async getAlternativePartnerById(
    hexagency: string,
    hexscheme: string,
    hexid: string
  ): Promise<ComSapHciApiAlternativePartner | undefined> {
    const response = await this.api.alternativePartnersHexagencyHexagencyHexschemeHexschemeHexidHexid
      .alternativePartnersHexagencyHexschemeHexidList(hexagency, hexscheme, hexid);
    return this.normalizer.normalizeEntityResponse(response.data, 'getAlternativePartnerById');
  }

  /**
   * Creates a new alternative partner.
   * 
   * @param {ComSapHciApiAlternativePartnerCreate} partnerData The alternative partner data to create
   * @returns {Promise<ComSapHciApiAlternativePartner>} Promise resolving to the created alternative partner
   * 
   * @example
   * const newPartner = await client.createAlternativePartner({
   *   Agency: 'MyAgency',
   *   Scheme: 'MyScheme',
   *   Id: 'MyId',
   *   Pid: 'PartnerId'
   * });
   */
  async createAlternativePartner(
    partnerData: ComSapHciApiAlternativePartnerCreate
  ): Promise<ComSapHciApiAlternativePartner> {
    const response = await this.api.alternativePartners.alternativePartnersCreate(partnerData);
    return response.data;
  }

  /**
   * Updates an existing alternative partner.
   * 
   * @param {string} hexagency The hexadecimal agency value
   * @param {string} hexscheme The hexadecimal scheme value
   * @param {string} hexid The hexadecimal ID value
   * @param {ComSapHciApiAlternativePartnerUpdate} partnerData The alternative partner data to update
   * @returns {Promise<void>} Promise resolving when the update is complete
   * 
   * @example
   * await client.updateAlternativePartner('agency', 'scheme', 'id', {
   *   Pid: 'NewPartnerId'
   * });
   */
  async updateAlternativePartner(
    hexagency: string,
    hexscheme: string,
    hexid: string,
    partnerData: ComSapHciApiAlternativePartnerUpdate
  ): Promise<void> {
    await this.api.alternativePartnersHexagencyHexagencyHexschemeHexschemeHexidHexid
      .alternativePartnersHexagencyHexschemeHexidUpdate(hexagency, hexscheme, hexid, partnerData);
  }

  /**
   * Deletes an alternative partner.
   * 
   * @param {string} hexagency The hexadecimal agency value
   * @param {string} hexscheme The hexadecimal scheme value
   * @param {string} hexid The hexadecimal ID value
   * @returns {Promise<void>} Promise resolving when the deletion is complete
   * 
   * @example
   * await client.deleteAlternativePartner('agency', 'scheme', 'id');
   */
  async deleteAlternativePartner(
    hexagency: string,
    hexscheme: string,
    hexid: string
  ): Promise<void> {
    await this.api.alternativePartnersHexagencyHexagencyHexschemeHexschemeHexidHexid
      .alternativePartnersHexagencyHexschemeHexidDelete(hexagency, hexscheme, hexid);
  }

  // --- Authorized Users Methods ---

  /**
   * Retrieves all authorized users.
   * 
   * @param {Object} options Optional parameters for the request
   * @param {number} [options.top] Maximum number of entries to return
   * @param {number} [options.skip] Number of entries to skip
   * @param {string} [options.filter] OData filter expression
   * @returns {Promise<ComSapHciApiAuthorizedUser[]>} Promise resolving to a list of authorized users
   * 
   * @example
   * const users = await client.getAuthorizedUsers();
   */
  async getAuthorizedUsers(options: {
    top?: number;
    skip?: number;
    filter?: string;
  } = {}): Promise<ComSapHciApiAuthorizedUser[]> {
    const response = await this.api.authorizedUsers.authorizedUsersList({
      $top: options.top,
      $skip: options.skip,
      $filter: options.filter,
    });
    return this.normalizer.normalizeArrayResponse(response.data, 'getAuthorizedUsers');
  }

  /**
   * Retrieves a specific authorized user by username.
   * 
   * @param {string} user The username
   * @returns {Promise<ComSapHciApiAuthorizedUser | undefined>} Promise resolving to the authorized user
   * 
   * @example
   * const user = await client.getAuthorizedUserById('username');
   */
  async getAuthorizedUserById(
    user: string
  ): Promise<ComSapHciApiAuthorizedUser | undefined> {
    const response = await this.api.authorizedUsersUser.authorizedUsersList(user);
    return this.normalizer.normalizeEntityResponse(response.data, 'getAuthorizedUserById');
  }

  /**
   * Creates a new authorized user.
   * 
   * @param {ComSapHciApiAuthorizedUserCreate} userData The authorized user data to create
   * @returns {Promise<ComSapHciApiAuthorizedUser>} Promise resolving to the created authorized user
   * 
   * @example
   * const newUser = await client.createAuthorizedUser({
   *   User: 'username',
   *   Type: 'User'
   * });
   */
  async createAuthorizedUser(
    userData: ComSapHciApiAuthorizedUserCreate
  ): Promise<ComSapHciApiAuthorizedUser> {
    const response = await this.api.authorizedUsers.authorizedUsersCreate(userData);
    return response.data;
  }

  /**
   * Updates an existing authorized user.
   * 
   * @param {string} user The username
   * @param {ComSapHciApiAuthorizedUserUpdate} userData The authorized user data to update
   * @returns {Promise<void>} Promise resolving when the update is complete
   * 
   * @example
   * await client.updateAuthorizedUser('username', {
   *   Type: 'Administrator'
   * });
   */
  async updateAuthorizedUser(
    user: string,
    userData: ComSapHciApiAuthorizedUserUpdate
  ): Promise<void> {
    await this.api.authorizedUsersUser.authorizedUsersUpdate(user, userData);
  }

  /**
   * Deletes an authorized user.
   * 
   * @param {string} user The username
   * @returns {Promise<void>} Promise resolving when the deletion is complete
   * 
   * @example
   * await client.deleteAuthorizedUser('username');
   */
  async deleteAuthorizedUser(user: string): Promise<void> {
    await this.api.authorizedUsersUser.authorizedUsersDelete(user);
  }

  // --- Partners Methods ---

  /**
   * Retrieves all partners.
   * 
   * @returns {Promise<ComSapHciApiPartner[]>} Promise resolving to a list of partners
   * 
   * @example
   * const partners = await client.getPartners();
   */
  async getPartners(): Promise<ComSapHciApiPartner[]> {
    const response = await this.api.partners.partnersList();
    return this.normalizer.normalizeArrayResponse(response.data, 'getPartners');
  }

  /**
   * Retrieves a specific partner by ID by filtering all partners.
   * 
   * @param {string} pid The partner ID
   * @returns {Promise<ComSapHciApiPartner | undefined>} Promise resolving to the partner
   * 
   * @example
   * const partner = await client.getPartnerById('partner-id');
   */
  async getPartnerById(
    pid: string
  ): Promise<ComSapHciApiPartner | undefined> {
    const response = await this.api.partners.partnersList();
    const partners = this.normalizer.normalizeArrayResponse(response.data, 'getPartnerById');
    return partners.find((p: ComSapHciApiPartner) => p.Pid === pid);
  }

  /**
   * Deletes a partner.
   * 
   * @param {string} pid The partner ID
   * @returns {Promise<void>} Promise resolving when the deletion is complete
   * 
   * @example
   * await client.deletePartner('partner-id');
   */
  async deletePartner(pid: string): Promise<void> {
    await this.api.partnersPid.partnersDelete(pid);
  }

  // --- String Parameters Methods ---

  /**
   * Retrieves all string parameters.
   * 
   * @param {Object} options Optional parameters for the request
   * @param {number} [options.top] Maximum number of entries to return
   * @param {number} [options.skip] Number of entries to skip
   * @param {string} [options.filter] OData filter expression
   * @returns {Promise<ComSapHciApiStringParameter[]>} Promise resolving to a list of string parameters
   * 
   * @example
   * const params = await client.getStringParameters({ filter: "Pid eq 'partner-id'" });
   */
  async getStringParameters(options: {
    top?: number;
    skip?: number;
    filter?: string;
  } = {}): Promise<ComSapHciApiStringParameter[]> {
    const response = await this.api.stringParameters.stringParametersList({
      $top: options.top,
      $skip: options.skip,
      $filter: options.filter,
    });
    return this.normalizer.normalizeArrayResponse(response.data, 'getStringParameters');
  }

  /**
   * Retrieves a specific string parameter.
   * 
   * @param {string} pid The partner ID
   * @param {string} id The parameter ID
   * @returns {Promise<ComSapHciApiStringParameter | undefined>} Promise resolving to the string parameter
   * 
   * @example
   * const param = await client.getStringParameterById('partner-id', 'param-id');
   */
  async getStringParameterById(
    pid: string,
    id: string
  ): Promise<ComSapHciApiStringParameter | undefined> {
    const response = await this.api.stringParametersPidPidIdId.stringParametersPidIdList(pid, id);
    return this.normalizer.normalizeEntityResponse(response.data, 'getStringParameterById');
  }

  /**
   * Creates a new string parameter.
   * 
   * @param {ComSapHciApiStringParameterCreate} paramData The string parameter data to create
   * @returns {Promise<ComSapHciApiStringParameter>} Promise resolving to the created string parameter
   * 
   * @example
   * const newParam = await client.createStringParameter({
   *   Pid: 'partner-id',
   *   Id: 'param-id',
   *   Value: 'param-value'
   * });
   */
  async createStringParameter(
    paramData: ComSapHciApiStringParameterCreate
  ): Promise<ComSapHciApiStringParameter> {
    const response = await this.api.stringParameters.stringParametersCreate(paramData);
    return response.data;
  }

  /**
   * Updates an existing string parameter.
   * 
   * @param {string} pid The partner ID
   * @param {string} id The parameter ID
   * @param {ComSapHciApiStringParameterUpdate} paramData The string parameter data to update
   * @returns {Promise<void>} Promise resolving when the update is complete
   * 
   * @example
   * await client.updateStringParameter('partner-id', 'param-id', {
   *   Value: 'new-value'
   * });
   */
  async updateStringParameter(
    pid: string,
    id: string,
    paramData: ComSapHciApiStringParameterUpdate
  ): Promise<void> {
    await this.api.stringParametersPidPidIdId.stringParametersPidIdUpdate(pid, id, paramData);
  }

  /**
   * Deletes a string parameter.
   * 
   * @param {string} pid The partner ID
   * @param {string} id The parameter ID
   * @returns {Promise<void>} Promise resolving when the deletion is complete
   * 
   * @example
   * await client.deleteStringParameter('partner-id', 'param-id');
   */
  async deleteStringParameter(pid: string, id: string): Promise<void> {
    await this.api.stringParametersPidPidIdId.stringParametersPidIdDelete(pid, id);
  }

  // --- Binary Parameters Methods ---

  /**
   * Retrieves all binary parameters.
   * 
   * @param {Object} options Optional parameters for the request
   * @param {number} [options.top] Maximum number of entries to return
   * @param {number} [options.skip] Number of entries to skip
   * @param {string} [options.filter] OData filter expression
   * @returns {Promise<ComSapHciApiBinaryParameter[]>} Promise resolving to a list of binary parameters
   * 
   * @example
   * const params = await client.getBinaryParameters({ filter: "Pid eq 'partner-id'" });
   */
  async getBinaryParameters(options: {
    top?: number;
    skip?: number;
    filter?: string;
  } = {}): Promise<ComSapHciApiBinaryParameter[]> {
    const response = await this.api.binaryParameters.binaryParametersList({
      $top: options.top,
      $skip: options.skip,
      $filter: options.filter,
    });
    return this.normalizer.normalizeArrayResponse(response.data, 'getBinaryParameters');
  }

  /**
   * Retrieves a specific binary parameter.
   * 
   * @param {string} pid The partner ID
   * @param {string} id The parameter ID
   * @returns {Promise<ComSapHciApiBinaryParameter | undefined>} Promise resolving to the binary parameter
   * 
   * @example
   * const param = await client.getBinaryParameterById('partner-id', 'param-id');
   */
  async getBinaryParameterById(
    pid: string,
    id: string
  ): Promise<ComSapHciApiBinaryParameter | undefined> {
    const response = await this.api.binaryParametersPidPidIdId.binaryParametersPidIdList(pid, id);
    return this.normalizer.normalizeEntityResponse(response.data, 'getBinaryParameterById');
  }

  /**
   * Creates a new binary parameter.
   * 
   * @param {ComSapHciApiBinaryParameterCreate} paramData The binary parameter data to create
   * @returns {Promise<ComSapHciApiBinaryParameter>} Promise resolving to the created binary parameter
   * 
   * @example
   * const newParam = await client.createBinaryParameter({
   *   Pid: 'partner-id',
   *   Id: 'param-id',
   *   ContentType: 'application/octet-stream',
   *   Value: 'base64-encoded-content'
   * });
   */
  async createBinaryParameter(
    paramData: ComSapHciApiBinaryParameterCreate
  ): Promise<ComSapHciApiBinaryParameter> {
    const response = await this.api.binaryParameters.binaryParametersCreate(paramData);
    return response.data;
  }

  /**
   * Updates an existing binary parameter.
   * 
   * @param {string} pid The partner ID
   * @param {string} id The parameter ID
   * @param {ComSapHciApiBinaryParameterUpdate} paramData The binary parameter data to update
   * @returns {Promise<void>} Promise resolving when the update is complete
   * 
   * @example
   * await client.updateBinaryParameter('partner-id', 'param-id', {
   *   Value: 'new-base64-encoded-content'
   * });
   */
  async updateBinaryParameter(
    pid: string,
    id: string,
    paramData: ComSapHciApiBinaryParameterUpdate
  ): Promise<void> {
    await this.api.binaryParametersPidPidIdId.binaryParametersPidIdUpdate(pid, id, paramData);
  }

  /**
   * Deletes a binary parameter.
   * 
   * @param {string} pid The partner ID
   * @param {string} id The parameter ID
   * @returns {Promise<void>} Promise resolving when the deletion is complete
   * 
   * @example
   * await client.deleteBinaryParameter('partner-id', 'param-id');
   */
  async deleteBinaryParameter(pid: string, id: string): Promise<void> {
    await this.api.binaryParametersPidPidIdId.binaryParametersPidIdDelete(pid, id);
  }

  // --- User Credential Parameters Methods ---

  /**
   * Retrieves all user credential parameters.
   * 
   * @param {string} filter OData filter expression (required, e.g., "Pid eq 'partner-id'")
   * @returns {Promise<ComSapHciApiUserCredentialParameter[]>} Promise resolving to a list of user credential parameters
   * 
   * @example
   * const params = await client.getUserCredentialParameters("Pid eq 'partner-id'");
   */
  async getUserCredentialParameters(
    filter: string
  ): Promise<ComSapHciApiUserCredentialParameter[]> {
    const response = await this.api.userCredentialParameters.userCredentialParametersList({
      $filter: filter,
    });
    return this.normalizer.normalizeArrayResponse(response.data, 'getUserCredentialParameters');
  }

  /**
   * Retrieves a specific user credential parameter.
   * 
   * @param {string} pid The partner ID
   * @param {string} id The parameter ID
   * @returns {Promise<ComSapHciApiUserCredentialParameter | undefined>} Promise resolving to the user credential parameter
   * 
   * @example
   * const param = await client.getUserCredentialParameterById('partner-id', 'param-id');
   */
  async getUserCredentialParameterById(
    pid: string,
    id: string
  ): Promise<ComSapHciApiUserCredentialParameter | undefined> {
    const response = await this.api.userCredentialParametersPidPidIdId.userCredentialParametersPidIdList(pid, id, {});
    return this.normalizer.normalizeEntityResponse(response.data, 'getUserCredentialParameterById');
  }

  /**
   * Creates a new user credential parameter.
   * 
   * @param {ComSapHciApiUserCredentialParameterCreate} paramData The user credential parameter data to create
   * @returns {Promise<ComSapHciApiUserCredentialParameter>} Promise resolving to the created user credential parameter
   * 
   * @example
   * const newParam = await client.createUserCredentialParameter({
   *   Pid: 'partner-id',
   *   Id: 'param-id',
   *   User: 'username',
   *   Password: 'password'
   * });
   */
  async createUserCredentialParameter(
    paramData: ComSapHciApiUserCredentialParameterCreate
  ): Promise<ComSapHciApiUserCredentialParameter> {
    const response = await this.api.userCredentialParameters.userCredentialParametersCreate(paramData);
    return response.data;
  }

  /**
   * Deletes a user credential parameter.
   * 
   * @param {string} pid The partner ID
   * @param {string} id The parameter ID
   * @returns {Promise<void>} Promise resolving when the deletion is complete
   * 
   * @example
   * await client.deleteUserCredentialParameter('partner-id', 'param-id');
   */
  async deleteUserCredentialParameter(pid: string, id: string): Promise<void> {
    await this.api.userCredentialParametersPidPidIdId.userCredentialParametersPidIdDelete(pid, id);
  }

  /**
   * Returns the underlying API instance for advanced usage.
   * 
   * @returns {PartnerDirectoryApi<unknown>} The underlying API instance
   */
  getApi(): PartnerDirectoryApi<unknown> {
    return this.api;
  }
}
