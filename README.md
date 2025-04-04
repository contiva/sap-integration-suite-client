# SAP Integration Suite Client

[![npm version](https://badge.fury.io/js/sap-integration-suite-client.svg)](https://badge.fury.io/js/sap-integration-suite-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A professional TypeScript library for interacting with SAP Cloud Integration APIs (part of the SAP Integration Suite), developed by [Contiva GmbH](https://contiva.com).

This client simplifies communication with various SAP Integration Suite APIs by handling authentication, CSRF tokens, and providing a type-safe interface.

## 🚀 Features

-   **Comprehensive API Coverage**: Access to key SAP Integration Suite APIs:
    -   Integration Content (Packages, Flows, Artifacts)
    -   Message Processing Logs
    -   Message Store (including Attachments, Properties, JMS Resources, Data Stores, Variables)
    -   Security Content (Credentials, Keystore, Mappings, Policies)
    -   Log Files (HTTP/Trace Logs)
-   **Simplified Authentication**: Automatic OAuth 2.0 Client Credentials flow handling, including token refresh.
-   **Type Safety**: Fully typed with TypeScript, providing autocompletion and compile-time checks for API requests and responses.
-   **Easy Configuration**: Configure via environment variables or direct parameters during client instantiation.
-   **Convenient Wrappers**: High-level client wrappers for each API area (`integrationContent`, `messageProcessingLogs`, etc.) offering simplified method calls.
-   **CSRF Token Handling**: Automatic fetching and inclusion of CSRF tokens for write operations (POST, PUT, DELETE).
-   **Error Handling**: Provides enhanced error objects with status codes and response data.
-   **Optional Retries**: Built-in optional retry mechanism for transient network errors.

## 📋 Prerequisites

-   Node.js (v16 or higher recommended)
-   An SAP Integration Suite tenant with API access configured.
-   OAuth 2.0 Client Credentials (Client ID, Client Secret, and Token URL) for your tenant.

## 📦 Installation

```bash
npm install sap-integration-suite-client
# or
yarn add sap-integration-suite-client
```

## ⚙️ Configuration

The client requires connection details and OAuth credentials for your SAP Integration Suite tenant. You can provide these either through environment variables or directly when creating the client instance.

### 1. Environment Variables (Recommended for security)

Create a `.env` file in your project root:

```env
SAP_BASE_URL=https://your-tenant-tmn.integrationsuitetrial-api.eu10.hana.ondemand.com/api/v1
SAP_OAUTH_CLIENT_ID=your-client-id
SAP_OAUTH_CLIENT_SECRET=your-client-secret
SAP_OAUTH_TOKEN_URL=https://your-tenant.authentication.eu10.hana.ondemand.com/oauth/token
```

Then, create the client without passing options:

```typescript
import SapClient from 'sap-integration-suite-client';

const client = new SapClient(); // Reads from process.env
```

*(Ensure you have `dotenv` configured in your application if using `.env` files)*

### 2. Direct Configuration

Pass the configuration object directly to the constructor. This is useful for testing or environments where `.env` files are not suitable.

```typescript
import SapClient, { SapClientConfig } from 'sap-integration-suite-client';

const config: SapClientConfig = {
  baseUrl: 'https://your-tenant-tmn.integrationsuitrial-api.eu10.hana.ondemand.com/api/v1',
  oauthClientId: 'your-client-id',
  oauthClientSecret: 'your-client-secret',
  oauthTokenUrl: 'https://your-tenant.authentication.eu10.hana.ondemand.com/oauth/token',
  
  // Optional Advanced Settings:
  // maxRetries: 3,       // Default: 0
  // retryDelay: 1500,    // Default: 1000 (ms)
  // normalizeResponses: true // Default: true (currently limited effect)
};

const client = new SapClient(config);
```

**Note:** The `baseUrl` should point to the `/api/v1` endpoint of your tenant's API service URL.

## 💡 Basic Usage

1.  **Import the client:**

    ```typescript
    import SapClient from 'sap-integration-suite-client';
    ```

2.  **Create an instance** (using environment variables or direct configuration):

    ```typescript
    // Using environment variables (recommended)
    const client = new SapClient();
    
    // Or using direct configuration
    // const client = new SapClient({ /* your config */ });
    ```

3.  **Access API groups** via the client instance properties:

    ```typescript
    client.integrationContent // For Integration Content API
    client.messageProcessingLogs // For Message Processing Logs API
    client.messageStore // For Message Store API
    client.securityContent // For Security Content API
    client.logFiles // For Log Files API
    ```

## ✨ Examples using Client Wrappers

The library provides convenient wrapper clients for each major API area. These wrappers simplify method calls and data handling.

### Integration Content Example

```typescript
import SapClient from 'sap-integration-suite-client';

const client = new SapClient();

async function listIntegrationPackages() {
  try {
    console.log('Fetching top 5 integration packages...');
    const packages = await client.integrationContent.getIntegrationPackages({ top: 5 });
    
    if (packages.length > 0) {
      console.log('Found packages:');
      packages.forEach(pkg => {
        console.log(`- ID: ${pkg.Id}, Name: ${pkg.Name}, Version: ${pkg.Version}`);
      });

      // Get artifacts for the first package
      const firstPackageId = packages[0].Id;
      if (firstPackageId) {
        console.log(`\nFetching artifacts for package: ${firstPackageId}`);
        const flows = await client.integrationContent.getIntegrationFlows(firstPackageId);
        console.log(`  Flows found: ${flows.length}`);
        // You can similarly fetch other artifact types:
        // const valueMappings = await client.integrationContent.getValueMappings(firstPackageId);
        // const messageMappings = await client.integrationContent.getMessageMappings(firstPackageId);
        // const scriptCollections = await client.integrationContent.getScriptCollections(firstPackageId);
      }
    } else {
      console.log('No integration packages found.');
    }

  } catch (error) {
    console.error('Error fetching integration content:', error);
  }
}

listIntegrationPackages();
```

### Message Processing Logs Example

```typescript
import SapClient from 'sap-integration-suite-client';

const client = new SapClient();

async function getFailedLogs() {
  try {
    console.log('Fetching latest 10 FAILED message logs...');
    const { logs, count } = await client.messageProcessingLogs.getMessageProcessingLogs({
      filter: "Status eq 'FAILED'",
      top: 10,
      orderby: ['LogEnd desc'],
      // inlinecount: true // Use this to get total count (if needed)
    });

    if (logs.length > 0) {
      console.log(`Found ${logs.length} failed logs:`);
      logs.forEach(log => {
        console.log(`- GUID: ${log.MessageGuid}, Flow: ${log.IntegrationFlowName}, Status: ${log.Status}, End: ${log.LogEnd}`);
        
        // Optionally fetch error details for a specific log
        // const errorText = await client.messageProcessingLogs.getLogErrorInformationText(log.MessageGuid);
        // console.log(`  Error Details: ${errorText}`);
      });
    } else {
      console.log('No failed logs found in the recent period.');
    }

  } catch (error) {
    console.error('Error fetching message logs:', error);
  }
}

getFailedLogs();
```

### Security Content Example

```typescript
import SapClient from 'sap-integration-suite-client';

const client = new SapClient();

async function manageKeystore() {
  try {
    console.log('Fetching keystore entries...');
    const entries = await client.securityContent.getKeystoreEntries('system'); // 'system', 'backup_admin_system', 'KeyRenewal'
    
    console.log(`Found ${entries.length} entries in the system keystore:`);
    entries.forEach(entry => {
      console.log(`- Alias: ${entry.Alias}, Type: ${entry.Type}, Valid until: ${entry.Validity}`);
    });

    // Example: Delete an entry (use with caution!)
    // const aliasToDelete = 'my_old_cert';
    // const hexAliasToDelete = Buffer.from(aliasToDelete).toString('hex'); // Calculate hex alias if needed
    // console.log(`\nAttempting to delete entry with alias: ${aliasToDelete} (Hex: ${hexAliasToDelete})`);
    // try {
    //   await client.securityContent.deleteKeystoreEntry(hexAliasToDelete);
    //   console.log(`Entry ${aliasToDelete} deleted successfully.`);
    // } catch (deleteError) {
    //   console.error(`Failed to delete entry ${aliasToDelete}:`, deleteError);
    // }

  } catch (error) {
    console.error('Error managing keystore:', error);
  }
}

manageKeystore();
```

### Message Store Example

```typescript
import SapClient from 'sap-integration-suite-client';

const client = new SapClient();

async function checkMessageStore(messageGuid: string) {
  try {
    console.log(`Fetching message store entries for Message GUID: ${messageGuid}`);
    const entries = await client.messageStore.getMessageStoreEntriesForMessage(messageGuid);

    if (entries.length > 0) {
      console.log(`Found ${entries.length} message store entries.`);
      for (const entry of entries) {
        console.log(`- Entry ID: ${entry.Id}, Timestamp: ${entry.Timestamp}`);
        
        // Example: Download payload (content type varies)
        // console.log('  Downloading payload...');
        // const payload = await client.messageStore.getMessageStoreEntryPayload(entry.Id);
        // console.log('  Payload received (raw):', payload); 
        
        // Example: List attachments
        // if (entry.HasAttachments) {
        //   console.log('  Fetching attachments...');
        //   const attachments = await client.messageStore.getMessageStoreEntryAttachments(entry.Id);
        //   attachments.forEach(att => console.log(`    - Attachment: ${att.Name} (${att.ContentType})`));
        // }
      }
    } else {
      console.log('No message store entries found for this GUID.');
    }

  } catch (error) {
    console.error('Error accessing message store:', error);
  }
}

// Replace with a valid Message GUID from your tenant that has persisted messages
// checkMessageStore('your-message-guid-here'); 
```

### Log Files Example

```typescript
import SapClient from 'sap-integration-suite-client';

const client = new SapClient();

async function listHttpLogFiles() {
  try {
    console.log('Fetching list of HTTP log files...');
    const logFiles = await client.logFiles.getLogFiles({ filter: "LogFileType eq 'http'" });

    if (logFiles.length > 0) {
      console.log(`Found ${logFiles.length} HTTP log files:`);
      logFiles.slice(0, 5).forEach(file => { // Show first 5
        console.log(`- Name: ${file.Name}, App: ${file.Application}, Modified: ${file.LastModified}, Size: ${file.Size}`);
      });
      
      // Example: Download a specific log file (content type is usually plain text)
      // const firstLog = logFiles[0];
      // if (firstLog.Name && firstLog.Application) {
      //   console.log(`\nDownloading content of ${firstLog.Name}...`);
      //   const fileContent = await client.logFiles.downloadLogFile(firstLog.Name, firstLog.Application);
      //   // Note: downloadLogFile returns 'File' in browser, 'any' (raw data) otherwise.
      //   // You might need to convert the raw data (e.g., Buffer to string) in Node.js
      //   console.log('Log content snippet:', Buffer.from(fileContent).toString('utf-8').substring(0, 500));
      // }

    } else {
      console.log('No HTTP log files found.');
    }
  } catch (error) {
    console.error('Error fetching log files:', error);
  }
}

listHttpLogFiles();
```

## 🎣 Error Handling

The client enhances errors thrown during API calls. You can catch errors and access additional information:

```typescript
import SapClient from 'sap-integration-suite-client';

const client = new SapClient(/* config */);

try {
  // Attempt an API call that might fail
  await client.integrationContent.deleteIntegrationPackage('non-existent-package');
} catch (error: any) {
  console.error('API Call Failed!');
  
  // Check for specific details from the enhanced error object
  if (error.statusCode) {
    console.error(`  Status Code: ${error.statusCode}`); // e.g., 404
  }
  if (error.statusText) {
    console.error(`  Status Text: ${error.statusText}`); // e.g., Not Found
  }
  if (error.responseData) {
    // The raw response data from the API (often contains SAP error details)
    console.error('  Response Data:', JSON.stringify(error.responseData, null, 2)); 
  }
  // The original error message is also available
  console.error(`  Error Message: ${error.message}`);
}
```

## ❓ Troubleshooting

-   **OAuth Errors**: Double-check your Client ID, Client Secret, and Token URL. Ensure the OAuth client has the necessary permissions assigned in your SAP BTP subaccount/cockpit for the APIs you intend to use (e.g., roles like `IntegrationAdmin`, `IntegrationDeveloper`, `MonitoringDataRead`).
-   **404 Not Found**: Verify the `baseUrl` is correct and includes the `/api/v1` path. Ensure the specific resource you are requesting exists (e.g., the package ID, message GUID).
-   **403 Forbidden**: This usually indicates missing permissions for the OAuth client or the user associated with it. Check the required roles in the SAP Integration Suite documentation for the specific API endpoint.
-   **CSRF Token Errors**: The client handles CSRF tokens automatically for write operations (POST, PUT, DELETE). If you encounter CSRF errors, it might indicate an issue with the initial token fetch or session handling. Ensure the base URL is correct and allows the initial `GET` request with the `X-CSRF-Token: Fetch` header.
-   **Type Errors**: Ensure you are using TypeScript and have installed the package correctly. Use the exported types (e.g., `IntegrationContentTypes`, `MessageProcessingLogsTypes`) for better type safety.
-   **Neo vs. Cloud Foundry**: Some APIs (Secure Parameters, Certificate-to-User Mappings, External Logging, Data Archiving) are environment-specific (often Neo-only or CF-only). The client attempts to handle 404s gracefully for some Neo-only APIs when run in CF, but be mindful of environment limitations.

## 📄 License

MIT © [Contiva GmbH](https://contiva.com)

---

Developed by Contiva GmbH - Experts in SAP Integration and API Management. 