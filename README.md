# SAP Integration Suite Client

[![npm version](https://badge.fury.io/js/sap-integration-suite-client.svg)](https://badge.fury.io/js/sap-integration-suite-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A TypeScript library for SAP Cloud Integration APIs (part of SAP Integration Suite), developed by [Contiva GmbH](https://contiva.com).

Available on npm: [sap-integration-suite-client](https://www.npmjs.com/package/sap-integration-suite-client)

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Features](#-features)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Basic Usage](#-basic-usage)
- [API Examples](#-api-examples)
  - [Integration Content](#integration-content-example)
  - [Message Processing Logs](#message-processing-logs-example)
  - [Security Content](#security-content-example)
  - [Message Store](#message-store-example)
  - [Log Files](#log-files-example)
- [Advanced Features](#-advanced-features)
  - [Advanced Clients](#integration-content-advanced-example)
  - [Extension Framework](#extending-your-project)
- [Error Handling](#-error-handling)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

## 🚀 Quick Start

```bash
# Install the package
npm install sap-integration-suite-client

# Create a .env file with your SAP credentials
echo "SAP_BASE_URL=https://your-tenant.integrationsuitetrial-api.eu10.hana.ondemand.com/api/v1
SAP_OAUTH_CLIENT_ID=your-client-id
SAP_OAUTH_CLIENT_SECRET=your-client-secret
SAP_OAUTH_TOKEN_URL=https://your-tenant.authentication.eu10.hana.ondemand.com/oauth/token" > .env
```

```typescript
// Basic usage example
import SapClient from 'sap-integration-suite-client';
import dotenv from 'dotenv';
dotenv.config();

// Create client (reads from .env)
const client = new SapClient();

// List integration packages
async function listPackages() {
  const packages = await client.integrationContent.getIntegrationPackages();
  console.log(`Found ${packages.length} integration packages`);
  packages.forEach(pkg => console.log(`- ${pkg.Name}`));
}

listPackages().catch(console.error);
```

## 🔍 Features

This client simplifies communication with SAP Integration Suite APIs:

- **Complete API Coverage**:
  - Integration Content - Manage packages, flows, and artifacts
  - Message Processing Logs - Monitor message execution
  - Message Store - Access persisted messages and payloads
  - Security Content - Manage credentials and certificates
  - Log Files - Access HTTP and trace logs

- **Developer-Friendly**:
  - TypeScript support with full type definitions
  - Promise-based API
  - OAuth and CSRF token handling
  - Error handling with detailed information

- **Advanced Capabilities**:
  - Bulk operations (retrieving packages with artifacts)
  - Error statistics and performance analysis
  - Extensible framework for custom clients

## 📦 Installation

```bash
# Using npm
npm install sap-integration-suite-client

# Using yarn
yarn add sap-integration-suite-client

# Using pnpm
pnpm add sap-integration-suite-client
```

## ⚙️ Configuration

You can configure the client through environment variables or direct parameters.

### Environment Variables (Recommended)

Create a `.env` file:

```env
# Required
SAP_BASE_URL=https://your-tenant.integrationsuitetrial-api.eu10.hana.ondemand.com/api/v1
SAP_OAUTH_CLIENT_ID=your-client-id
SAP_OAUTH_CLIENT_SECRET=your-client-secret
SAP_OAUTH_TOKEN_URL=https://your-tenant.authentication.eu10.hana.ondemand.com/oauth/token

# Optional
SAP_MAX_RETRIES=3
SAP_RETRY_DELAY=1500

# Redis Caching (Optional)
REDIS_CONNECTION_STRING=your-redis-host:6380,password=xxx,ssl=True,abortConnect=False
REDIS_ENABLED=true
```

Then initialize without parameters:

```typescript
import SapClient from 'sap-integration-suite-client';
import dotenv from 'dotenv';
dotenv.config();

const client = new SapClient(); // Reads from process.env
```

### Direct Configuration

```typescript
import SapClient from 'sap-integration-suite-client';

const client = new SapClient({
  baseUrl: 'https://your-tenant.integrationsuitetrial-api.eu10.hana.ondemand.com/api/v1',
  oauthClientId: 'your-client-id',
  oauthClientSecret: 'your-client-secret',
  oauthTokenUrl: 'https://your-tenant.authentication.eu10.hana.ondemand.com/oauth/token',
  
  // Optional settings
  maxRetries: 3,              // Default: 0
  retryDelay: 1500,           // Default: 1000 (ms)
  normalizeResponses: true,   // Default: true
  enableCustomClients: true,  // Default: true - Enable advanced client extensions
  
  // Redis caching options
  redisConnectionString: 'host:6380,password=xxx,ssl=True',
  redisEnabled: true,         // Default: false
  forceRefreshCache: false,   // Default: false - Force background revalidation
  noCache: false              // Default: false - Disable caching completely
});
```

> **Note**: The `baseUrl` should point to the `/api/v1` endpoint of your tenant's API service URL.

## 🚀 Redis Caching (Performance Optimization)

This library supports optional Redis-based caching to significantly improve performance and reduce load on SAP systems.

### Features

- **Stale-While-Revalidate Pattern**: Returns cached data immediately while updating in the background
- **Hostname-Aware**: Multi-tenant support with separate cache per SAP system
- **Smart TTL Configuration**: 
  - Standard APIs: 1 hour revalidation, 30 days storage
  - Runtime APIs (MessageProcessingLogs, LogFiles): 5 minutes revalidation, 30 days storage
- **Selective Caching**: Automatically excludes downloads and binary data
- **Graceful Degradation**: Works seamlessly without Redis

### Setup

1. **Install and configure Redis** (Azure Redis Cache, local Redis, etc.)

2. **Configure environment variables**:

```env
REDIS_CONNECTION_STRING=your-redis.redis.cache.windows.net:6380,password=yourpassword,ssl=True,abortConnect=False
REDIS_ENABLED=true
```

3. **Use the client normally** - caching happens automatically:

```typescript
import SapClient from 'sap-integration-suite-client';

const client = new SapClient({
  // SAP configuration...
  redisEnabled: true,
  redisConnectionString: process.env.REDIS_CONNECTION_STRING,
});

// First call: fetches from SAP and caches (slower)
const packages1 = await client.integrationContent.getIntegrationPackages();

// Second call: returns from cache (much faster!)
const packages2 = await client.integrationContent.getIntegrationPackages();
```

### Advanced Options

#### Force Refresh Cache

Force revalidation while still returning cached data (useful after deployments):

```typescript
const client = new SapClient({
  // ... other config
  redisEnabled: true,
  forceRefreshCache: true  // Forces background revalidation on every request
});
```

#### Disable Caching

Completely bypass cache for specific client instances:

```typescript
const client = new SapClient({
  // ... other config
  noCache: true  // No cache reads or writes
});
```

### What Gets Cached?

**Cached:**
- All GET requests to SAP APIs
- Integration packages, flows, and configurations
- Security content metadata
- Message processing logs (with shorter TTL)

**Not Cached:**
- POST, PUT, DELETE requests
- Binary downloads (`/value`, `/$value`, `/download` endpoints)
- Custom API extensions (only direct SAP APIs are cached)
- Requests with `noCache: true`

### Performance Benefits

Typical performance improvements with caching enabled:
- **Cache Hit**: 50-95% faster response times
- **Reduced SAP Load**: Fewer API calls to SAP systems
- **Better Reliability**: Stale data served even during SAP outages (within TTL)

### Monitoring Cache

Enable debug mode to see cache behavior:

```typescript
process.env.DEBUG = 'true';

// Console will show:
// [SapClient] Cache miss: /IntegrationPackages
// [SapClient] Cache hit (fresh): /IntegrationPackages
// [SapClient] Cache needs revalidation (stale): /MessageProcessingLogs
```

## 💡 Basic Usage

After creating a client instance, you can access various API areas through properties:

```typescript
// Access different API clients
client.integrationContent      // Integration Content API
client.messageProcessingLogs   // Message Processing Logs API
client.messageStore            // Message Store API
client.securityContent         // Security Content API
client.logFiles                // Log Files API

// Access advanced clients
client.integrationContentAdvanced  // Enhanced Integration Content operations
```

## 📚 API Examples

### Integration Content Example

Manage integration packages, flows, and other artifacts:

```typescript
import SapClient from 'sap-integration-suite-client';

const client = new SapClient();

async function managePackages() {
  // List packages (with pagination)
  const packages = await client.integrationContent.getIntegrationPackages({ top: 5 });
  console.log(`Found ${packages.length} packages`);
  
  if (packages.length > 0) {
    const packageId = packages[0].Id;
    
    // Get integration flows in a package
    const flows = await client.integrationContent.getIntegrationFlows(packageId);
    console.log(`Package ${packages[0].Name} has ${flows.length} integration flows`);
    
    // Get a specific flow
    if (flows.length > 0) {
      const flow = await client.integrationContent.getIntegrationFlowById(flows[0].Id);
      console.log(`Flow details: ${flow?.Name}, Version: ${flow?.Version}`);
    }
  }
}

managePackages().catch(console.error);
```

### Message Processing Logs Example

Monitor and analyze message execution:

```typescript
import SapClient from 'sap-integration-suite-client';

const client = new SapClient();

async function monitorMessages() {
  // Get failed messages from the last 24 hours
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const { logs } = await client.messageProcessingLogs.getMessageProcessingLogs({
    filter: `Status eq 'FAILED' and LogEnd gt datetime'${yesterday.toISOString()}'`,
    top: 10,
    orderby: ['LogEnd desc']
  });
  
  console.log(`Found ${logs.length} failed messages in the last 24 hours`);
  
  for (const log of logs) {
    console.log(`Message: ${log.MessageGuid}, Flow: ${log.IntegrationFlowName}`);
    
    // Get error details for a failed message
    const errorInfo = await client.messageProcessingLogs.getLogErrorInformation(log.MessageGuid);
    if (errorInfo) {
      console.log(`Error: ${errorInfo.ErrorMessage}`);
    }
  }
}

monitorMessages().catch(console.error);
```

### Security Content Example

Manage security artifacts like keystores and credentials:

```typescript
import SapClient from 'sap-integration-suite-client';

const client = new SapClient();

async function manageKeystore() {
  // List keystore entries
  const entries = await client.securityContent.getKeystoreEntries('system');
  console.log(`Found ${entries.length} entries in the system keystore`);
  
  entries.forEach(entry => {
    console.log(`- ${entry.Alias} (${entry.Type}), Valid until: ${entry.Validity}`);
  });
}

manageKeystore().catch(console.error);
```

### Message Store Example

Access persisted messages and their payloads:

```typescript
import SapClient from 'sap-integration-suite-client';

const client = new SapClient();

async function accessMessageStore(messageGuid: string) {
  // Get store entries for a message
  const entries = await client.messageStore.getMessageStoreEntriesForMessage(messageGuid);
  console.log(`Found ${entries.length} message store entries`);
  
  if (entries.length > 0) {
    // Get entry details
    console.log(`Entry ID: ${entries[0].Id}, Type: ${entries[0].MsgType}`);
    
    // Get payload (if available)
    try {
      const payload = await client.messageStore.getMessageStoreEntryPayload(entries[0].Id);
      console.log('Payload retrieved successfully');
    } catch (error) {
      console.error('Failed to retrieve payload');
    }
  }
}

// Replace with a valid message GUID
accessMessageStore('your-message-guid').catch(console.error);
```

### Log Files Example

Access HTTP and trace logs:

```typescript
import SapClient from 'sap-integration-suite-client';

const client = new SapClient();

async function accessLogs() {
  // List HTTP log files
  const logs = await client.logFiles.getLogFiles({ 
    filter: "LogFileType eq 'http'"
  });
  
  console.log(`Found ${logs.length} HTTP log files`);
  
  if (logs.length > 0) {
    const recentLog = logs[0];
    console.log(`Recent log: ${recentLog.Name}, Size: ${recentLog.Size} bytes`);
    
    // Download log content
    if (recentLog.Name && recentLog.Application) {
      const content = await client.logFiles.downloadLogFile(
        recentLog.Name, 
        recentLog.Application
      );
      
      // In Node.js, convert content to string
      if (Buffer.isBuffer(content)) {
        const textContent = content.toString('utf-8').substring(0, 500);
        console.log(`Log content preview: ${textContent}...`);
      }
    }
  }
}

accessLogs().catch(console.error);
```

## 🔧 Advanced Features

### Integration Content Advanced Example

The library provides advanced clients with enhanced capabilities and **optimized performance**:

#### 🚀 Performance Optimizations

The `getPackagesWithArtifacts` method includes significant optimizations:
- **50% fewer API calls**: MessageMappings & ValueMappings are fetched via global endpoints
- **Concurrency control**: Prevents rate limiting (HTTP 429) errors
- **Configurable parallelization**: Adjust concurrency based on your system size

#### Basic Usage

```typescript
import SapClient from 'sap-integration-suite-client';

const client = new SapClient();

async function advancedOperations() {
  // Get packages with all their artifacts in a single operation (sequentially)
  const packagesWithArtifacts = await client.integrationContentAdvanced.getPackagesWithArtifacts({
    top: 5,
    includeEmpty: false  // Skip packages without artifacts
  });
  
  console.log(`Retrieved ${packagesWithArtifacts.length} packages with their artifacts`);
  
  // Example of data available
  if (packagesWithArtifacts.length > 0) {
    const pkg = packagesWithArtifacts[0];
    console.log(`Package: ${pkg.package.Name} (${pkg.package.Id})`);
    console.log(`- Integration Flows: ${pkg.artifacts.integrationFlows.length}`);
    console.log(`- Value Mappings: ${pkg.artifacts.valueMappings.length}`);
    console.log(`- Message Mappings: ${pkg.artifacts.messageMappings.length}`);
    console.log(`- Script Collections: ${pkg.artifacts.scriptCollections.length}`);
  }
}

advancedOperations().catch(console.error);
```

#### ⚡ Parallel Mode with Optimal Concurrency

```typescript
// Fetch packages with optimal parallelization
const packagesWithArtifacts = await client.integrationContentAdvanced.getPackagesWithArtifacts({
  parallel: true,
  concurrency: 7  // Optimal for most systems (up to 100 packages)
});

// Monitor rate limit errors
const rateLimitErrors = client.integrationContentAdvanced.getRateLimitErrorCount();
if (rateLimitErrors > 0) {
  console.warn(`⚠️ ${rateLimitErrors} rate limit errors occurred - consider reducing concurrency`);
}
```

#### 📊 Best Practices for Concurrency

| System Size | Recommended Concurrency | Notes |
|------------|------------------------|-------|
| Small (< 50 packages) | `concurrency: 10` | Safe for most small systems |
| Medium (50-100 packages) | `concurrency: 7` | **Default - optimal for most** |
| Large (100+ packages) | `concurrency: 5` | Start low, monitor 429 errors |
| Very Large (200+ packages) | `concurrency: 3-5` | Increase carefully |

**Finding your optimal concurrency:**

```bash
# Use the included test script
./find-optimal-concurrency.sh

# Or manually test different values
node your-script.js --concurrency 7
```

### Extending Your Project

You can extend the library with custom functionality without modifying the `node_modules` directory:

```typescript
// src/custom/FlowAnalytics.ts
import { 
  BaseCustomClient, 
  MessageProcessingLogsClient 
} from 'sap-integration-suite-client';

// Create your custom client class
export class FlowAnalytics extends BaseCustomClient<MessageProcessingLogsClient> {
  async getFlowPerformance(flowName: string, days = 7) {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    
    const { logs } = await this.client.getMessageProcessingLogs({
      filter: `IntegrationFlowName eq '${flowName}' and Status eq 'COMPLETED' and LogEnd gt datetime'${fromDate.toISOString()}'`,
      top: 100
    });
    
    // Calculate performance metrics
    const durations = logs.map(log => {
      const start = new Date(log.LogStart).getTime();
      const end = new Date(log.LogEnd).getTime();
      return end - start;
    });
    
    return {
      count: logs.length,
      avgDuration: durations.reduce((sum, d) => sum + d, 0) / durations.length || 0,
      minDuration: Math.min(...durations) || 0,
      maxDuration: Math.max(...durations) || 0
    };
  }
}

// src/custom/FlowAnalyticsFactory.ts
import { CustomClientFactory, MessageProcessingLogsClient } from 'sap-integration-suite-client';
import { FlowAnalytics } from './FlowAnalytics';

export class FlowAnalyticsFactory implements CustomClientFactory<MessageProcessingLogsClient, FlowAnalytics> {
  create(baseClient: MessageProcessingLogsClient): FlowAnalytics {
    return new FlowAnalytics(baseClient);
  }
}

// src/index.ts - Using your custom client
import SapClient from 'sap-integration-suite-client';
import { FlowAnalyticsFactory } from './custom/FlowAnalyticsFactory';

const client = new SapClient();

// Register your custom factory
client.customClientRegistry.registerFactory('flow-analytics', new FlowAnalyticsFactory());

// Use your custom client
async function analyzeFlowPerformance() {
  const analytics = client.customClientRegistry.create('flow-analytics', client.messageProcessingLogs);
  
  const performance = await analytics.getFlowPerformance('MyIntegrationFlow');
  console.log('Flow performance:', performance);
}

analyzeFlowPerformance().catch(console.error);
```

## 🎣 Error Handling

The client provides enhanced error objects with additional details:

```typescript
import SapClient from 'sap-integration-suite-client';

const client = new SapClient();

async function handleErrors() {
  try {
    // Try to get a non-existent package
    await client.integrationContent.getIntegrationPackageById('non-existent-id');
  } catch (error: any) {
    console.error('Error occurred:');
    console.error(`- Status Code: ${error.statusCode || 'N/A'}`);
    console.error(`- Status Text: ${error.statusText || 'N/A'}`);
    console.error(`- Message: ${error.message}`);
    
    // SAP specific error details (if available)
    if (error.responseData) {
      console.error('- SAP Error:', error.responseData);
    }
  }
}

handleErrors();
```

## 📖 API Documentation

Eine vollständige API-Dokumentation mit allen Klassen, Methoden, Interfaces und Typen ist verfügbar.

### Dokumentation lokal generieren

```bash
# Dokumentation generieren
npm run docs

# Dokumentation im Browser öffnen
npm run docs:serve
```

Die Dokumentation wird mit [TypeDoc](https://typedoc.org/) generiert und enthält:
- 📚 Vollständige Methodensignaturen und Beschreibungen
- 🔍 TypeScript-Typen für alle APIs
- 💡 Code-Beispiele und Usage-Patterns
- 🔗 Verlinkte Referenzen zwischen Typen

**Weitere Details**: Siehe [DOCS.md](./DOCS.md) für eine ausführliche Anleitung zur Dokumentation.

## ❓ Troubleshooting

Common issues and solutions:

### Authentication Problems

- **OAuth Errors**: Verify your Client ID, Client Secret, and Token URL
- **Permission Errors**: Ensure your OAuth client has the necessary roles assigned (IntegrationDeveloper, etc.)

### API Errors

- **404 Not Found**: Check that your `baseUrl` is correct and includes `/api/v1`
- **403 Forbidden**: Your client might lack necessary permissions for the API
- **CSRF Token Errors**: Ensure your base URL is correct and allows token fetch operations

### Environment-Specific Issues

- **Neo vs. Cloud Foundry**: Some APIs are environment-specific (Neo-only or CF-only)
- **Tenant Configuration**: Verify your tenant has the APIs you need enabled

## 📄 License

MIT © [Contiva GmbH](https://contiva.com)

---

Developed by Contiva GmbH - [https://contiva.com](https://contiva.com) 