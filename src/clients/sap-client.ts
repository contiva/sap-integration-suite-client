/**
 * SAP Cloud Platform Integration API Client
 * 
 * This module provides a client for interacting with the SAP Cloud Platform Integration API.
 * It handles authentication, request management, and provides type-safe access to all SAP API endpoints.
 * 
 * @module sap-integration-suite-client
 * @packageDocumentation
 */

import axios, { AxiosInstance } from 'axios';
import { config } from 'dotenv';
import { Api as IntegrationContentApi } from '../types/sap.IntegrationContent';
import { Api as LogFilesApi } from '../types/sap.LogFiles';
import { Api as MessageProcessingLogsApi } from '../types/sap.MessageProcessingLogs';
import { Api as MessageStoreApi } from '../types/sap.MessageStore';
import { Api as SecurityContentApi } from '../types/sap.SecurityContent';
import { Api as B2BScenariosApi } from '../types/sap.B2BScenarios';
import { Api as PartnerDirectoryApi } from '../types/sap.PartnerDirectory';
import { IntegrationContentClient } from '../wrapper/integration-content-client';
import { IntegrationContentAdvancedClient } from '../wrapper/custom/integration-content-advanced-client';
import { MessageProcessingLogsClient } from '../wrapper/message-processing-logs-client';
import { LogFilesClient } from '../wrapper/log-files-client';
import { MessageStoreClient } from '../wrapper/message-store-client';
import { SecurityContentClient } from '../wrapper/security-content-client';
import { B2BScenariosClient } from '../wrapper/b2b-scenarios-client';
import { PartnerDirectoryClient } from '../wrapper/partner-directory-client';
import { CustomClientRegistry, CustomClientType } from '../wrapper/custom/custom-client-registry';
import { BaseCustomClient, CustomClientFactory } from '../wrapper/custom/base-custom-client';
import { CacheManager } from '../core/cache-manager';
import { extractHostname } from '../utils/hostname-extractor';
import { generateCacheKey, parseQueryParams } from '../utils/cache-key-generator';
import { isCacheableUrl, getRevalidationTime, CACHE_TTL } from '../core/cache-config';
import { CacheOptions } from '../types/cache';

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
  /**
   * Redis connection string for caching
   * Format: host:port,password=xxx,ssl=True,abortConnect=False
   * If not provided, the REDIS_CONNECTION_STRING environment variable will be used
   */
  redisConnectionString?: string;
  /**
   * Enable Redis caching
   * Default: false (or REDIS_ENABLED environment variable)
   */
  redisEnabled?: boolean;
  /**
   * Force cache revalidation on every request
   * Uses stale-while-revalidate pattern (returns cached data while updating in background)
   * Default: false
   */
  forceRefreshCache?: boolean;
  /**
   * Disable caching completely for this client instance
   * No cache reads or writes will be performed
   * Default: false
   */
  noCache?: boolean;
  /**
   * Custom logger function for cache events
   * If provided, cache status logs will be sent to this function instead of console.log
   */
  cacheLogger?: (message: string) => void;
  /**
   * External CacheManager instance (optional)
   * If provided, this instance will be used instead of creating a new one
   * Useful for sharing a single Redis connection across multiple SapClient instances
   */
  cacheManager?: CacheManager;
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
  /** Promise for ongoing CSRF token fetch to prevent race conditions */
  private csrfTokenPromise: Promise<void> | null = null;
  /** OAuth token with expiration information */
  private oauthToken: OAuthToken | null = null;
  /** Promise for ongoing token refresh to prevent race conditions */
  private tokenRefreshPromise: Promise<OAuthToken> | null = null;
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
  /** Cache manager for Redis-based caching */
  private cacheManager: CacheManager | null = null;
  /** Flag to track if cache manager is externally provided (don't disconnect on cleanup) */
  private isExternalCacheManager: boolean = false;
  /** Hostname for cache key generation */
  private hostname: string;
  /** Force cache revalidation on every request */
  private forceRefreshCache: boolean = false;
  /** Disable caching completely */
  private noCache: boolean = false;
  /** Custom logger for cache events */
  private cacheLogger?: (message: string) => void;
  /** Cached debug mode flag for performance */
  private readonly debugMode: boolean;
  
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
   * B2B Scenarios API client
   * Access business documents, orphaned interchanges, and acknowledgements
   */
  public b2bScenarios: B2BScenariosClient;
  /** 
   * Partner Directory API client
   * Manage partner information, parameters, and authorized users
   */
  public partnerDirectory: PartnerDirectoryClient;

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
    this.maxRetries = config?.maxRetries !== undefined ? config.maxRetries : 3;
    this.retryDelay = config?.retryDelay !== undefined ? config.retryDelay : 1000;
    this.enableCustomClients = config?.enableCustomClients !== undefined ? config.enableCustomClients : true;
    this.customClientRegistry = CustomClientRegistry.getInstance();
    
    // Redis caching configuration
    const redisConnectionString = config?.redisConnectionString || process.env.REDIS_CONNECTION_STRING || '';
    const redisEnabled = config?.redisEnabled !== undefined 
      ? config.redisEnabled 
      : (process.env.REDIS_ENABLED === 'true');
    this.forceRefreshCache = config?.forceRefreshCache || false;
    this.noCache = config?.noCache || false;
    this.cacheLogger = config?.cacheLogger;
    
    // Cache debug mode flag for performance (avoid repeated process.env access)
    this.debugMode = process.env.DEBUG === 'true';
    
    // Extract hostname for cache key generation
    this.hostname = extractHostname(this.baseUrl);
    
    // Initialize cache manager
    if (!this.noCache) {
      // Option 1: Use external cache manager if provided (connection pooling)
      if (config?.cacheManager) {
        this.cacheManager = config.cacheManager;
        this.isExternalCacheManager = true;
        if (this.debugMode) {
          console.debug('[SapClient] Using external CacheManager instance (connection pooling)');
        }
      }
      // Option 2: Create new cache manager if Redis is enabled
      else if (redisEnabled && redisConnectionString) {
      // Use OAuth client secret for encryption if available
      this.cacheManager = new CacheManager(
        redisConnectionString, 
        true, 
        this.oauthClientSecret // Use client secret for cache encryption
      );
        this.isExternalCacheManager = false;
      // Connect to Redis asynchronously (non-blocking)
      this.cacheManager.connect().catch((err) => {
        console.error('[SapClient] Failed to connect to Redis:', err);
        this.cacheManager = null;
      });
        if (this.debugMode) {
          console.debug('[SapClient] Created new CacheManager instance');
    }
      }
    }
    if (this.debugMode) {
      console.debug('[SapClient] Initializing with config:', {
        baseUrl: this.baseUrl,
        normalizeResponses: this.normalizeResponses,
        maxRetries: this.maxRetries,
        retryDelay: this.retryDelay,
        cacheEnabled: !!this.cacheManager,
        forceRefreshCache: this.forceRefreshCache,
        noCache: this.noCache
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
            if (this.debugMode) {
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
    
    // Add response interceptor to handle token expiration (401 Unauthorized) and CSRF token expiration (403 Forbidden)
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Check if error is due to invalid OAuth token (401) and this request hasn't been retried yet
        if (error.response?.status === 401 && !originalRequest._retryAuth) {
          console.debug('OAuth token expired or invalid, attempting to refresh...');
          
          // Mark request as auth retried to prevent infinite loops
          originalRequest._retryAuth = true;
          
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
        
        // Check if error is due to invalid CSRF token (403 Forbidden) for write operations
        if (error.response?.status === 403 && 
            originalRequest.method && 
            ['post', 'put', 'delete'].includes(originalRequest.method.toLowerCase()) &&
            !originalRequest._retryCsrf) {
          console.debug('CSRF token expired or invalid, attempting to refresh...');
          
          // Mark request as CSRF retried to prevent infinite loops
          originalRequest._retryCsrf = true;
          
          // Invalidate current CSRF token
          this.csrfToken = null;
          
          try {
            // Get a fresh CSRF token
            await this.ensureCsrfToken(true); // Force refresh
            
            // Update the X-CSRF-Token header with the new token
            if (this.csrfToken) {
              originalRequest.headers['X-CSRF-Token'] = this.csrfToken;
            }
            
            // Retry the original request with the new CSRF token
            return this.axiosInstance(originalRequest);
          } catch (csrfError) {
            // If CSRF token refresh also fails, reject with the error
            return Promise.reject(this.enhanceError(csrfError, 'Failed to refresh CSRF token after 403 Forbidden'));
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
    
    const b2bScenariosApi = new B2BScenariosApi({
      baseUrl: this.baseUrl,
      customFetch: this.customFetch.bind(this),
    });
    this.b2bScenarios = new B2BScenariosClient(b2bScenariosApi);
    
    const partnerDirectoryApi = new PartnerDirectoryApi({
      baseUrl: this.baseUrl,
      customFetch: this.customFetch.bind(this),
    });
    this.partnerDirectory = new PartnerDirectoryClient(partnerDirectoryApi);
    
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

    // If a token refresh is already in progress, wait for it
    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise;
    }

    // Otherwise, get a new token
    this.tokenRefreshPromise = (async () => {
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
        this.tokenRefreshPromise = null; // Clear the promise after success
      
      return token;
    } catch (error) {
        this.tokenRefreshPromise = null; // Clear the promise on error
      throw this.enhanceError(error, 'Failed to obtain OAuth token');
    }
    })();

    return this.tokenRefreshPromise;
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

    // Handle array responses (already normalized)
    if (Array.isArray(data)) {
      if (this.debugMode) {
        console.debug('[SapClient] Format detected: Already array', 
          `(length: ${data.length})`);
      }
      return data;
    }

    // Handle OData v2 format (d.results)
    if (data.d && Array.isArray(data.d.results)) {
      if (this.debugMode) {
        console.debug('[SapClient] Format detected: OData v2 (d.results)', 
          `(length: ${data.d.results.length})`);
      }
      return data.d.results;
    }

    // Handle OData v2 format where d is directly the object (not an array)
    if (data.d && typeof data.d === 'object' && !Array.isArray(data.d) && !data.d.results) {
      if (this.debugMode) {
        console.debug('[SapClient] Format detected: OData v2 (d as object)',
          `(keys: ${Object.keys(data.d).join(', ')})`);
      }
      return data.d;
    }

    // Handle OData v4 format (value array)
    if (data.value && Array.isArray(data.value)) {
      if (this.debugMode) {
        console.debug('[SapClient] Format detected: OData v4 (value array)',
          `(length: ${data.value.length})`);
      }
      return data.value;
    }

    // Handle IntegrationPackages format
    if (data.IntegrationPackages && Array.isArray(data.IntegrationPackages)) {
      if (this.debugMode) {
        console.debug('[SapClient] Format detected: IntegrationPackages array',
          `(length: ${data.IntegrationPackages.length})`);
      }
      return data.IntegrationPackages;
    }

    // Handle results property directly (some APIs return { results: [...] })
    if (data.results && Array.isArray(data.results)) {
      if (this.debugMode) {
        console.debug('[SapClient] Format detected: Direct results array',
          `(length: ${data.results.length})`);
      }
      return data.results;
    }

    // Handle specific nested formats that may contain arrays
    if (data.d && data.d.__next && data.d.results) {
      if (this.debugMode) {
        console.debug('[SapClient] Format detected: OData with __next link',
          `(length: ${data.d.results.length})`);
      }
      return data.d.results; // OData with __next link
    }
  
    // If the data is an object and has only one property that is an array, return that array
    const keys = Object.keys(data);
    if (keys.length === 1 && Array.isArray(data[keys[0]])) {
      if (this.debugMode) {
        console.debug('[SapClient] Format detected: Single property array',
          `(property: ${keys[0]}, length: ${data[keys[0]].length})`);
      }
      return data[keys[0]];
    }

    // Special handling for OData queries with $count that return a string
    if (typeof data === 'string' && !isNaN(parseInt(data, 10))) {
      if (this.debugMode) {
        console.debug('[SapClient] Format detected: Count string value', `(value: ${data})`);
      }
      return data; // Keep the string for count operations
    }

    // If we can't normalize, return the original data
    if (this.debugMode) {
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
   * - Implements Redis-based caching with stale-while-revalidate pattern
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
      
      // Parse body safely - catch JSON parsing errors
      let body: any = undefined;
      if (init?.body) {
        try {
          body = JSON.parse(init.body.toString());
        } catch {
          // If parsing fails, use body as-is (might be FormData, Blob, etc.)
          body = init.body;
        }
      }

      // Ensure Redis is connected if we have a cache manager
      if (this.cacheManager && !this.cacheManager.isReady()) {
        // Try to connect (will be quick if already connected or connecting)
        await this.cacheManager.connect().catch(() => {
          // Ignore connection errors - caching will be skipped
        });
      }

      // Check if caching should be applied
      const shouldCache = method === 'GET' 
        && this.cacheManager 
        && this.cacheManager.isReady() 
        && isCacheableUrl(url);

      if (this.debugMode) {
        console.log(`[SapClient] Cache check for ${url}: shouldCache=${shouldCache}, method=${method}, cacheManager=${!!this.cacheManager}, isReady=${this.cacheManager?.isReady()}, isCacheable=${isCacheableUrl(url)}`);
      }
      
      // Extract endpoint for logging
      const endpoint = url.replace(this.baseUrl, '').split('?')[0];

      // Generate cache key if caching is enabled
      let cacheKey = '';
      if (shouldCache) {
        const queryParams = parseQueryParams(url);
        cacheKey = generateCacheKey(this.hostname, method, url, queryParams);

        // Try to get from cache
        const cachedData = await this.cacheManager!.get(cacheKey);
        
        if (cachedData) {
          // Check if cache needs revalidation (either stale or expired)
          if (this.cacheManager!.isExpired(cachedData) || this.cacheManager!.shouldRevalidate(cachedData, this.forceRefreshCache)) {
            // Cache needs revalidation, use stale-while-revalidate pattern
            // Return old data immediately and update in background
            const isExpired = this.cacheManager!.isExpired(cachedData);
            
            const cacheStatus = isExpired ? 'HIT-EXPIRED' : 'HIT-STALE';
            
            // Log cache status
            const logMessage = `[SapClient] ${cacheStatus === 'HIT-EXPIRED' ? '⏰' : '🔄'} ${endpoint} - ${cacheStatus === 'HIT-EXPIRED' ? 'Cache expired' : 'Cache stale'} - returning old data and revalidating in background`;
            if (this.cacheLogger) {
              this.cacheLogger(logMessage);
            } else {
              console.log(logMessage);
            }
            
            if (this.debugMode) {
              console.log(`[SapClient] Cache ${isExpired ? 'expired' : 'stale'} for: ${url} - returning old data and revalidating in background`);
            }

            // Return stale/expired data immediately
            const staleResponse = new Response(JSON.stringify(cachedData.data), {
              status: 200,
              statusText: 'OK (from cache - stale)',
              headers: new Headers({ 'X-Cache': cacheStatus }),
            });
            
            // Add cache metadata to response object for logging
            // @ts-ignore - Adding custom property for cache tracking
            staleResponse._cacheStatus = cacheStatus;

            // Start background revalidation
            const revalidationTime = getRevalidationTime(url);
            const cacheOptions: CacheOptions = {
              ttl: CACHE_TTL.STANDARD,
              revalidateAfter: revalidationTime,
            };

            // Start background revalidation with logging
            const bgStartLog = `[SapClient] 🔄 ${endpoint} - Background revalidation started`;
            if (this.cacheLogger) {
              this.cacheLogger(bgStartLog);
            } else {
              console.log(bgStartLog);
            }

            this.cacheManager!.revalidateInBackground(
              cacheKey,
              async () => {
                try {
                  const freshData = await this.performRequest(url, method, headers, body);
                  const successLog = `[SapClient] ✅ ${endpoint} - Background revalidation completed`;
                  if (this.cacheLogger) {
                    this.cacheLogger(successLog);
                  } else {
                    console.log(successLog);
                  }
                  return freshData;
                } catch (error) {
                  const errorLog = `[SapClient] ❌ ${endpoint} - Background revalidation failed: ${(error as Error).message}`;
                  if (this.cacheLogger) {
                    this.cacheLogger(errorLog);
                  } else {
                    console.log(errorLog);
                  }
                  throw error;
                }
              },
              cacheOptions
            );

            return staleResponse;
          } else {
            // Cache is fresh, return it
            const hitLog = `[SapClient] ✅ ${endpoint} - Cache HIT (fresh)`;
            if (this.cacheLogger) {
              this.cacheLogger(hitLog);
            } else {
              console.log(hitLog);
            }
            
            if (this.debugMode) {
              console.log(`[SapClient] Cache hit (fresh): ${url}`);
            }
            const freshResponse = new Response(JSON.stringify(cachedData.data), {
              status: 200,
              statusText: 'OK (from cache)',
              headers: new Headers({ 'X-Cache': 'HIT' }),
            });
            
            // Add cache metadata to response object for logging
            // @ts-ignore - Adding custom property for cache tracking
            freshResponse._cacheStatus = 'HIT';
            
            return freshResponse;
          }
        } else {
          // Cache miss
          const missLog = `[SapClient] ❌ ${endpoint} - Cache MISS (fetching from SAP)`;
          if (this.cacheLogger) {
            this.cacheLogger(missLog);
          } else {
            console.log(missLog);
          }
          
          if (this.debugMode) {
            console.log(`[SapClient] Cache miss: ${url}`);
          }
        }
      }

      // Perform the actual request
      const responseData = await this.performRequest(url, method, headers, body);

      // Cache the response if caching is enabled
      if (shouldCache && cacheKey) {
        const revalidationTime = getRevalidationTime(url);
        const cacheOptions: CacheOptions = {
          ttl: CACHE_TTL.STANDARD,
          revalidateAfter: revalidationTime,
        };
        await this.cacheManager!.set(cacheKey, responseData, cacheOptions);
        
        const cachedLog = `[SapClient] 💾 ${endpoint} - Cached (TTL: ${CACHE_TTL.STANDARD / 86400}d, revalidate: ${revalidationTime / 3600}h)`;
        if (this.cacheLogger) {
          this.cacheLogger(cachedLog);
        } else {
          console.log(cachedLog);
        }
        
        if (this.debugMode) {
          console.log(`[SapClient] Cached response with key: ${cacheKey}`);
        }
      }

      // Convert to fetch Response with cache metadata
      const response = new Response(JSON.stringify(responseData), {
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'X-Cache': shouldCache ? 'MISS' : 'BYPASS' }),
      });
      
      // Add cache metadata to response object for logging
      // @ts-ignore - Adding custom property for cache tracking
      response._cacheStatus = shouldCache ? 'MISS' : 'BYPASS';
      
      return response;
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
   * Performs the actual HTTP request to SAP
   * 
   * @private
   * @param url - The URL to request
   * @param method - HTTP method
   * @param headers - Request headers
   * @param body - Request body
   * @returns The response data
   */
  private async performRequest(
    url: string,
    method: string,
    headers: Record<string, string>,
    body?: any
  ): Promise<any> {
    // Get OAuth token and add it to headers
    // Note: getOAuthToken() will throw an error if it fails, so no need to check for null
    const token = await this.getOAuthToken();
    
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

    // Normalize response if enabled
    let responseData = response.data;
    if (this.normalizeResponses && responseData) {
      const originalData = responseData;
      responseData = this.normalizeResponseFormat(responseData);
      
      // Debug log for normalization result (use reference equality for performance)
      if (this.debugMode) {
        const isChanged = originalData !== responseData;
        console.debug(
          `[SapClient] Response ${isChanged ? 'normalized' : 'not changed'} for ${method} ${url}`
        );
      }
    }

    return responseData;
  }

  /**
   * Ensures a CSRF token is available for write operations
   * - Fetches a new token if one doesn't exist
   * - Uses OAuth token for authentication
   * - Prevents race conditions with csrfTokenPromise
   * 
   * @private
   * @param {boolean} forceRefresh - Force fetching a new token even if one exists
   * @returns {Promise<void>}
   * @throws {Error} If the CSRF token cannot be fetched
   */
  private async ensureCsrfToken(forceRefresh: boolean = false): Promise<void> {
    // If we have a valid token and not forcing refresh, return immediately
    if (this.csrfToken && !forceRefresh) {
      return;
    }
    
    // If a CSRF token fetch is already in progress, wait for it
    if (this.csrfTokenPromise) {
      return this.csrfTokenPromise;
    }
    
    // Start fetching a new CSRF token
    this.csrfTokenPromise = (async () => {
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
        this.csrfTokenPromise = null; // Clear the promise after success
      } catch (error) {
        this.csrfTokenPromise = null; // Clear the promise on error
        throw this.enhanceError(error, 'Failed to fetch CSRF token');
      }
    })();
    
    return this.csrfTokenPromise;
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
  
  /**
   * Closes all connections and cleans up resources
   * 
   * This method should be called when the SapClient is no longer needed
   * to prevent memory leaks and ensure proper cleanup of resources like
   * Redis connections.
   * 
   * @returns Promise that resolves when cleanup is complete
   * 
   * @example
   * const client = new SapClient();
   * // ... use client ...
   * await client.disconnect();
   */
  public async disconnect(): Promise<void> {
    // Only close cache manager if it's not externally provided
    if (this.cacheManager && !this.isExternalCacheManager) {
      await this.cacheManager.close();
      this.cacheManager = null;
    } else if (this.cacheManager && this.isExternalCacheManager) {
      // External cache manager: just clear reference, don't close
      this.cacheManager = null;
    }
  }
}

/**
 * Export the SapClient class as default export
 */
export default SapClient; 