import axios, { AxiosInstance } from 'axios';
import { config } from 'dotenv';
import { Api as IntegrationContentApi } from '../types/sap.IntegrationContent';
import { Api as LogFilesApi } from '../types/sap.LogFiles';
import { Api as MessageProcessingLogsApi } from '../types/sap.MessageProcessingLogs';
import { Api as MessageStoreApi } from '../types/sap.MessageStore';
import { Api as SecurityContentApi } from '../types/sap.SecurityContent';
import logger from '../utils/logger';
import qs from 'querystring';

// Load environment variables from .env file
config();

interface OAuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  expiresAt?: number; // Timestamp when the token expires
}

// Config interface for SapClient
export interface SapClientConfig {
  baseUrl?: string;
  oauthClientId?: string;
  oauthClientSecret?: string;
  oauthTokenUrl?: string;
  logLevel?: string;
}

class SapClient {
  private axiosInstance: AxiosInstance;
  private baseUrl: string;
  private csrfToken: string | null = null;
  private oauthToken: OAuthToken | null = null;
  private oauthClientId: string;
  private oauthClientSecret: string;
  private oauthTokenUrl: string;
  
  public integrationContent: IntegrationContentApi<unknown>;
  public logFiles: LogFilesApi<unknown>;
  public messageProcessingLogs: MessageProcessingLogsApi<unknown>;
  public messageStore: MessageStoreApi<unknown>;
  public securityContent: SecurityContentApi<unknown>;

  constructor(config?: SapClientConfig) {
    // Load configuration with priority: passed config > environment variables > empty string
    this.baseUrl = config?.baseUrl || process.env.SAP_BASE_URL || '';
    this.oauthClientId = config?.oauthClientId || process.env.SAP_OAUTH_CLIENT_ID || '';
    this.oauthClientSecret = config?.oauthClientSecret || process.env.SAP_OAUTH_CLIENT_SECRET || '';
    this.oauthTokenUrl = config?.oauthTokenUrl || process.env.SAP_OAUTH_TOKEN_URL || '';
    
    // Set log level if provided
    if (config?.logLevel) {
      logger.level = config.logLevel;
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
  
  // Validate required configuration
  private validateConfig() {
    if (!this.baseUrl) {
      throw new Error('Base URL is required. Provide it via constructor parameter or SAP_BASE_URL environment variable.');
    }

    if (!this.oauthClientId || !this.oauthClientSecret || !this.oauthTokenUrl) {
      throw new Error('OAuth configuration is incomplete. Provide client ID, client secret, and token URL via constructor parameters or environment variables.');
    }
  }

  // Get or refresh OAuth token
  private async getOAuthToken(): Promise<OAuthToken> {
    const now = Date.now();

    // If we already have a token and it's not expired, return it
    if (this.oauthToken && this.oauthToken.expiresAt && this.oauthToken.expiresAt > now + 60000) {
      return this.oauthToken;
    }

    // Otherwise, get a new token
    try {
      logger.debug('Fetching new OAuth token');
      
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
      
      logger.debug('OAuth token obtained successfully');
      return token;
    } catch (error) {
      logger.error('Failed to obtain OAuth token:', error);
      throw new Error('Failed to obtain OAuth token');
    }
  }

  // Custom fetch implementation that uses axios
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
      logger.error('Error in SAP API request:', error);
      throw error;
    }
  }

  // Get CSRF token for write operations
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
        logger.debug('CSRF token fetched successfully');
      } catch (error) {
        logger.error('Failed to fetch CSRF token:', error);
        throw error;
      }
    }
  }
}

// Export the SapClient class instead of an instance
export default SapClient; 