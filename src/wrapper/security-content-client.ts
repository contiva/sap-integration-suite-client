/**
 * SAP Security Content Client
 * 
 * This file contains a client class for interacting with the 
 * Security Content API of SAP Cloud Integration. This API allows management of 
 * security artifacts like User Credentials, OAuth2 Credentials, Keystores 
 * (Certificates, Key Pairs), Secure Parameters, Certificate-to-User Mappings, 
 * and Access Policies.
 * 
 * @module sap-integration-suite-client/security-content
 */

import { 
  Api as SecurityContentApi,
  ComSapHciApiUserCredential,
  ComSapHciApiUserCredentialCreate,
  ComSapHciApiUserCredentialUpdate,
  ComSapHciApiSecureParameter,
  ComSapHciApiSecureParameterCreate,
  ComSapHciApiSecureParameterUpdate,
  ComSapHciApiOAuth2ClientCredential,
  ComSapHciApiOAuth2ClientCredentialCreate,
  ComSapHciApiOAuth2ClientCredentialUpdate,
  ComSapHciApiKeystoreEntry,
  ComSapHciApiKeystoreEntryImported,
  ComSapHciApiKeystoreEntryRename,
  ComSapHciApiKeyPairGenerationRequestCreate,
  ComSapHciApiRSAKeyGenerationRequestCreate,
  ComSapHciApiSSHKeyGenerationRequestCreate,
  ComSapHciApiSSHKeyGenerationRequestCreateResponse,
  ComSapHciApiChainCertificate,
  ComSapHciApiKeystoreResourceCreate,
  ComSapHciApiHistoryKeystoreEntry,
  ComSapHciApiCertificateUserMapping,
  ComSapHciApiCertificateUserMappingCreate,
  ComSapHciApiAccessPolicy,
  ComSapHciApiAccessPolicyCreate,
  ComSapHciApiArtifactReference,
  ComSapHciApiArtifactReferenceCreatesep,
  // Add other necessary types as methods are implemented
} from '../types/sap.SecurityContent';

import { ResponseNormalizer } from '../utils/response-normalizer';

/**
 * SAP Security Content Client
 * 
 * Provides simplified access to the Security Content API.
 */
export class SecurityContentClient {
  private api: SecurityContentApi<unknown>;
  private normalizer: ResponseNormalizer;

  /**
   * Creates a new SecurityContentClient
   * 
   * @param {SecurityContentApi<unknown>} api - The underlying API instance
   */
  constructor(api: SecurityContentApi<unknown>) {
    this.api = api;
    this.normalizer = new ResponseNormalizer();
  }

  // --- User Credential Methods ---

  /**
   * Retrieves all deployed user credentials.
   *
   * @returns {Promise<ComSapHciApiUserCredential[]>} Promise resolving to a list of user credentials.
   *
   * @example
   * const credentials = await client.getUserCredentials();
   */
  async getUserCredentials(): Promise<ComSapHciApiUserCredential[]> {
    const response = await this.api.userCredentials.userCredentialsList();
    return this.normalizer.normalizeArrayResponse(response.data, 'getUserCredentials');
  }

  /**
   * Adds new user credentials.
   *
   * @param {ComSapHciApiUserCredentialCreate} credentialData Data for the new user credential.
   * @returns {Promise<void>} Promise resolving when the credential is created.
   *
   * @example
   * await client.createUserCredential({
   *   Name: 'MySFTPCreds',
   *   Kind: 'default', // or 'successfactors', 'openconnectors'
   *   User: 'sftpUser',
   *   Password: 'sftpPassword'
   * });
   */
  async createUserCredential(credentialData: ComSapHciApiUserCredentialCreate): Promise<void> {
    await this.api.userCredentials.userCredentialsCreate(credentialData);
  }

  /**
   * Retrieves a specific user credential by its name.
   *
   * @param {string} name The name of the user credential.
   * @returns {Promise<ComSapHciApiUserCredential | undefined>} Promise resolving to the credential or undefined.
   *
   * @example
   * const cred = await client.getUserCredentialByName('MySFTPCreds');
   */
  async getUserCredentialByName(name: string): Promise<ComSapHciApiUserCredential | undefined> {
    const response = await this.api.userCredentialsName.userCredentialsList(name);
    return this.normalizer.normalizeEntityResponse(response.data, 'getUserCredentialByName');
  }

  /**
   * Updates an existing user credential.
   *
   * @param {string} name The name of the credential to update.
   * @param {ComSapHciApiUserCredentialUpdate} credentialData Updated data for the credential.
   * @returns {Promise<void>} Promise resolving when the credential is updated.
   *
   * @example
   * await client.updateUserCredential('MySFTPCreds', { Password: 'newPassword' });
   */
  async updateUserCredential(name: string, credentialData: ComSapHciApiUserCredentialUpdate): Promise<void> {
    await this.api.userCredentialsName.userCredentialsUpdate(name, credentialData);
  }

  /**
   * Deletes a user credential.
   *
   * @param {string} name The name of the credential to delete.
   * @returns {Promise<void>} Promise resolving when the credential is deleted.
   *
   * @example
   * await client.deleteUserCredential('OldCreds');
   */
  async deleteUserCredential(name: string): Promise<void> {
    await this.api.userCredentialsName.userCredentialsDelete(name);
  }

  // --- Secure Parameter Methods (Neo only) ---

  /**
   * Retrieves all deployed secure parameters (values are not returned).
   * Note: This resource is only available in the Neo environment.
   *
   * @returns {Promise<ComSapHciApiSecureParameter[]>} Promise resolving to a list of secure parameters.
   *
   * @example
   * const params = await client.getSecureParameters();
   */
  async getSecureParameters(): Promise<ComSapHciApiSecureParameter[]> {
    try {
      const response = await this.api.secureParameters.secureParametersList();
      return this.normalizer.normalizeArrayResponse(response.data, 'getSecureParameters');
    } catch (error) {
      // Handle potential 404 if API doesn't exist in CF
      if ((error as any)?.statusCode === 404) {
        console.warn('SecureParameters API might not be available in this environment (Cloud Foundry?). Returning empty array.');
        return [];
      }
      throw error; // Re-throw other errors
    }
  }

  /**
   * Adds a new secure parameter.
   * Note: This resource is only available in the Neo environment.
   *
   * @param {ComSapHciApiSecureParameterCreate} parameterData Data for the new secure parameter.
   * @returns {Promise<void>} Promise resolving when the parameter is created.
   *
   * @example
   * await client.createSecureParameter({ Name: 'MyApiKey', SecureParam: 'secretValue' });
   */
  async createSecureParameter(parameterData: ComSapHciApiSecureParameterCreate): Promise<void> {
    await this.api.secureParameters.secureParametersCreate(parameterData);
  }

  /**
   * Retrieves a specific secure parameter by its name (value is not returned).
   * Note: This resource is only available in the Neo environment.
   *
   * @param {string} name The name of the secure parameter.
   * @returns {Promise<ComSapHciApiSecureParameter | undefined>} Promise resolving to the parameter or undefined.
   *
   * @example
   * const param = await client.getSecureParameterByName('MyApiKey');
   */
  async getSecureParameterByName(name: string): Promise<ComSapHciApiSecureParameter | undefined> {
    try {
      const response = await this.api.secureParametersName.secureParametersList(name);
      return this.normalizer.normalizeEntityResponse(response.data, 'getSecureParameterByName');
    } catch (error) {
      if ((error as any)?.statusCode === 404) {
        return undefined; // Not found is a valid case
      }
      throw error;
    }
  }

  /**
   * Updates an existing secure parameter.
   * Note: This resource is only available in the Neo environment.
   *
   * @param {string} name The name of the parameter to update.
   * @param {ComSapHciApiSecureParameterUpdate} parameterData Updated data (can include Name, Description, SecureParam).
   * @returns {Promise<void>} Promise resolving when the parameter is updated.
   *
   * @example
   * await client.updateSecureParameter('MyApiKey', { SecureParam: 'newSecretValue' });
   */
  async updateSecureParameter(name: string, parameterData: ComSapHciApiSecureParameterUpdate): Promise<void> {
    await this.api.secureParametersName.secureParametersUpdate(name, parameterData);
  }

  /**
   * Deletes a secure parameter.
   * Note: This resource is only available in the Neo environment.
   *
   * @param {string} name The name of the parameter to delete.
   * @returns {Promise<void>} Promise resolving when the parameter is deleted.
   *
   * @example
   * await client.deleteSecureParameter('OldApiKey');
   */
  async deleteSecureParameter(name: string): Promise<void> {
    await this.api.secureParametersName.secureParametersDelete(name);
  }

  // --- OAuth2 Client Credential Methods ---

  /**
   * Retrieves all OAuth2 client credentials.
   *
   * @param {boolean} [expandCustomParameters=false] If true, expands custom parameters associated with the credentials.
   * @returns {Promise<ComSapHciApiOAuth2ClientCredential[]>} Promise resolving to a list of OAuth2 credentials.
   *
   * @example
   * const oauthCreds = await client.getOAuth2ClientCredentials();
   * const oauthCredsWithParams = await client.getOAuth2ClientCredentials(true);
   */
  async getOAuth2ClientCredentials(expandCustomParameters = false): Promise<ComSapHciApiOAuth2ClientCredential[]> {
    const response = await this.api.oAuth2ClientCredentials.oAuth2ClientCredentialsList({
      $expand: expandCustomParameters ? ['CustomParameters'] : undefined,
    });
    return this.normalizer.normalizeArrayResponse(response.data, 'getOAuth2ClientCredentials');
  }

  /**
   * Adds new OAuth2 client credentials.
   *
   * @param {ComSapHciApiOAuth2ClientCredentialCreate} credentialData Data for the new OAuth2 credential.
   * @returns {Promise<void>} Promise resolving when the credential is created.
   *
   * @example
   * await client.createOAuth2ClientCredential({
   *   Name: 'MyOAuthApp',
   *   TokenServiceUrl: 'https://example.com/oauth/token',
   *   ClientId: 'client-id',
   *   ClientSecret: 'client-secret'
   * });
   */
  async createOAuth2ClientCredential(credentialData: ComSapHciApiOAuth2ClientCredentialCreate): Promise<void> {
    await this.api.oAuth2ClientCredentials.oAuth2ClientCredentialsCreate(credentialData);
  }

  /**
   * Retrieves a specific OAuth2 client credential by its name.
   *
   * @param {string} name The name of the OAuth2 credential.
   * @param {boolean} [expandCustomParameters=false] If true, expands custom parameters.
   * @returns {Promise<ComSapHciApiOAuth2ClientCredential | undefined>} Promise resolving to the credential or undefined.
   *
   * @example
   * const cred = await client.getOAuth2ClientCredentialByName('MyOAuthApp');
   */
  async getOAuth2ClientCredentialByName(name: string, expandCustomParameters = false): Promise<ComSapHciApiOAuth2ClientCredential | undefined> {
    const response = await this.api.oAuth2ClientCredentialsName.oAuth2ClientCredentialsList(name, {
      $expand: expandCustomParameters ? ['CustomParameters'] : undefined,
    });
    return this.normalizer.normalizeEntityResponse(response.data, 'getOAuth2ClientCredentialByName');
  }

  /**
   * Updates an existing OAuth2 client credential.
   *
   * @param {string} name The name of the credential to update.
   * @param {ComSapHciApiOAuth2ClientCredentialUpdate} credentialData Updated data.
   * @returns {Promise<void>} Promise resolving when the credential is updated.
   *
   * @example
   * await client.updateOAuth2ClientCredential('MyOAuthApp', { ClientSecret: 'new-secret' });
   */
  async updateOAuth2ClientCredential(name: string, credentialData: ComSapHciApiOAuth2ClientCredentialUpdate): Promise<void> {
    await this.api.oAuth2ClientCredentialsName.oAuth2ClientCredentialsUpdate(name, credentialData);
  }

  /**
   * Deletes an OAuth2 client credential.
   *
   * @param {string} name The name of the credential to delete.
   * @returns {Promise<void>} Promise resolving when the credential is deleted.
   *
   * @example
   * await client.deleteOAuth2ClientCredential('OldOAuthApp');
   */
  async deleteOAuth2ClientCredential(name: string): Promise<void> {
    await this.api.oAuth2ClientCredentialsName.oAuth2ClientCredentialsDelete(name);
  }

  // --- Keystore Management Methods ---

  /**
   * Retrieves properties (like size) and optionally entries for a specified keystore.
   *
   * @param {('system' | 'backup_admin_system')} keystoreName Name of the keystore.
   * @param {boolean} [expandEntries=false] If true, includes the list of entries in the response.
   * @param {('Entries' | 'LastModifiedBy' | 'LastModifiedTime' | 'Size')[]} [select] Properties to select.
   * @returns {Promise<any>} Promise resolving to the keystore properties (structure varies based on select/expand).
   *
   * @example
   * const systemKeystoreInfo = await client.getKeystoreProperties('system');
   * console.log('System Keystore Size:', systemKeystoreInfo?.Size);
   *
   * @example
   * // Get keystore with entries expanded
   * const systemKeystoreWithEntries = await client.getKeystoreProperties('system', true);
   */
  async getKeystoreProperties(
    keystoreName: 'system' | 'backup_admin_system',
    expandEntries = false,
    select?: ('Entries' | 'LastModifiedBy' | 'LastModifiedTime' | 'Size')[]
  ): Promise<any> {
    const response = await this.api.keystoresKeystoreName.keystoresList([keystoreName], {
      $expand: expandEntries ? ['Entries'] : undefined,
      $select: select
    });
    // Response structure can vary based on expand/select, return the 'd' object.
    return response.data?.d;
  }

  /**
   * Retrieves the number of entries in a specified keystore.
   *
   * @param {('system' | 'KeyRenewal')} keystoreName Name of the keystore.
   * @returns {Promise<number>} Promise resolving to the number of entries.
   *
   * @example
   * const systemSize = await client.getKeystoreSize('system');
   */
  async getKeystoreSize(keystoreName: 'system' | 'KeyRenewal'): Promise<number> {
    const response = await this.api.keystoresKeystoreName.sizeValueList([keystoreName]);
    // API returns count as plain string
    const countString = response.data as unknown as string;
    return parseInt(countString || '0', 10);
  }

  /**
   * Imports entries from a JKS or JCEKS keystore file into the system keystore.
   *
   * @param {File} keystoreFile Keystore file (JKS/JCEKS format).
   * @param {string} password Password for the keystore file.
   * @param {('replace' | 'merge' | 'overwrite')} [importOption='overwrite'] How to handle existing entries.
   * @param {boolean} [returnKeystoreEntries=true] If true, returns the import status for each entry.
   * @returns {Promise<ComSapHciApiKeystoreEntryImported[] | undefined>} Promise resolving to the list of imported entries with status, if requested.
   *
   * @example
   * // Assuming 'file' is a File object from an input element
   * // const file = document.getElementById('keystoreInput').files[0];
   * // await client.importKeystore(file, 'keystorePassword', 'merge');
   */
  async importKeystore(
    keystoreFile: File,
    password: string,
    importOption: 'replace' | 'merge' | 'overwrite' = 'overwrite',
    returnKeystoreEntries = true
  ): Promise<ComSapHciApiKeystoreEntryImported[] | undefined> {
    const keystoreData: ComSapHciApiKeystoreResourceCreate = {
      Name: 'system', // Target keystore is always 'system' for import
      Resource: keystoreFile,
      Password: password
    };
    const response = await this.api.keystoreResources.keystoreResourcesCreate(keystoreData, {
      importOption: [importOption],
      returnKeystoreEntries: [returnKeystoreEntries]
    });
    return response.data?.d?.results;
  }

  /**
   * Backs up tenant administrator-owned entries from the system keystore to the backup keystore.
   * This overwrites the previous backup.
   *
   * @returns {Promise<void>} Promise resolving when the backup is complete.
   *
   * @example
   * await client.backupKeystore();
   */
  async backupKeystore(): Promise<void> {
    // API uses POST with Name='backup_admin_system', no body/options needed for backup itself.
    const backupData: ComSapHciApiKeystoreResourceCreate = { Name: 'backup_admin_system' };
    await this.api.keystoreResources.keystoreResourcesCreate(backupData, { 
        // Ensure no import options are sent for backup
        returnKeystoreEntries: [false] // Don't need entries returned for backup
    }); 
  }

  /**
   * Exports the public content of a keystore (system or backup).
   *
   * Note: API returns `void`, the content is in the response body (JKS format).
   *
   * @param {('system' | 'backup_admin_system')} keystoreName Name of the keystore to export.
   * @returns {Promise<any>} Promise resolving to the exported keystore content (JKS).
   *
   * @example
   * const exportedKeystore = await client.exportKeystore('system');
   * // Process exportedKeystore (e.g., save as file)
   */
  async exportKeystore(_keystoreName: 'system' | 'backup_admin_system'): Promise<any> {
    // This endpoint is GET /KeystoreResources('{KeystoreName}')/$value
    // Need to manually construct the path as the generated client doesn't expose $value directly here.
    // This is a limitation of the current generator setup. 
    // A workaround would involve using the base HTTP client directly.
    // For now, this method cannot be implemented correctly with the generated client.
    console.error('exportKeystore cannot be reliably implemented with the current generated client due to missing $value endpoint access for KeystoreResources.');
    throw new Error('Export Keystore functionality not available via generated client.');
    // Potential workaround (untested, requires direct HTTP access):
    // const response = await (this.api as any).httpClient.request({
    //   path: `/KeystoreResources('${keystoreName}')/$value`,
    //   method: 'GET',
    //   secure: true,
    //   format: 'blob' // Or appropriate format for binary data
    // });
    // return response.data;
  }

  /**
   * Restores tenant administrator-owned entries from the backup keystore to the system keystore.
   *
   * @param {('replace' | 'overwrite')} [importOption='overwrite'] How to handle existing entries in the system keystore.
   * @param {boolean} [returnKeystoreEntries=true] If true, returns the restore status for each entry.
   * @returns {Promise<ComSapHciApiKeystoreEntryImported[] | undefined>} Promise resolving to the list of restored entries with status, if requested.
   *
   * @example
   * await client.restoreKeystoreBackup('overwrite');
   */
  async restoreKeystoreBackup(
    importOption: 'replace' | 'overwrite' = 'overwrite',
    returnKeystoreEntries = true
  ): Promise<ComSapHciApiKeystoreEntryImported[] | undefined> {
    // API uses PUT on /KeystoreResources('system') with query param retrieveBackup=backup_admin_system
    const dummyBody = {}; // Body seems required but not used for restore
    const response = await this.api.keystoreResourcesSystem.keystoreResourcesSystemUpdate(
      dummyBody as any, // Cast needed as type expects KeystoreEntryAliasMassdelete
      {
        retrieveBackup: ['backup_admin_system'], // Pass as array to match type "backup_admin_system"[]
        importOption: [importOption],
        returnKeystoreEntries: [returnKeystoreEntries]
      }
    );
    return response.data?.d?.results;
  }

  /**
   * Deletes multiple specified entries (owned by tenant administrator) from the system keystore.
   *
   * @param {string[]} aliasesToDelete List of aliases to delete.
   * @param {boolean} [returnKeystoreEntries=false] If true, returns the deletion status for each entry.
   * @returns {Promise<ComSapHciApiKeystoreEntryImported[] | undefined>} Promise resolving to the list of entries with status, if requested.
   *
   * @example
   * await client.deleteKeystoreEntries(['alias1', 'alias2']);
   */
  async deleteKeystoreEntries(
    aliasesToDelete: string[],
    returnKeystoreEntries = false
  ): Promise<ComSapHciApiKeystoreEntryImported[] | undefined> {
     // API uses PUT on /KeystoreResources('system') with query param deleteEntries=true and body containing aliases
     const deleteBody = { Aliases: aliasesToDelete.join(';') };
     const response = await this.api.keystoreResourcesSystem.keystoreResourcesSystemUpdate(
       deleteBody,
       {
         deleteEntries: ['true'],
         returnKeystoreEntries: [returnKeystoreEntries]
       }
     );
     return response.data?.d?.results;
  }

  // --- Keystore History Methods ---
  /**
   * Retrieves entries from the history keystore.
   *
   * @param {('Alias' | 'Hexalias' | 'KeyType' | 'LastModifiedBy' | 'LastModifiedTime' | 'Owner' | 'Validity')[]} [select] Properties to select.
   * @returns {Promise<ComSapHciApiHistoryKeystoreEntry[]>} Promise resolving to a list of history entries.
   *
   * @example
   * const history = await client.getKeystoreHistoryEntries();
   */
  async getKeystoreHistoryEntries(
    select?: ('Alias' | 'Hexalias' | 'KeyType' | 'LastModifiedBy' | 'LastModifiedTime' | 'Owner' | 'Validity')[]
  ): Promise<ComSapHciApiHistoryKeystoreEntry[]> {
    const response = await this.api.historyKeystoreEntries.historyKeystoreEntriesList({ $select: select });
    return this.normalizer.normalizeArrayResponse(response.data, 'getKeystoreHistoryEntries');
  }

  /**
   * Retrieves a specific entry from the history keystore by its hex-encoded alias.
   *
   * @param {string} hexAlias Hex-encoded alias of the history entry.
   * @param {('Alias' | 'KeyType' | 'LastModifiedBy' | 'LastModifiedTime' | 'Owner' | 'Validity')[]} [select] Properties to select.
   * @returns {Promise<ComSapHciApiHistoryKeystoreEntry | undefined>} Promise resolving to the history entry or undefined.
   *
   * @example
   * const historyEntry = await client.getKeystoreHistoryEntry('historyHexAlias');
   */
  async getKeystoreHistoryEntry(
    hexAlias: string,
    select?: ('Alias' | 'KeyType' | 'LastModifiedBy' | 'LastModifiedTime' | 'Owner' | 'Validity')[]
  ): Promise<ComSapHciApiHistoryKeystoreEntry | undefined> {
    const response = await this.api.historyKeystoreEntriesHexalias.historyKeystoreEntriesList(hexAlias, { $select: select });
    return this.normalizer.normalizeEntityResponse(response.data, 'getKeystoreHistoryEntry');
  }

  /**
   * Restores an entry from the history keystore to the renewal keystore.
   *
   * @param {string} hexAlias Hex-encoded alias of the history entry to restore.
   * @param {string} [destinationAlias] Optional new alias for the entry in the renewal keystore. If empty, defaults to '[number]_original_alias'.
   * @returns {Promise<void>} Promise resolving when the entry is restored.
   *
   * @example
   * await client.restoreHistoryKeystoreEntry('historyHexAlias', 'restoredAlias');
   */
  async restoreHistoryKeystoreEntry(hexAlias: string, destinationAlias?: string): Promise<void> {
    // API uses PUT with copy=true query param
    const dummyBody: ComSapHciApiKeystoreEntryRename = { Status: 'Restoring' }; 
    await this.api.historyKeystoreEntriesHexalias.historyKeystoreEntriesUpdate(
      hexAlias,
      {
        destinationAlias: destinationAlias,
        copy: [true] // Must be true for restore
      },
      dummyBody
    );
  }

  // --- Certificate-to-User Mapping Methods (Neo only) ---

  /**
   * Retrieves all certificate-to-user mappings.
   * Note: This resource is only available in the Neo environment.
   *
   * @param {object} [options] Optional parameters for filtering, sorting, and selection.
   * @param {string} [options.filter] OData filter string (only `User eq 'username'` supported).
   * @param {('Id' | 'Id desc' | 'User' | 'User desc' | 'Certificate' | 'Certificate desc' | 'CreatedBy' | 'CreatedBy desc' | 'CreatedTime' | 'CreatedTime desc' | 'LastModifiedBy' | 'LastModifiedBy desc' | 'LastModifiedTime' | 'LastModifiedTime desc' | 'ValidUntil')[]} [options.orderby] Sorting order.
   * @param {('Id' | 'User' | 'Certificate' | 'LastModifiedBy' | 'LastModifiedTime' | 'CreatedBy' | 'CreatedTime' | 'ValidUntil')[]} [options.select] Properties to select.
   * @returns {Promise<ComSapHciApiCertificateUserMapping[]>} Promise resolving to a list of mappings.
   *
   * @example
   * const allMappings = await client.getCertificateUserMappings();
   * const userMappings = await client.getCertificateUserMappings({ filter: "User eq 'myuser'" });
   */
  async getCertificateUserMappings(options: {
    filter?: string;
    orderby?: ('Id' | 'Id desc' | 'User' | 'User desc' | 'Certificate' | 'Certificate desc' | 'CreatedBy' | 'CreatedBy desc' | 'CreatedTime' | 'CreatedTime desc' | 'LastModifiedBy' | 'LastModifiedBy desc' | 'LastModifiedTime' | 'LastModifiedTime desc' | 'ValidUntil')[];
    select?: ('Id' | 'User' | 'Certificate' | 'LastModifiedBy' | 'LastModifiedTime' | 'CreatedBy' | 'CreatedTime' | 'ValidUntil')[];
  } = {}): Promise<ComSapHciApiCertificateUserMapping[]> {
    try {
      const response = await this.api.certificateUserMappings.certificateUserMappingsList({
        $filter: options.filter,
        $orderby: options.orderby,
        $select: options.select,
      });
      return this.normalizer.normalizeArrayResponse(response.data, 'getCertificateUserMappings');
    } catch (error) {
      if ((error as any)?.statusCode === 404) {
        console.warn('CertificateUserMappings API might not be available in this environment (Cloud Foundry?). Returning empty array.');
        return [];
      }
      throw error;
    }
  }

  /**
   * Adds a new certificate-to-user mapping.
   * Note: This resource is only available in the Neo environment.
   *
   * @param {ComSapHciApiCertificateUserMappingCreate} mappingData Data for the new mapping (User, Certificate content).
   * @returns {Promise<ComSapHciApiCertificateUserMapping | undefined>} Promise resolving to the created mapping.
   *
   * @example
   * // Assuming 'certFile' is a File object
   * // const newMapping = await client.createCertificateUserMapping({ User: 'newUser', Certificate: certFile });
   */
  async createCertificateUserMapping(mappingData: ComSapHciApiCertificateUserMappingCreate): Promise<ComSapHciApiCertificateUserMapping | undefined> {
    const response = await this.api.certificateUserMappings.certificateUserMappingsCreate(mappingData);
    return this.normalizer.normalizeEntityResponse(response.data, 'createCertificateUserMapping');
  }

  /**
   * Retrieves a specific certificate-to-user mapping by its ID.
   * Note: This resource is only available in the Neo environment.
   *
   * @param {string} id The ID of the mapping.
   * @param {('User' | 'Certificate' | 'LastModifiedBy' | 'LastModifiedTime' | 'CreatedBy' | 'CreatedTime')[]} [select] Properties to select.
   * @returns {Promise<ComSapHciApiCertificateUserMapping | undefined>} Promise resolving to the mapping or undefined.
   *
   * @example
   * const mapping = await client.getCertificateUserMappingById('mapping-id...');
   */
  async getCertificateUserMappingById(
    id: string,
    select?: ('User' | 'Certificate' | 'LastModifiedBy' | 'LastModifiedTime' | 'CreatedBy' | 'CreatedTime')[]
  ): Promise<ComSapHciApiCertificateUserMapping | undefined> {
    try {
      const response = await this.api.certificateUserMappingsId.certificateUserMappingsList(id, { $select: select });
      return this.normalizer.normalizeEntityResponse(response.data, 'getCertificateUserMappingById');
    } catch (error) {
      if ((error as any)?.statusCode === 404) {
        return undefined;
      }
      throw error;
    }
  }

  /**
   * Deletes a certificate-to-user mapping.
   * Note: This resource is only available in the Neo environment.
   *
   * @param {string} id The ID of the mapping to delete.
   * @returns {Promise<void>} Promise resolving when the mapping is deleted.
   *
   * @example
   * await client.deleteCertificateUserMapping('mapping-id-to-delete');
   */
  async deleteCertificateUserMapping(id: string): Promise<void> {
    await this.api.certificateUserMappingsId.certificateUserMappingsDelete(id);
  }

  // --- Access Policy & Artifact Reference Methods ---

  /**
   * Retrieves all Access Policies.
   *
   * @param {object} [options] Optional parameters for filtering, pagination, sorting, selection, and expansion.
   * @param {number} [options.top] Maximum number of policies to retrieve.
   * @param {number} [options.skip] Number of policies to skip.
   * @param {string} [options.filter] OData filter string (e.g., "RoleName eq 'Policy1'").
   * @param {('Id' | 'Id desc' | 'RoleName' | 'RoleName desc')[]} [options.orderby] Sorting order.
   * @param {('Id' | 'RoleName' | 'Description')[]} [options.select] Properties to select.
   * @param {boolean} [options.expandArtifactReferences=false] If true, expands the associated ArtifactReferences.
   * @param {boolean} [options.inlinecount=false] If true, includes the total count.
   * @returns {Promise<{ policies: ComSapHciApiAccessPolicy[], count?: number }>} Promise resolving to the policies and optional count.
   *
   * @example
   * const { policies } = await client.getAccessPolicies({ expandArtifactReferences: true });
   */
  async getAccessPolicies(options: {
    top?: number;
    skip?: number;
    filter?: string;
    orderby?: ('Id' | 'Id desc' | 'RoleName' | 'RoleName desc')[];
    select?: ('Id' | 'RoleName' | 'Description')[];
    expandArtifactReferences?: boolean;
    inlinecount?: boolean;
  } = {}): Promise<{ policies: ComSapHciApiAccessPolicy[], count?: number }> {
    const response = await this.api.accessPolicies.accessPoliciesList({
      $top: options.top,
      $skip: options.skip,
      $filter: options.filter,
      $orderby: options.orderby,
      $select: options.select,
      $expand: options.expandArtifactReferences ? ['ArtifactReferences'] : undefined,
      $inlinecount: options.inlinecount ? ['allpages'] : undefined,
    });
    
    const policies = this.normalizer.normalizeArrayResponse(response.data, 'getAccessPolicies');
    const countString = (response.data?.d as any)?.__count;
    const count = countString ? parseInt(countString, 10) : undefined;
    return { policies, count };
  }

  /**
   * Adds a new Access Policy, optionally with initial Artifact References.
   *
   * @param {ComSapHciApiAccessPolicyCreate} policyData Data for the new policy, including RoleName and optionally ArtifactReferences.
   * @returns {Promise<void>} Promise resolving when the policy is created.
   *
   * @example
   * await client.createAccessPolicy({
   *   RoleName: 'FlowExecutors',
   *   Description: 'Can execute specific flows',
   *   ArtifactReferences: [
   *     { Name: 'AllowFlow1', Type: 'INTEGRATION_FLOW', ConditionAttribute: 'Name', ConditionValue: 'Flow1', ConditionType: 'exactString' }
   *   ]
   * });
   */
  async createAccessPolicy(policyData: ComSapHciApiAccessPolicyCreate): Promise<void> {
    await this.api.accessPolicies.accessPoliciesCreate(policyData);
  }

  /**
   * Deletes an Access Policy by its ID.
   *
   * @param {string} policyId The ID of the policy to delete.
   * @returns {Promise<void>} Promise resolving when the policy is deleted.
   *
   * @example
   * await client.deleteAccessPolicy('policy-id-123');
   */
  async deleteAccessPolicy(policyId: string): Promise<void> {
    await this.api.accessPoliciesId.accessPoliciesDelete(policyId);
  }

  /**
   * Updates an Access Policy (only PATCH is supported by the API).
   * Note: This method currently only triggers the PATCH request without specific update data,
   * as the generated client doesn't directly support PATCH bodies. 
   * A custom request might be needed for actual updates.
   *
   * @param {string} policyId The ID of the policy to update.
   * @returns {Promise<void>}
   *
   * @example
   * // Note: Actual update might require custom implementation
   * await client.updateAccessPolicy('policy-id-123'); 
   */
  async updateAccessPolicy(policyId: string): Promise<void> {
    // Generated client uses PATCH but doesn't accept a body easily.
    // For actual updates (e.g., changing Description), a custom request might be needed.
    console.warn('updateAccessPolicy currently performs a PATCH request without data. Actual updates may require custom implementation.');
    await this.api.accessPoliciesId.accessPoliciesPartialUpdate(policyId);
  }

  /**
   * Retrieves all Artifact References.
   *
   * @param {object} [options] Optional parameters for filtering, pagination, sorting, and selection.
   * @param {number} [options.top] Maximum number of references to retrieve.
   * @param {number} [options.skip] Number of references to skip.
   * @param {string} [options.filter] OData filter string (e.g., "Id eq 'ref1'").
   * @param {('Id' | 'Id desc' | 'Name' | 'Name desc')[]} [options.orderby] Sorting order.
   * @param {('Id' | 'Name' | 'Description' | 'Type' | 'ConditionAttribute' | 'ConditionValue' | 'ConditionType')[]} [options.select] Properties to select.
   * @param {boolean} [options.inlinecount=false] If true, includes the total count.
   * @returns {Promise<{ references: ComSapHciApiArtifactReference[], count?: number }>} Promise resolving to the references and optional count.
   *
   * @example
   * const { references } = await client.getArtifactReferences();
   */
  async getArtifactReferences(options: {
    top?: number;
    skip?: number;
    filter?: string;
    orderby?: ('Id' | 'Id desc' | 'Name' | 'Name desc')[];
    select?: ('Id' | 'Name' | 'Description' | 'Type' | 'ConditionAttribute' | 'ConditionValue' | 'ConditionType')[];
    inlinecount?: boolean;
  } = {}): Promise<{ references: ComSapHciApiArtifactReference[], count?: number }> {
    const response = await this.api.artifactReferences.artifactReferencesList({
      $top: options.top,
      $skip: options.skip,
      $filter: options.filter,
      $orderby: options.orderby,
      $select: options.select,
      $inlinecount: options.inlinecount ? ['allpages'] : undefined,
    });
    
    const references = this.normalizer.normalizeArrayResponse(response.data, 'getArtifactReferences');
    const countString = (response.data?.d as any)?.__count;
    const count = countString ? parseInt(countString, 10) : undefined;
    return { references, count };
  }

  /**
   * Adds a new Artifact Reference to an existing Access Policy.
   *
   * @param {string} policyId The ID of the Access Policy to add the reference to.
   * @param {Omit<ComSapHciApiArtifactReferenceCreatesep, 'AcessPolicy'>} referenceData Data for the new artifact reference.
   * @returns {Promise<void>} Promise resolving when the reference is created.
   *
   * @example
   * await client.createArtifactReference('policy-id-123', {
   *   Name: 'AllowFlow2', Type: 'INTEGRATION_FLOW', ConditionAttribute: 'Name', ConditionValue: 'Flow2', ConditionType: 'exactString'
   * });
   */
  async createArtifactReference(policyId: string, referenceData: Omit<ComSapHciApiArtifactReferenceCreatesep, 'AcessPolicy'>): Promise<void> {
    // The API uses a specific type `ComSapHciApiArtifactReferenceCreatesep` which includes
    // an `AcessPolicy` property (note the typo). We need to construct this.
    const apiData: ComSapHciApiArtifactReferenceCreatesep = {
      ...referenceData,
      AcessPolicy: { Id: policyId } // Link to the policy using the typo 'AcessPolicy'
    };
    await this.api.artifactReferences.artifactReferencesCreate(apiData);
  }

  /**
   * Deletes an Artifact Reference by its ID.
   *
   * @param {string} referenceId The ID of the artifact reference to delete.
   * @returns {Promise<void>} Promise resolving when the reference is deleted.
   *
   * @example
   * await client.deleteArtifactReference('ref-id-456');
   */
  async deleteArtifactReference(referenceId: string): Promise<void> {
    await this.api.artifactReferencesId.artifactReferencesDelete(referenceId);
  }

  /**
   * Retrieves entries from a specified keystore.
   *
   * @param {('system' | 'backup_admin_system' | 'KeyRenewal')} keystoreName Name of the keystore.
   * @param {('Alias' | 'Hexalias' | 'KeyType' | 'LastModifiedBy' | 'LastModifiedTime' | 'Owner' | 'Status' | 'Type' | 'Validity')[]} [select] Properties to select.
   * @returns {Promise<ComSapHciApiKeystoreEntry[]>} Promise resolving to a list of keystore entries.
   *
   * @example
   * const entries = await client.getKeystoreEntries('system');
   */
  async getKeystoreEntries(
    keystoreName: 'system' | 'backup_admin_system' | 'KeyRenewal',
    select?: ('Alias' | 'Hexalias' | 'KeyType' | 'LastModifiedBy' | 'LastModifiedTime' | 'Owner' | 'Status' | 'Type' | 'Validity')[]
  ): Promise<ComSapHciApiKeystoreEntry[]> {
    const response = await this.api.keystoreEntries.keystoreEntriesList({ 
      keystoreName: [keystoreName], 
      $select: select 
    });
    return this.normalizer.normalizeArrayResponse(response.data, 'getKeystoreEntries');
  }

  /**
   * Retrieves a specific keystore entry by its hex-encoded alias.
   *
   * @param {string} hexAlias Hex-encoded alias of the entry.
   * @param {('system' | 'backup_admin_system' | 'KeyRenewal')} [keystoreName='system'] The name of the keystore.
   * @param {('Alias' | 'KeyType' | 'LastModifiedBy' | 'LastModifiedTime' | 'Owner' | 'Status' | 'Type' | 'Validity')[]} [select] Properties to select.
   * @returns {Promise<ComSapHciApiKeystoreEntry | undefined>} Promise resolving to the entry or undefined.
   *
   * @example
   * const entry = await client.getKeystoreEntry('hex...');
   */
  async getKeystoreEntry(
    hexAlias: string,
    keystoreName: 'system' | 'backup_admin_system' | 'KeyRenewal' = 'system',
    select?: ('Alias' | 'KeyType' | 'LastModifiedBy' | 'LastModifiedTime' | 'Owner' | 'Status' | 'Type' | 'Validity')[]
  ): Promise<ComSapHciApiKeystoreEntry | undefined> {
    const response = await this.api.keystoreEntriesHexalias.keystoreEntriesList(hexAlias, { 
      keystoreName: [keystoreName], 
      $select: select 
    });
    return this.normalizer.normalizeEntityResponse(response.data, 'getKeystoreEntry');
  }

  // --- Key Pair Generation Methods ---

  /**
   * Generates a new key pair (RSA or ECC).
   *
   * @param {ComSapHciApiKeyPairGenerationRequestCreate} keyPairData Details for key pair generation.
   * @param {boolean} [returnKeystoreEntries=false] Return updated keystore entries in response.
   * @returns {Promise<{ keyPairInfo?: any, entries?: ComSapHciApiKeystoreEntry[] }>} Promise with generated key pair info and optionally the entry list.
   *
   * @example
   * const { keyPairInfo } = await client.generateKeyPair({
   *   Alias: 'myNewKeyPair',
   *   KeyType: 'RSA',
   *   KeySize: 2048,
   *   SignatureAlgorithm: 'SHA256/RSA',
   *   CommonName: 'My Common Name'
   *   // ... other DN components
   * });
   */
  async generateKeyPair(
    keyPairData: ComSapHciApiKeyPairGenerationRequestCreate,
    returnKeystoreEntries = false
  ): Promise<{ keyPairInfo?: any, entries?: ComSapHciApiKeystoreEntry[] }> {
    const response = await this.api.keyPairGenerationRequests.keyPairGenerationRequestsCreate(
      { returnKeystoreEntries: [returnKeystoreEntries] },
      keyPairData
    );
    // Add explicit type annotation, noting the base type might differ from create type
    // Using 'any' as the exact response structure for KeyPairGenerationRequest isn't explicitly defined.
    const keyPairInfo: any | undefined = response.data?.d; 
    // Actual entries might be nested differently or require re-fetching.
    const entries: ComSapHciApiKeystoreEntry[] | undefined = (response.data?.d as any)?.Entries?.results;
    return { keyPairInfo, entries };
  }

  /**
   * Generates an RSA key pair from an existing private key file (PKCS#1 PEM format).
   *
   * @param {ComSapHciApiRSAKeyGenerationRequestCreate} rsaData Details including Alias, RSAFile (base64 encoded private key), SignatureAlgorithm, and DN components.
   * @param {boolean} [returnKeystoreEntries=false] Return updated keystore entries in response.
   * @returns {Promise<{ keyPairInfo?: any, entries?: ComSapHciApiKeystoreEntry[] }>} Promise with generated key pair info and optionally the entry list.
   *
   * @example
   * const { keyPairInfo } = await client.generateRsaKeyPair({
   *   Alias: 'myImportedRsaKey',
   *   RSAFile: 'base64PrivateKeyContent',
   *   SignatureAlgorithm: 'SHA256/RSA',
   *   CommonName: 'Imported Key'
   * });
   */
  async generateRsaKeyPair(
    rsaData: ComSapHciApiRSAKeyGenerationRequestCreate,
    returnKeystoreEntries = false
  ): Promise<{ keyPairInfo?: any, entries?: ComSapHciApiKeystoreEntry[] }> {
    const response = await this.api.rsaKeyGenerationRequests.rsaKeyGenerationRequestsCreate(
      { returnKeystoreEntries: [returnKeystoreEntries] },
      rsaData
    );
    // Using 'any' as the exact response structure for KeyPairGenerationRequest isn't explicitly defined.
    const keyPairInfo: any | undefined = response.data?.d; // Explicit annotation
    const entries: ComSapHciApiKeystoreEntry[] | undefined = (response.data?.d as any)?.Entries?.results;
    return { keyPairInfo, entries };
  }

  /**
   * Generates an SSH private key pair from an OpenSSH (RSA, DSA, EC) or PuTTY (RSA, DSA) file.
   * Alias will be id_rsa, id_dsa, or id_ec based on algorithm.
   *
   * @param {ComSapHciApiSSHKeyGenerationRequestCreate} sshData Details including SSHFile (key content), optional Password, and DN components.
   * @param {boolean} [update=false] Update existing SSH key pair.
   * @param {boolean} [returnKeystoreEntries=false] Return updated keystore entries in response.
   * @returns {Promise<{ responseInfo?: ComSapHciApiSSHKeyGenerationRequestCreateResponse, entries?: ComSapHciApiKeystoreEntry[] }>} Promise with response info (containing Alias) and optionally the entry list.
   *
   * @example
   * const { responseInfo } = await client.generateSshKeyPair({
   *   SSHFile: 'ssh-rsa AAAAB3NzaC1yc2.... user@host',
   *   CommonName: 'My SSH Key'
   * }, false);
   * console.log('Generated SSH Key Alias:', responseInfo?.Alias);
   */
  async generateSshKeyPair(
    sshData: ComSapHciApiSSHKeyGenerationRequestCreate,
    update = false,
    returnKeystoreEntries = false
  ): Promise<{ responseInfo?: ComSapHciApiSSHKeyGenerationRequestCreateResponse, entries?: ComSapHciApiKeystoreEntry[] }> {
    const response = await this.api.sshKeyGenerationRequests.sshKeyGenerationRequestsCreate(
      { 
        update: [update],
        returnKeystoreEntries: [returnKeystoreEntries] 
      },
      sshData
    );
    // const responseInfo = response.data?.d;
    const responseInfo: ComSapHciApiSSHKeyGenerationRequestCreateResponse | undefined = response.data?.d; // Explicit annotation
    const entries: ComSapHciApiKeystoreEntry[] | undefined = (response.data?.d as any)?.Entries?.results; // Adjust if structure differs
    return { responseInfo, entries };
  }

  /**
   * Retrieves a certificate chain.
   *
   * @param {string} hexAlias Hex-encoded alias of the key pair.
   * @param {('system' | 'backup_admin_system' | 'KeyRenewal' | 'KeyHistory')} [keystoreName='system'] Keystore name.
   * @param {('Alias' | 'KeyType' | 'LastModifiedBy' | 'LastModifiedTime' | 'Owner' | 'Validity')[]} [select] Properties to select.
   * @returns {Promise<ComSapHciApiChainCertificate[]>} Promise resolving to the list of chain certificates.
   *
   * @example
   * const chainCertificates = await client.getCertificateChain('hex...');
   */
  async getCertificateChain(
    hexAlias: string,
    keystoreName: 'system' | 'backup_admin_system' | 'KeyRenewal' | 'KeyHistory' = 'system',
    select?: ('Alias' | 'KeyType' | 'LastModifiedBy' | 'LastModifiedTime' | 'Owner' | 'Validity')[]
  ): Promise<ComSapHciApiChainCertificate[]> {
    const response = await this.api.keystoreEntriesHexalias.chainCertificatesList(hexAlias, { 
      keystoreName: [keystoreName],
      $select: select 
    });
    return this.normalizer.normalizeArrayResponse(response.data, 'getCertificateChain');
  }
}
