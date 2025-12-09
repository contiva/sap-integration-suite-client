/**
 * Unit Test für die IntegrationContentClient.downloadIntegrationFlow Methode
 * 
 * Dieser Test überprüft, ob das Herunterladen eines Integrationsflows über 
 * die SapClient-Bibliothek korrekt funktioniert, nachdem die Änderungen an
 * der getOAuthToken-Methode vorgenommen wurden.
 */

const SapClient = require('../../dist').default;
const AdmZip = require('adm-zip');
require('dotenv').config();

describe('SAP Integration Flow Download Tests', () => {
  // Set a longer timeout since API calls can take time
  jest.setTimeout(30000);
  
  let client;
  
  beforeAll(() => {
    // Skip tests if baseUrl is not configured
    if (!process.env.SAP_BASE_URL) {
      console.warn('Skipping tests: SAP_BASE_URL not configured');
      return;
    }

    // Create a new SapClient instance before running tests
    client = new SapClient({
      baseUrl: process.env.SAP_BASE_URL,
      oauthClientId: process.env.SAP_OAUTH_CLIENT_ID,
      oauthClientSecret: process.env.SAP_OAUTH_CLIENT_SECRET,
      oauthTokenUrl: process.env.SAP_OAUTH_TOKEN_URL,
    });
    
    // Ensure we're in development mode
    process.env.NODE_ENV = 'development';
  });
  
  test('should successfully download the first available integration flow artifact as a ZIP file', async () => {
    // Skip if client is not initialized (missing config)
    if (!client) {
      console.warn('Skipping test: Client not initialized');
      return;
    }
    // First, get all integration packages
    const packages = await client.integrationContent.getIntegrationPackages();
    expect(packages).toBeDefined();
    expect(Array.isArray(packages)).toBe(true);
    expect(packages.length).toBeGreaterThan(0);
    
    // Get the first package that has integration flows
    let firstPackage = null;
    let flows = [];
    
    for (const pkg of packages) {
      const packageFlows = await client.integrationContent.getIntegrationFlows(pkg.Id);
      if (packageFlows && packageFlows.length > 0) {
        firstPackage = pkg;
        flows = packageFlows;
        break;
      }
    }
    
    expect(firstPackage).not.toBeNull();
    expect(flows.length).toBeGreaterThan(0);
    
    console.log(`Using package: ${firstPackage.Name} (${firstPackage.Id})`);
    console.log(`Found ${flows.length} integration flows`);
    
    // Get the first flow
    const firstFlow = flows[0];
    expect(firstFlow).toBeDefined();
    expect(firstFlow.Id).toBeDefined();
    
    console.log(`Downloading flow: ${firstFlow.Name} (${firstFlow.Id})`);
    
    // Download the flow as a ZIP file
    const zipFile = await client.integrationContent.downloadIntegrationFlow(firstFlow.Id);
    
    // Check basic properties of the response
    expect(zipFile).toBeTruthy();
    expect(Buffer.isBuffer(zipFile)).toBe(true);
    expect(zipFile.length).toBeGreaterThan(0);
    
    // Check if the buffer is a valid ZIP file by attempting to read its structure
    let isValidZip = true;
    try {
      const zip = new AdmZip(zipFile);
      const zipEntries = zip.getEntries();
      console.log(`ZIP file contains ${zipEntries.length} entries`);
      
      // Optional: Log some details about the first few entries
      if (zipEntries.length > 0) {
        console.log('Sample ZIP entries:');
        for (let i = 0; i < Math.min(5, zipEntries.length); i++) {
          console.log(`- ${zipEntries[i].entryName} (${zipEntries[i].header.size} bytes)`);
        }
      }
    } catch (error) {
      console.error('Error validating ZIP file:', error.message);
      isValidZip = false;
    }
    
    expect(isValidZip).toBe(true);
    console.log(`Successfully downloaded and validated ZIP for flow: ${firstFlow.Id}`);
    console.log(`ZIP file size: ${zipFile.length} bytes`);
  });
}); 