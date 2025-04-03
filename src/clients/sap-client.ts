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
import qs from 'querystring';

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
  
  /** 
   * Integration Content API client
   * Provides access to integration packages, artifacts, and related operations
   */
  public integrationContent: IntegrationContentApi<unknown>;
  /** 
   * Log Files API client
   * Access system logs and log archives
   */
  public logFiles: LogFilesApi<unknown>;
  /** 
   * Message Processing Logs API client
   * Access and query message processing logs
   */
  public messageProcessingLogs: MessageProcessingLogsApi<unknown>;
  /** 
   * Message Store API client
   * Access stored messages and attachments
   */
  public messageStore: MessageStoreApi<unknown>;
  /** 
   * Security Content API client
   * Manage security artifacts like credentials and certificates
   */
  public securityContent: SecurityContentApi<unknown>;

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
    this.oauthClientId = config?.oauthClientId || process.env.SAP_OAUTH_CLIENT_ID || '';
    this.oauthClientSecret = config?.oauthClientSecret || process.env.SAP_OAUTH_CLIENT_SECRET || '';
    this.oauthTokenUrl = config?.oauthTokenUrl || process.env.SAP_OAUTH_TOKEN_URL || '';
    
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

    // Initialize API clients
    this.integrationContent = new IntegrationContentApi({
      baseUrl: this.baseUrl,
      customFetch: this.customFetch.bind(this),
    });

    this.logFiles = new LogFilesApi({
      baseUrl: this.baseUrl,
      customFetch: this.customFetch.bind(this),
    });

    this.messageProcessingLogs = new MessageProcessingLogsApi({
      baseUrl: this.baseUrl, 
      customFetch: this.customFetch.bind(this),
    });

    this.messageStore = new MessageStoreApi({
      baseUrl: this.baseUrl,
      customFetch: this.customFetch.bind(this),
    });

    this.securityContent = new SecurityContentApi({
      baseUrl: this.baseUrl,
      customFetch: this.customFetch.bind(this),
    });
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
      throw new Error('OAuth configuration is incomplete. Provide client ID (oauthClientId), client secret (oauthClientSecret), and token URL (oauthTokenUrl) via constructor parameters or environment variables.');
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
      const tokenResponse = await axios.post(
        this.oauthTokenUrl,
        qs.stringify({
          grant_type: 'client_credentials',
          client_id: this.oauthClientId,
          client_secret: this.oauthClientSecret,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const token: OAuthToken = tokenResponse.data;
      // Set expiration time (subtract 5 minutes for safety margin)
      token.expiresAt = now + (token.expires_in * 1000) - 300000;
      
      this.oauthToken = token;
      
      return token;
    } catch (error) {
      throw new Error('Failed to obtain OAuth token');
    }
  }

  /**
   * Custom fetch implementation that uses axios to make HTTP requests
   * - Handles CSRF token for write operations
   * - Adds OAuth token to requests
   * - Transforms axios responses to fetch API Response objects
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

      const response = await this.axiosInstance.request({
        url,
        method,
        headers: authHeaders,
        data: body,
      });

      // Convert axios response to fetch Response
      return new Response(JSON.stringify(response.data), {
        status: response.status,
        statusText: response.statusText,
        headers: new Headers(response.headers as Record<string, string>),
      });
    } catch (error) {
      throw error;
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
        
        const response = await axios.get(`${this.baseUrl}/`, {
          headers: {
            'X-CSRF-Token': 'Fetch',
            'Authorization': `Bearer ${token.access_token}`
          },
        });
        
        this.csrfToken = response.headers['x-csrf-token'];
      } catch (error) {
        throw error;
      }
    }
  }
}

/**
 * Export the SapClient class as default export
 */
export default SapClient; 