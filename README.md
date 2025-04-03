# SAP Integration Suite Client

[![npm version](https://badge.fury.io/js/sap-integration-suite-client.svg)](https://badge.fury.io/js/sap-integration-suite-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A professional TypeScript library for interacting with SAP Cloud Integration APIs, developed by [Contiva GmbH](https://contiva.com).

## 🚀 Features

- **Complete API Access**: Support for all major SAP Integration Suite APIs
  - Integration Content Management
  - Message Processing Logs
  - Message Store
  - Security Content
  - Log Files
- **OAuth Authentication**: Automatic token management with Client Credentials Flow
- **Type Safety**: Complete TypeScript type definitions for all API endpoints
- **Formatting**: Automatic conversion of SAP-specific data formats (e.g. timestamps)
- **Flexible Configuration**: Configure via environment variables or direct parameters
- **Multi-Tenant Support**: Create multiple client instances for different SAP tenants
- **Response Format Normalization**: Automatically handles different SAP API response formats
- **Enhanced Error Handling**: Detailed error information with context
- **Automatic Retry Logic**: Retry capability for transient errors
- **Lightweight**: No external dependencies beyond the essentials

## 📋 Prerequisites

- Node.js (v16 or higher)
- SAP Cloud Integration tenant with API access
- OAuth credentials (Client ID, Client Secret, and Token URL)

## 📦 Installation

```bash
npm install sap-integration-suite-client
```

## ⚙️ Configuration

The library can be configured in two ways:

### 1. Environment Variables

Set the following variables in your `.env` file:

```env
SAP_BASE_URL=https://your-tenant.sap-api.com/api/v1
SAP_OAUTH_CLIENT_ID=your-client-id
SAP_OAUTH_CLIENT_SECRET=your-client-secret
SAP_OAUTH_TOKEN_URL=https://your-tenant.authentication.sap.hana.ondemand.com/oauth/token
```

### 2. Direct Configuration

Pass configuration directly when instantiating the client:

```typescript
import SapClient from 'sap-integration-suite-client';

const client = new SapClient({
  // Required Configuration
  baseUrl: 'https://your-tenant.sap-api.com/api/v1',
  oauthClientId: 'your-client-id',
  oauthClientSecret: 'your-client-secret',
  oauthTokenUrl: 'https://your-tenant.authentication.sap.hana.ondemand.com/oauth/token',
  
  // Advanced Options (all optional)
  normalizeResponses: true,  // Normalize response formats (default: true)
  maxRetries: 3,             // Number of retry attempts for failed requests (default: 0)
  retryDelay: 1000           // Delay between retries in milliseconds (default: 1000)
});
```

## 🔍 Examples

### Using the Default Client

For simple cases, you can use the default client that reads from environment variables:

```typescript
// Import the default client instance
import { defaultClient } from 'sap-integration-suite-client';

// Use the default client to make API calls
async function getIntegrationPackages() {
  try {
    const response = await defaultClient.integrationContent.integrationPackages.integrationPackagesList();
    return response.data;
  } catch (error) {
    console.error('Error fetching integration packages:', error);
    throw error;
  }
}
```

### Creating Custom Clients

For more control or when working with multiple SAP tenants, create your own client instances:

```typescript
// Import the SapClient class
import SapClient from 'sap-integration-suite-client';

// Create clients for different environments
const productionClient = new SapClient({
  baseUrl: 'https://production-tenant.sap-api.com/api/v1',
  oauthClientId: 'production-client-id',
  oauthClientSecret: 'production-client-secret',
  oauthTokenUrl: 'https://production-tenant.authentication.sap.hana.ondemand.com/oauth/token',
  // Enable retries for production environment
  maxRetries: 3
});

const testClient = new SapClient({
  baseUrl: 'https://test-tenant.sap-api.com/api/v1',
  oauthClientId: 'test-client-id',
  oauthClientSecret: 'test-client-secret',
  oauthTokenUrl: 'https://test-tenant.authentication.sap.hana.ondemand.com/oauth/token'
});

// Use specific client for different environments
async function getProductionPackages() {
  const response = await productionClient.integrationContent.integrationPackages.integrationPackagesList();
  return response.data;
}

async function getTestPackages() {
  const response = await testClient.integrationContent.integrationPackages.integrationPackagesList();
  return response.data;
}
```

### API Examples

```typescript
// Import the SapClient class
import SapClient from 'sap-integration-suite-client';

// Create a client
const client = new SapClient();

// Retrieve Message Processing Logs
async function getMessageProcessingLogs(filter = "Status eq 'FAILED'", top = 10) {
  try {
    const query = {
      $filter: filter,
      $top: top
    };
    const response = await client.messageProcessingLogs.messageProcessingLogs.messageProcessingLogsList(query);
    return response.data;
  } catch (error) {
    console.error('Error fetching message processing logs:', error);
    throw error;
  }
}

// Deploy an integration flow
async function deployIntegrationFlow(id, version) {
  try {
    await client.integrationContent.deployIntegrationDesigntimeArtifact.deployIntegrationDesigntimeArtifactCreate({
      Id: id,
      Version: version
    });
    console.log(`Deployment of integration flow ${id} version ${version} has been triggered`);
  } catch (error) {
    console.error(`Error deploying integration flow ${id} version ${version}:`, error);
    throw error;
  }
}
```

### Using Enhanced Error Handling

The client provides improved error handling with detailed context:

```typescript
try {
  const response = await client.integrationContent.integrationPackages.integrationPackagesList();
  return response.data;
} catch (error) {
  // Enhanced error information
  console.error('Status Code:', error.statusCode);
  console.error('Status Text:', error.statusText);
  console.error('Response Data:', error.responseData);
  
  // Original error message is still available
  console.error('Error Message:', error.message);
  
  throw error;
}
```

### Working with Normalized Responses

The client automatically normalizes responses from different SAP API formats:

```typescript
// This works consistently regardless of the response format the API returns
async function getPackages() {
  const response = await client.integrationContent.integrationPackages.integrationPackagesList();
  
  // The data will be normalized to an array, regardless of whether the API returns:
  // - A direct array
  // - {IntegrationPackages: [...]}
  // - {d: {results: [...]}} (OData v2)
  // - {value: [...]} (OData v4)
  const packages = response.data;
  
  return packages.map(pkg => ({
    id: pkg.Id || pkg.id,
    name: pkg.Name || pkg.name
  }));
}
```

## 📚 API Reference

### Available API Groups

| API Group | Description | Main Functions |
|------------|--------------|-----------------|
| `integrationContent` | Management of integration packages and flows | List packages, retrieve flow details, deploy artifacts |
| `messageProcessingLogs` | Access to message processing logs | Retrieve logs, view error information |
| `messageStore` | Access to stored messages and attachments | Retrieve message entries and attachments |
| `securityContent` | Management of security artifacts | Manage credentials, certificates, and access policies |
| `logFiles` | Access to system log files | Retrieve log archives and files |

### Type Safety

```typescript
import SapClient, { IntegrationContentTypes, MessageProcessingLogsTypes } from 'sap-integration-suite-client';

const client = new SapClient();

// Type-safe use of API responses
async function getFailedMessages() {
  const response = await client.messageProcessingLogs.messageProcessingLogs.messageProcessingLogsList({
    $filter: "Status eq 'FAILED'"
  });
  
  // Type-safe processing of results
  const logs: MessageProcessingLogsTypes.ComSapHciApiMessageProcessingLog[] = 
    response.data.d.results;
    
  return logs.map(log => ({
    id: log.MessageGuid,
    status: log.Status,
    time: new Date(log.LogEnd || log.LogStart)
  }));
}
```

### Advanced Configuration Options

The client supports several advanced configuration options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `normalizeResponses` | boolean | `true` | Normalizes different SAP API response formats into a consistent structure |
| `maxRetries` | number | `0` | Maximum number of retry attempts for failed requests |
| `retryDelay` | number | `1000` | Delay between retry attempts in milliseconds |

```typescript
// Client with advanced configuration
const client = new SapClient({
  // Basic configuration
  baseUrl: 'https://your-tenant.sap-api.com/api/v1',
  oauthClientId: 'your-client-id',
  oauthClientSecret: 'your-client-secret',
  oauthTokenUrl: 'https://your-tenant.authentication.sap.hana.ondemand.com/oauth/token',
  
  // Advanced configuration
  normalizeResponses: true,  // Normalize response formats
  maxRetries: 3,             // Retry failed requests up to 3 times
  retryDelay: 2000           // Wait 2 seconds between retries
});
```

## 🧰 Library Architecture

The library is designed to be a lightweight API client:

- **Core SAP API Client**
  - Connects directly to SAP APIs
  - Handles authentication and data formatting
  - Can be used in any Node.js application
  - No external dependencies other than axios and dotenv

This architecture allows you to:
- Use the library in any Node.js application
- Create multiple client instances for different SAP tenants
- Integrate with any framework of your choice

## 🛠️ Development

### Local Development

```bash
# Clone repository
git clone https://github.com/contiva/sap-integration-suite-client.git

# Change directory
cd sap-integration-suite-client

# Install dependencies
npm install

# Run build
npm run build

# Test library locally
npm link
```

### Testing with a Local Project

```bash
# In project directory
npm link sap-integration-suite-client

# Now the library can be used locally
import SapClient from 'sap-integration-suite-client';
```

### Verifying SAP Connectivity

The library includes a connection test script to verify your SAP credentials and connectivity:

```bash
# Build the project and run the connection test
npm run verify
```

## ❓ Troubleshooting

### OAuth Errors

If you encounter authentication errors, check:

1. Are your OAuth credentials correct?
2. Does your client have the appropriate permissions?
3. Is the token URL correct?

### API Response Format Issues

If you're having trouble with API response formats:

1. The client attempts to normalize response formats automatically (enabled by default)
2. If you need the original response format, disable normalization: `normalizeResponses: false`
3. Examine the raw response with `console.log(JSON.stringify(response.data))` to understand its structure

### CORS Issues

If you get CORS errors in a frontend application, ensure your SAP tenant supports CORS or use a proxy server.

### Missing Module

```
Error: Cannot find module 'sap-integration-suite-client'
```

Make sure you have correctly installed the package and the name in your imports matches the actual package name.

## 📄 License

MIT © [Contiva GmbH](https://contiva.com)

---

Developed by Contiva GmbH - Experts in SAP Integration and API Management. 