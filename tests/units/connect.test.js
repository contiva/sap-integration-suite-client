/**
 * SAP Connection Unit Test
 * 
 * This test verifies that we can connect to the SAP system using the
 * credentials in the .env file and retrieve integration packages.
 */

const SapClient = require('../../dist').default;
require('dotenv').config();

describe('SAP Connection Tests', () => {
  // Set a longer timeout since API calls can take time
  jest.setTimeout(30000);
  
  let client;
  
  beforeAll(() => {
    // Create a new SapClient instance before running tests
    client = new SapClient();
  });
  
  test('should successfully initialize the client', () => {
    expect(client).toBeDefined();
    expect(client.integrationContent).toBeDefined();
    expect(client.messageProcessingLogs).toBeDefined();
    expect(client.logFiles).toBeDefined();
    expect(client.messageStore).toBeDefined();
    expect(client.securityContent).toBeDefined();
  });
  
  test('should successfully connect and retrieve integration packages', async () => {
    // Call the API to get integration packages
    const packages = await client.integrationContent.getIntegrationPackages();
    
    // Verify the response
    expect(packages).toBeDefined();
    expect(Array.isArray(packages)).toBe(true);
    
    // If packages exist, check some properties
    if (packages.length > 0) {
      const firstPackage = packages[0];
      expect(firstPackage.Id).toBeDefined();
      expect(firstPackage.Name).toBeDefined();
      
      console.log(`Found ${packages.length} integration packages`);
      console.log(`First package: ${firstPackage.Name} (${firstPackage.Id})`);
    } else {
      console.log('No integration packages found, but connection was successful');
    }
  });
  
  test('should be able to get service endpoints', async () => {
    // Fetch service endpoints
    const endpoints = await client.integrationContent.getServiceEndpoints();
    
    // Verify response structure
    expect(endpoints).toBeDefined();
    expect(Array.isArray(endpoints)).toBe(true);
    
    if (endpoints.length > 0) {
      const firstEndpoint = endpoints[0];
      expect(firstEndpoint.Id).toBeDefined();
      expect(firstEndpoint.Name).toBeDefined();
      
      console.log(`Found ${endpoints.length} service endpoints`);
      console.log(`First endpoint: ${firstEndpoint.Name}`);
    } else {
      console.log('No service endpoints found, but the API call was successful');
    }
  });
  
  test('should handle authentication errors properly when credentials are wrong', async () => {
    // Create a client with invalid credentials
    const invalidClient = new SapClient({
      baseUrl: process.env.SAP_BASE_URL,
      oauthClientId: 'invalid-client-id',
      oauthClientSecret: 'invalid-client-secret',
      oauthTokenUrl: process.env.SAP_OAUTH_TOKEN_URL,
    });
    
    // The API call should fail with auth error
    await expect(invalidClient.integrationContent.getIntegrationPackages())
      .rejects.toThrow();
  });
});
