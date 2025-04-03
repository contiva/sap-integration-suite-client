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
- **Express Integration**: Pre-built routers for quick API integration
- **Error Handling**: Robust error handling and logging
- **Formatting**: Automatic conversion of SAP-specific data formats (e.g. timestamps)

## 📋 Prerequisites

- Node.js (v16 or higher)
- SAP Cloud Integration tenant with API access
- OAuth credentials (Client ID, Client Secret, and Token URL)

## 📦 Installation

```bash
npm install sap-integration-suite-client
```

## ⚙️ Configuration

The library uses environment variables for configuration. Set the following variables in your `.env` file:

```env
SAP_BASE_URL=https://your-tenant.sap-api.com/api/v1
SAP_OAUTH_CLIENT_ID=your-client-id
SAP_OAUTH_CLIENT_SECRET=your-client-secret
SAP_OAUTH_TOKEN_URL=https://your-tenant.authentication.sap.hana.ondemand.com/oauth/token
```

## 🔍 Examples

### Basic Usage

```typescript
// Import the SAP Client
import SapClient from 'sap-integration-suite-client';

// Use the client to make API calls
async function getIntegrationPackages() {
  try {
    const response = await SapClient.integrationContent.integrationPackages.integrationPackagesList();
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching integration packages:', error);
    throw error;
  }
}

// Retrieve Message Processing Logs
async function getMessageProcessingLogs(filter = "Status eq 'FAILED'", top = 10) {
  try {
    const query = {
      $filter: filter,
      $top: top
    };
    const response = await SapClient.messageProcessingLogs.messageProcessingLogs.messageProcessingLogsList(query);
    return response.data;
  } catch (error) {
    console.error('Error fetching message processing logs:', error);
    throw error;
  }
}
```

### Express Integration

```typescript
import express from 'express';
import { 
  createIntegrationContentRoutes, 
  createMessageProcessingLogsRoutes,
  createMessageStoreRoutes,
  createSecurityContentRoutes,
  createLogFilesRoutes
} from 'sap-integration-suite-client';

const app = express();

// Middleware for JSON processing
app.use(express.json());

// Add pre-built routes
app.use('/api/integration-content', createIntegrationContentRoutes());
app.use('/api/message-processing-logs', createMessageProcessingLogsRoutes());
app.use('/api/message-store', createMessageStoreRoutes());
app.use('/api/security-content', createSecurityContentRoutes());
app.use('/api/log-files', createLogFilesRoutes());

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Customizing the SAP Client

```typescript
import SapClient from 'sap-integration-suite-client';
import { createSecurityContentRoutes } from 'sap-integration-suite-client';

// Client with custom settings
const customSapClient = new SapClient({
  baseUrl: process.env.CUSTOM_SAP_URL,
  oauthClientId: process.env.CUSTOM_OAUTH_CLIENT_ID,
  oauthClientSecret: process.env.CUSTOM_OAUTH_CLIENT_SECRET,
  oauthTokenUrl: process.env.CUSTOM_OAUTH_TOKEN_URL
});

// Use with Express
const app = express();
app.use('/api/security-content', createSecurityContentRoutes({ 
  customSapClient 
}));
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
import { IntegrationContentTypes, MessageProcessingLogsTypes } from 'sap-integration-suite-client';

// Type-safe use of API responses
async function getFailedMessages() {
  const response = await SapClient.messageProcessingLogs.messageProcessingLogs.messageProcessingLogsList({
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

## ❓ Troubleshooting

### OAuth Errors

If you encounter authentication errors, check:

1. Are your OAuth credentials correct?
2. Does your client have the appropriate permissions?
3. Is the token URL correct?

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