/**
 * SAP Cloud Platform Integration API Client
 * 
 * This module provides a client for interacting with the SAP Cloud Platform Integration API.
 * It handles authentication, request management, and provides type-safe access to all SAP API endpoints.
 * 
 * @module sap-integration-suite-client
 * @packageDocumentation
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { config } from 'dotenv';
import { Api as IntegrationContentApi } from '../types/sap.IntegrationContent';
import { Api as LogFilesApi } from '../types/sap.LogFiles';
import { Api as MessageProcessingLogsApi } from '../types/sap.MessageProcessingLogs';
import { Api as MessageStoreApi } from '../types/sap.MessageStore';
import { Api as SecurityContentApi } from '../types/sap.SecurityContent';
import qs from 'querystring';
import { IntegrationContentClient } from '../wrapper/integration-content-client';
import { IntegrationContentAdvancedClient } from '../wrapper/custom/integration-content-advanced-client';
import { MessageProcessingLogsClient } from '../wrapper/message-processing-logs-client';
import { LogFilesClient } from '../wrapper/log-files-client';
import { MessageStoreClient } from '../wrapper/message-store-client';
import { SecurityContentClient } from '../wrapper/security-content-client';
import { CustomClientRegistry, CustomClientType } from '../wrapper/custom/custom-client-registry';
import { BaseCustomClient, CustomClientFactory } from '../wrapper/custom/base-custom-client';

// Load environment variables from .env file
config();

/**
 * OAuth token interface representing the token structure returned by SAP OAuth service
 * 
 * @interface OAuthToken
 */
interface OAuthToken {
  /** The access token string */
  access_token: string;
  /** Token type, typically "Bearer" */
  token_type: string;
  /** Token expiration time in seconds */
  expires_in: number;
  /** Calculated timestamp when the token expires (added by the client) */
  expiresAt?: number;
}

/**
 * Configuration interface for SapClient
 * 
 * @interface SapClientConfig
 * @example
 * // Create a client with explicit configuration
 * const client = new SapClient({
 *   baseUrl: 'https://my-tenant.sap-api.com/api/v1',
 *   oauthClientId: 'my-client-id',
 *   oauthClientSecret: 'my-client-secret',
 *   oauthTokenUrl: 'https://my-tenant.authentication.sap.hana.ondemand.com/oauth/token'
 * });
 */
export interface SapClientConfig {
  /** 
   * Base URL of the SAP API (e.g. https://tenant.sap-api.com/api/v1)
   * If not provided, the SAP_BASE_URL environment variable will be used
   */
  baseUrl?: string;
  /** 
   * OAuth client ID for authentication
   * If not provided, the SAP_OAUTH_CLIENT_ID environment variable will be used
   */
  oauthClientId?: string;
  /** 
   * OAuth client secret for authentication
   * If not provided, the SAP_OAUTH_CLIENT_SECRET environment variable will be used
   */
  oauthClientSecret?: string;
  /** 
   * OAuth token URL for retrieving tokens
   * If not provided, the SAP_OAUTH_TOKEN_URL environment variable will be used
   */
  oauthTokenUrl?: string;
  /**
   * Enable response format normalization
   * If true, the client will attempt to normalize different SAP API response formats
   * Default: true
   */
  normalizeResponses?: boolean;
  /**
   * Maximum number of retries for failed requests
   * Default: 0 (no retries)
   */
  maxRetries?: number;
  /**
   * Delay between retries in milliseconds
   * Default: 1000 (1 second)
   */
  retryDelay?: number;
  /**
   * Aktiviere oder deaktiviere benutzerdefinierte Client-Erweiterungen
   * Default: true
   */
  enableCustomClients?: boolean;
}

/**
 * Main SAP Client class that provides access to all SAP API endpoints
 * 
 * This client handles:
 * - Authentication via OAuth 2.0 client credentials flow
 * - Token management (expiration and renewal)
 * - CSRF token handling for write operations
 * - Type-safe API access through generated API clients
 * - Error handling
 * - Response format normalization
 * 
 * @example
 * // Basic usage with environment variables
 * import SapClient from 'sap-integration-suite-client';
 * const client = new SapClient();
 * 
 * // With explicit configuration
 * const client = new SapClient({
 *   baseUrl: 'https://tenant.sap-api.com/api/v1',
 *   oauthClientId: 'client-id',
 *   oauthClientSecret: 'client-secret',
 *   oauthTokenUrl: 'https://tenant.authentication.sap.hana.ondemand.com/oauth/token'
 * });
 * 
 * // Making API calls
 * async function getPackages() {
 *   const response = await client.integrationContent.integrationPackages.integrationPackagesList();
 *   return response.data;
 * }
 */
class SapClient {
  /** Axios instance used for HTTP requests */
  private axiosInstance: AxiosInstance;
  /** Base URL of the SAP API */
  private baseUrl: string;
  /** CSRF token for write operations */
  private csrfToken: string | null = null;
  /** OAuth token with expiration information */
  private oauthToken: OAuthToken | null = null;
  /** OAuth client ID */
  private oauthClientId: string;
  /** OAuth client secret */
  private oauthClientSecret: string;
  /** OAuth token URL */
  private oauthTokenUrl: string;
  /** Whether to normalize API responses */
  private normalizeResponses: boolean = true;
  /** Maximum number of retries for failed requests */
  private maxRetries: number = 3;
  /** Delay between retries in milliseconds */
  private retryDelay: number = 1000;
  /** Whether to enable custom client extensions */
  private enableCustomClients: boolean = true;
  /** Registry für benutzerdefinierte Client-Erweiterungen */
  private customClientRegistry: CustomClientRegistry;
  /** Map der erstellten benutzerdefinierten Clients */
  private customClients: Map<string, BaseCustomClient<any>> = new Map();
  
  /** 
   * Integration Content API client
   * Provides access to integration packages, artifacts, and related operations
   */
  public integrationContent: IntegrationContentClient;
  
  /**
   * Integration Content Advanced API client
   * Provides extended functionality for integration content operations
   */
  public integrationContentAdvanced!: IntegrationContentAdvancedClient;
  
  
  /** 
   * Log Files API client
   * Access system logs and log archives
   */
  public logFiles: LogFilesClient;
  /** 
   * Message Processing Logs API client
   * Access and query message processing logs
   */
  public messageProcessingLogs: MessageProcessingLogsClient;
  /** 
   * Message Store API client
   * Access stored messages and attachments
   */
  public messageStore: MessageStoreClient;
  /** 
   * Security Content API client
   * Manage security artifacts like credentials and certificates
   */
  public securityContent: SecurityContentClient;

  /**
   * Creates a new SAP Client instance
   * 
   * @param {SapClientConfig} [config] - Configuration options for the client
   * @throws {Error} If required configuration is missing
   * 
   * @example
   * // Using environment variables
   * const client = new SapClient();
   * 
   * @example
   * // Using explicit configuration
   * const client = new SapClient({
   *   baseUrl: 'https://tenant.sap-api.com/api/v1',
   *   oauthClientId: 'client-id',
   *   oauthClientSecret: 'client-secret',
   *   oauthTokenUrl: 'https://tenant.authentication.sap.hana.ondemand.com/oauth/token'
   * });
   */
  constructor(config?: SapClientConfig) {
    // Load configuration with priority: passed config > environment variables > empty string
    this.baseUrl = config?.baseUrl || process.env.SAP_BASE_URL || '';
    
    // Ensure the base URL includes the API path '/api/v1'
    if (this.baseUrl && !this.baseUrl.endsWith('/api/v1') && !this.baseUrl.includes('/api/v1/')) {
      // Remove trailing slash if present
      this.baseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
      // Add /api/v1
      this.baseUrl += '/api/v1';
    }
    
    this.oauthClientId = config?.oauthClientId || process.env.SAP_OAUTH_CLIENT_ID || '';
    this.oauthClientSecret = config?.oauthClientSecret || process.env.SAP_OAUTH_CLIENT_SECRET || '';
    this.oauthTokenUrl = config?.oauthTokenUrl || process.env.SAP_OAUTH_TOKEN_URL || '';
    this.normalizeResponses = config?.normalizeResponses !== undefined ? config.normalizeResponses : true;
    this.maxRetries = config?.maxRetries || 0;
    this.retryDelay = config?.retryDelay || 1000;
    this.enableCustomClients = config?.enableCustomClients !== undefined ? config.enableCustomClients : true;
    this.customClientRegistry = CustomClientRegistry.getInstance();
    
    // Enable debug mode if environment variable is set
    const debugMode = process.env.DEBUG === 'true';
    if (debugMode) {
      console.debug('[SapClient] Initializing with config:', {
        baseUrl: this.baseUrl,
        normalizeResponses: this.normalizeResponses,
        maxRetries: this.maxRetries,
        retryDelay: this.retryDelay
      });
    }
    
    // Validate required configuration
    this.validateConfig();

    // Create axios instance without auth (auth will be added via interceptor)
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to add OAuth token to every request
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        // Get or refresh OAuth token
        const token = await this.getOAuthToken();
        config.headers.Authorization = `Bearer ${token.access_token}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to normalize response format if enabled
    if (this.normalizeResponses) {
      this.axiosInstance.interceptors.response.use(
        (response) => {
          // Normalize response data format
          if (response.data) {
            const originalData = JSON.stringify(response.data).substring(0, 100);
            response.data = this.normalizeResponseFormat(response.data);
            
            // Extended debug logging to track what's happening with the normalization
            if (process.env.DEBUG === 'true') {
              const normalizedData = JSON.stringify(response.data).substring(0, 100);
              console.debug(
                `[SapClient] Response normalized for ${response.config.method?.toUpperCase()} ${response.config.url}`,
                `\nBefore: ${originalData}${originalData.length >= 100 ? '...' : ''}`,
                `\nAfter: ${normalizedData}${normalizedData.length >= 100 ? '...' : ''}`
              );
            }
          }
          return response;
        },
        (error) => {
          return Promise.reject(this.enhanceError(error));
        }
      );
    }
    
    // Add response interceptor to handle token expiration (401 Unauthorized)
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Check if error is due to invalid token (401) and this request hasn't been retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          console.debug('Token expired or invalid, attempting to refresh...');
          
          // Mark request as retried to prevent infinite loops
          originalRequest._retry = true;
          
          // Invalidate current token
          this.oauthToken = null;
          
          try {
            // Get a fresh token
            const token = await this.getOAuthToken();
            
            // Update the Authorization header with the new token
            originalRequest.headers.Authorization = `Bearer ${token.access_token}`;
            
            // Retry the original request with the new token
            return this.axiosInstance(originalRequest);
          } catch (tokenError) {
            // If token refresh also fails, reject with the token error
            return Promise.reject(this.enhanceError(tokenError, 'Failed to refresh token after 401 Unauthorized'));
          }
        }
        
        // For other errors, just reject with the original error
        return Promise.reject(error);
      }
    );

    // Initialize API clients
    const integrationContentApiClient = new IntegrationContentApi({
      baseUrl: this.baseUrl,
      customFetch: this.customFetch.bind(this),
    });
    this.integrationContent = new IntegrationContentClient(integrationContentApiClient);
    
    const logFilesApi = new LogFilesApi({
      baseUrl: this.baseUrl,
      customFetch: this.customFetch.bind(this),
    });
    this.logFiles = new LogFilesClient(logFilesApi);
    
    const messageProcessingLogsApi = new MessageProcessingLogsApi({
      baseUrl: this.baseUrl,
      customFetch: this.customFetch.bind(this),
    });
    this.messageProcessingLogs = new MessageProcessingLogsClient(messageProcessingLogsApi);
    
    const messageStoreApi = new MessageStoreApi({
      baseUrl: this.baseUrl,
      customFetch: this.customFetch.bind(this),
    });
    this.messageStore = new MessageStoreClient(messageStoreApi);
    
    const securityContentApi = new SecurityContentApi({
      baseUrl: this.baseUrl,
      customFetch: this.customFetch.bind(this),
    });
    this.securityContent = new SecurityContentClient(securityContentApi);
    
    // Custom Clients initialisieren
    if (this.enableCustomClients) {
      this.initializeCustomClients();
    } else {
      // Legacy-Initialisierung für Kompatibilität, wenn Custom-Clients deaktiviert sind
      this.integrationContentAdvanced = new IntegrationContentAdvancedClient(this.integrationContent);
      // MessageProcessingLogsAdvancedClient wird on-demand erstellt, wenn er benötigt wird
    }
  }
  
  /**
   * Validates that the required configuration is provided
   * 
   * @private
   * @throws {Error} If baseUrl is missing
   * @throws {Error} If any OAuth configuration is incomplete
   */
  private validateConfig() {
    if (!this.baseUrl) {
      throw new Error('Base URL is required. Provide it via constructor parameter (baseUrl) or SAP_BASE_URL environment variable.');
    }

    if (!this.oauthClientId || !this.oauthClientSecret || !this.oauthTokenUrl) {
      const missing = [];
      if (!this.oauthClientId) missing.push('oauthClientId / SAP_OAUTH_CLIENT_ID');
      if (!this.oauthClientSecret) missing.push('oauthClientSecret / SAP_OAUTH_CLIENT_SECRET');
      if (!this.oauthTokenUrl) missing.push('oauthTokenUrl / SAP_OAUTH_TOKEN_URL');
      
      throw new Error(`OAuth configuration is incomplete. Missing: ${missing.join(', ')}. Provide these via constructor parameters or environment variables.`);
    }
  }

  /**
   * Gets or refreshes the OAuth token
   * - Returns existing token if it's still valid
   * - Fetches a new token if the current one is expired or doesn't exist
   * - Adds expiration timestamp to the token
   * 
   * @private
   * @returns {Promise<OAuthToken>} Promise resolving to the OAuth token
   * @throws {Error} If token cannot be obtained
   */
  private async getOAuthToken(): Promise<OAuthToken> {
    const now = Date.now();

    // If we already have a token and it's not expired, return it
    // We add a 1-minute buffer before expiration to be safe
    if (this.oauthToken && this.oauthToken.expiresAt && this.oauthToken.expiresAt > now + 60000) {
      return this.oauthToken;
    }

    // Otherwise, get a new token
    try {
      // Use params like in the direct implementation instead of basic auth
      const tokenResponse = await axios.post(
        this.oauthTokenUrl,
        null,
        {
          params: {
            grant_type: 'client_credentials',
            client_id: this.oauthClientId,
            client_secret: this.oauthClientSecret
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        }
      );

      const token: OAuthToken = tokenResponse.data;
      // Set expiration time (subtract 5 minutes for safety margin)
      token.expiresAt = now + (token.expires_in * 1000) - 300000;
      
      this.oauthToken = token;
      
      return token;
    } catch (error) {
      throw this.enhanceError(error, 'Failed to obtain OAuth token');
    }
  }

  /**
   * Normalizes different SAP API response formats into a consistent structure
   * 
   * @private
   * @param {any} data - The response data to normalize
   * @returns {any} Normalized response data
   */
  private normalizeResponseFormat(data: any): any {
    if (!data) return data;

    // Create a debug info object to help with troubleshooting
    const debugInfo: any = { 
      originalType: typeof data,
      isArray: Array.isArray(data),
      topLevelKeys: typeof data === 'object' ? Object.keys(data) : []
    };

    // Handle array responses (already normalized)
    if (Array.isArray(data)) {
      if (process.env.DEBUG === 'true') {
        console.debug('[SapClient] Format detected: Already array', 
          `(length: ${data.length})`);
      }
      return data;
    }

    // Handle OData v2 format (d.results)
    if (data.d && Array.isArray(data.d.results)) {
      if (process.env.DEBUG === 'true') {
        console.debug('[SapClient] Format detected: OData v2 (d.results)', 
          `(length: ${data.d.results.length})`);
      }
      return data.d.results;
    }

    // Handle OData v2 format where d is directly the object (not an array)
    if (data.d && typeof data.d === 'object' && !Array.isArray(data.d) && !data.d.results) {
      if (process.env.DEBUG === 'true') {
        console.debug('[SapClient] Format detected: OData v2 (d as object)',
          `(keys: ${Object.keys(data.d).join(', ')})`);
      }
      return data.d;
    }

    // Handle OData v4 format (value array)
    if (data.value && Array.isArray(data.value)) {
      if (process.env.DEBUG === 'true') {
        console.debug('[SapClient] Format detected: OData v4 (value array)',
          `(length: ${data.value.length})`);
      }
      return data.value;
    }

    // Handle IntegrationPackages format
    if (data.IntegrationPackages && Array.isArray(data.IntegrationPackages)) {
      if (process.env.DEBUG === 'true') {
        console.debug('[SapClient] Format detected: IntegrationPackages array',
          `(length: ${data.IntegrationPackages.length})`);
      }
      return data.IntegrationPackages;
    }

    // Handle results property directly (some APIs return { results: [...] })
    if (data.results && Array.isArray(data.results)) {
      if (process.env.DEBUG === 'true') {
        console.debug('[SapClient] Format detected: Direct results array',
          `(length: ${data.results.length})`);
      }
      return data.results;
    }

    // Handle specific nested formats that may contain arrays
    if (data.d && data.d.__next && data.d.results) {
      if (process.env.DEBUG === 'true') {
        console.debug('[SapClient] Format detected: OData with __next link',
          `(length: ${data.d.results.length})`);
      }
      return data.d.results; // OData with __next link
    }
  
    // If the data is an object and has only one property that is an array, return that array
    const keys = Object.keys(data);
    if (keys.length === 1 && Array.isArray(data[keys[0]])) {
      if (process.env.DEBUG === 'true') {
        console.debug('[SapClient] Format detected: Single property array',
          `(property: ${keys[0]}, length: ${data[keys[0]].length})`);
      }
      return data[keys[0]];
    }

    // Special handling for OData queries with $count that return a string
    if (typeof data === 'string' && !isNaN(parseInt(data, 10))) {
      if (process.env.DEBUG === 'true') {
        console.debug('[SapClient] Format detected: Count string value', `(value: ${data})`);
      }
      return data; // Keep the string for count operations
    }

    // If we can't normalize, return the original data
    if (process.env.DEBUG === 'true') {
      console.debug('[SapClient] No normalization applied, returning original data',
        `(type: ${typeof data}, keys: ${typeof data === 'object' ? Object.keys(data).join(', ') : 'n/a'})`);
    }
    return data;
  }

  /**
   * Enhances error objects with more detailed information
   * 
   * @private
   * @param {any} error - The error object
   * @param {string} [message] - Optional message to prefix the error
   * @returns {any} Enhanced error object
   */
  private enhanceError(error: any, message?: string): any {
    // Create a new error with a more descriptive message
    const enhancedError = new Error(
      message 
        ? `${message}: ${error.message}`
        : error.message
    );

    // Copy all properties from the original error
    Object.assign(enhancedError, error);

    // Add additional helpful properties if they exist
    if (error.response) {
      (enhancedError as any).statusCode = error.response.status;
      (enhancedError as any).statusText = error.response.statusText;
      (enhancedError as any).responseData = error.response.data;
      
      // Special handling for OData error details
      const odataError = error.response.data?.error || 
                         error.response.data?.['odata.error'] ||
                         (error.response.data?.d && error.response.data.d.error);
                         
      if (odataError) {
        (enhancedError as any).odataError = true;
        
        // Extract common OData error properties
        const errorCode = odataError.code || odataError.Code;
        const errorMessage = odataError.message || odataError.Message;
        const details = odataError.details || odataError.Details || odataError.innererror;
        
        // Add extracted properties to the error
        if (errorCode) (enhancedError as any).errorCode = errorCode;
        if (errorMessage) {
          // OData can include message as an object with 'value' property or directly as string
          if (typeof errorMessage === 'object' && errorMessage.value) {
            (enhancedError as any).errorMessage = errorMessage.value;
          } else {
            (enhancedError as any).errorMessage = errorMessage;
          }
        }
        if (details) (enhancedError as any).errorDetails = details;
        
        // Add a formatted message that includes OData error details
        enhancedError.message = `${enhancedError.message} (OData Error: ${
          (enhancedError as any).errorCode || 'Unknown Code'}: ${
          (enhancedError as any).errorMessage || 'No message provided'})`;
      }
    }

    return enhancedError;
  }

  /**
   * Performs an HTTP request with retry logic for transient errors
   * 
   * @private
   * @param {Function} requestFn - Function that performs the request
   * @param {number} retries - Number of retries left
   * @returns {Promise<any>} Promise resolving to the response
   */
  private async requestWithRetry(requestFn: () => Promise<any>, retries: number = this.maxRetries): Promise<any> {
    try {
      return await requestFn();
    } catch (error: any) {
      // Only retry if we have retries left and it's a retryable error
      const isRetryable = 
        error.response && 
        (error.response.status >= 500 || // Server errors
         error.response.status === 429);  // Rate limiting

      if (retries > 0 && isRetryable) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        // Retry with one less retry attempt
        return this.requestWithRetry(requestFn, retries - 1);
      }
      
      // If we can't retry, re-throw the error
      throw error;
    }
  }

  /**
   * Custom fetch implementation that uses axios to make HTTP requests
   * - Handles CSRF token for write operations
   * - Adds OAuth token to requests
   * - Transforms axios responses to fetch API Response objects
   * - Implements retry logic
   * - Normalizes response formats
   * 
   * @private
   * @param {string | URL | Request} input - URL or Request object
   * @param {RequestInit} [init] - Request initialization options
   * @returns {Promise<Response>} Promise resolving to a Response object
   * @throws {Error} If the request fails
   */
  private async customFetch(input: string | URL | Request, init?: RequestInit): Promise<Response> {
    try {
      // For any operation that might need a CSRF token
      if (init?.method && ['POST', 'PUT', 'DELETE'].includes(init.method)) {
        await this.ensureCsrfToken();
        if (init.headers && this.csrfToken) {
          (init.headers as Record<string, string>)['X-CSRF-Token'] = this.csrfToken;
        }
      }

      const url = typeof input === 'string' 
        ? input 
        : input instanceof URL 
          ? input.toString() 
          : input.url;
      
      const method = init?.method || 'GET';
      const headers = init?.headers as Record<string, string>;
      const body = init?.body ? JSON.parse(init.body.toString()) : undefined;

      // Get OAuth token and add it to headers
      const token = await this.getOAuthToken();
      if (!token) {
        throw new Error('Failed to get OAuth token');
      }
      
      const authHeaders = {
        ...headers,
        'Authorization': `Bearer ${token.access_token}`
      };

      // Use retry logic for the request
      const response = await this.requestWithRetry(() => 
        this.axiosInstance.request({
          url,
          method,
          headers: authHeaders,
          data: body,
        })
      );

      // Normalize response if enabled and not already normalized by interceptor
      if (this.normalizeResponses && response.data) {
        const originalData = response.data;
        response.data = this.normalizeResponseFormat(response.data);
        
        // Debug log for normalization result
        if (process.env.DEBUG === 'true') {
          const isChanged = JSON.stringify(originalData) !== JSON.stringify(response.data);
          console.debug(
            `[SapClient] customFetch: ${isChanged ? 'Response format normalized' : 'No normalization applied'} for ${method} ${url}`,
            isChanged ? 
              `\nFormat detected: ${Array.isArray(response.data) ? 
                `Array with ${response.data.length} items` : 
                typeof response.data === 'object' ? 
                  `Object with keys [${Object.keys(response.data).join(', ')}]` : 
                  `${typeof response.data}`}` :
              ''
          );
        }
      }

      // Convert axios response to fetch Response
      return new Response(JSON.stringify(response.data), {
        status: response.status,
        statusText: response.statusText,
        headers: new Headers(response.headers as Record<string, string>),
      });
    } catch (error: any) {
      const requestMethod = init?.method || 'GET';
      const requestUrl = typeof input === 'string' 
        ? input 
        : input instanceof URL 
          ? input.toString() 
          : input.url;
      throw this.enhanceError(error, `Request failed: ${requestMethod} ${requestUrl}`);
    }
  }

  /**
   * Ensures a CSRF token is available for write operations
   * - Fetches a new token if one doesn't exist
   * - Uses OAuth token for authentication
   * 
   * @private
   * @returns {Promise<void>}
   * @throws {Error} If the CSRF token cannot be fetched
   */
  private async ensureCsrfToken(): Promise<void> {
    if (!this.csrfToken) {
      try {
        // Get OAuth token first
        const token = await this.getOAuthToken();
        
        // Extract base URL without /api/v1 for CSRF token request
        const baseUrlWithoutApiPath = this.baseUrl.replace(/\/api\/v1\/?$/, '');
        
        const response = await axios.get(`${baseUrlWithoutApiPath}/`, {
          headers: {
            'X-CSRF-Token': 'Fetch',
            'Authorization': `Bearer ${token.access_token}`
          },
        });
        
        this.csrfToken = response.headers['x-csrf-token'];
      } catch (error) {
        throw this.enhanceError(error, 'Failed to fetch CSRF token');
      }
    }
  }

  /**
   * Initialisiert alle benutzerdefinierten Client-Erweiterungen
   */
  private initializeCustomClients(): void {
    // Integration Content Advanced Client
    this.integrationContentAdvanced = this.getOrCreateCustomClient<
      IntegrationContentClient, 
      IntegrationContentAdvancedClient
    >(
      CustomClientType.INTEGRATION_CONTENT_ADVANCED,
      this.integrationContent
    );
    

    
    // In Zukunft weitere Custom-Clients hier initialisieren
  }
  
  /**
   * Gibt einen vorhandenen benutzerdefinierten Client zurück oder erstellt einen neuen
   * 
   * @param type - Der Typ des benutzerdefinierten Clients
   * @param baseClient - Der zugrundeliegende Standard-Client
   * @returns Eine Instanz des benutzerdefinierten Clients
   */
  private getOrCreateCustomClient<T, C extends BaseCustomClient<T>>(
    type: string,
    baseClient: T
  ): C {
    // Prüfen, ob der Client bereits erstellt wurde
    if (this.customClients.has(type)) {
      return this.customClients.get(type) as C;
    }
    
    // Neuen Client erstellen
    const customClient = this.customClientRegistry.create<T, C>(type, baseClient);
    this.customClients.set(type, customClient);
    return customClient;
  }
  
  /**
   * Gibt einen benutzerdefinierten Client nach Typ zurück
   * 
   * @param type - Der Typ des benutzerdefinierten Clients
   * @returns Der benutzerdefinierte Client oder undefined, wenn nicht gefunden
   */
  public getCustomClient<C extends BaseCustomClient<any>>(type: string): C | undefined {
    return this.customClients.get(type) as C | undefined;
  }
  
  /**
   * Registriert einen benutzerdefinierten Client-Factory
   * 
   * Diese Methode erlaubt es, zur Laufzeit neue benutzerdefinierte Client-Factories
   * zu registrieren, was die dynamische Erweiterung des Clients ermöglicht.
   * 
   * @param type - Der Typ des benutzerdefinierten Clients
   * @param factory - Die Factory für die Erstellung des Clients
   */
  public registerCustomClientFactory<T, C extends BaseCustomClient<T>>(
    type: string,
    factory: CustomClientFactory<T, C>
  ): void {
    this.customClientRegistry.register(type, factory);
    
  }
}

/**
 * Export the SapClient class as default export
 */
export default SapClient; 