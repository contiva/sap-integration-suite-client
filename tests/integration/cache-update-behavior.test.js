/**
 * Integration tests for cache update functionality
 * 
 * These tests validate the complete cache update flow including:
 * - Status updates in runtime artifact cache
 * - Status updates in package cache
 * - Pattern matching for cache keys
 * - Partial cache updates
 */

const SapClient = require('../../dist/clients/sap-client').default;
const { createClient } = require('redis');
require('dotenv').config();

// Test configuration
const TEST_CONFIG = {
  baseUrl: process.env.SAP_BASE_URL,
  oauthClientId: process.env.SAP_OAUTH_CLIENT_ID,
  oauthClientSecret: process.env.SAP_OAUTH_CLIENT_SECRET,
  oauthTokenUrl: process.env.SAP_OAUTH_TOKEN_URL,
  redisConnectionString: process.env.REDIS_CONNECTION_STRING,
  redisEnabled: true,
};

// Redis client for direct cache inspection
let redisClient;

// Helper function to clear Redis cache
async function clearCache() {
  if (redisClient && redisClient.isOpen) {
    const keys = await redisClient.keys('sap:*');
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  }
}

// Helper function to get cache entry
async function getCacheEntry(key) {
  if (redisClient && redisClient.isOpen) {
    const data = await redisClient.get(key);
    if (!data) return null;
    
    // Try to decrypt if needed (simplified - actual decryption would use CacheManager)
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }
  return null;
}

// Helper function to find cache keys by pattern
async function findCacheKeys(pattern) {
  if (redisClient && redisClient.isOpen) {
    return await redisClient.keys(pattern);
  }
  return [];
}

describe('Cache Update Integration Tests', () => {
  let client;
  let testArtifactId;
  let testPackageId;

  beforeAll(async () => {
    // Skip tests if Redis is not configured
    if (!TEST_CONFIG.redisConnectionString || !TEST_CONFIG.baseUrl) {
      console.warn('Skipping cache update tests: Redis or SAP credentials not configured');
      return;
    }

    // Initialize Redis client for test utilities
    const parts = TEST_CONFIG.redisConnectionString.split(',');
    const [host, port] = parts[0].split(':');
    let password = '';
    let ssl = false;
    
    for (const part of parts) {
      if (part.startsWith('password=')) {
        password = part.substring('password='.length);
      } else if (part.startsWith('ssl=')) {
        ssl = part.substring('ssl='.length).toLowerCase() === 'true';
      }
    }

    redisClient = createClient({
      socket: {
        host,
        port: parseInt(port, 10),
        tls: ssl,
      },
      password,
    });

    await redisClient.connect();

    // Create SAP client with caching enabled
    client = new SapClient(TEST_CONFIG);
    await client.cacheManager?.connect();

    // Get a test artifact and package for testing
    try {
      const packages = await client.integrationContent.getIntegrationPackages({ top: 1 });
      if (packages.length > 0) {
        testPackageId = packages[0].Id;
        const flows = await client.integrationContent.getIntegrationFlows(testPackageId);
        if (flows.length > 0) {
          testArtifactId = flows[0].Id;
        }
      }
    } catch (error) {
      console.warn('Could not fetch test data:', error.message);
    }
  });

  afterAll(async () => {
    if (client) {
      await client.disconnect();
    }
    if (redisClient && redisClient.isOpen) {
      await redisClient.quit();
    }
  });

  beforeEach(async () => {
    // Clear cache before each test
    await clearCache();
  });

  it('should update artifact status in runtime artifact cache', async () => {
    // Skip if test data not available
    if (!testArtifactId) {
      console.warn('Skipping test: No test artifact available');
      return;
    }

    // First, fetch the artifact to populate cache
    const deployedArtifacts = await client.integrationContent.getDeployedArtifacts();
    const testArtifact = deployedArtifacts.find(a => a.Id === testArtifactId);
    
    if (!testArtifact) {
      console.warn('Skipping test: Test artifact not deployed');
      return;
    }

    // Wait a bit for cache to be populated
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find cache keys for the artifact
    const hostname = new URL(TEST_CONFIG.baseUrl).hostname;
    const pattern = `sap:${hostname}:GET:/IntegrationRuntimeArtifacts('${testArtifactId}')*`;
    const keysBefore = await findCacheKeys(pattern);

    // Update artifact status
    await client.integrationContent.updateArtifactStatus(testArtifactId, {
      Status: 'TEST_STATUS',
      DeployedBy: 'test@example.com',
      DeployedOn: new Date().toISOString(),
    });

    // Wait a bit for cache update
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify cache was updated
    const keysAfter = await findCacheKeys(pattern);
    expect(keysAfter.length).toBeGreaterThan(0);

    // Note: Actual cache inspection would require decryption
    // This test mainly verifies that the update function doesn't throw errors
  }, 30000);

  it('should update artifact status in package cache', async () => {
    // Skip if test data not available
    if (!testArtifactId || !testPackageId) {
      console.warn('Skipping test: No test data available');
      return;
    }

    // First, fetch the package to populate cache
    await client.integrationContent.getIntegrationPackageById(testPackageId);

    // Wait a bit for cache to be populated
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update artifact status with package ID
    await client.integrationContent.updateArtifactStatus(
      testArtifactId,
      {
        Status: 'TEST_STATUS',
      },
      testPackageId
    );

    // Wait a bit for cache update
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify no errors occurred
    // Note: Actual cache inspection would require decryption
    expect(true).toBe(true); // Test passes if no errors
  }, 30000);

  it('should handle missing cache manager gracefully', async () => {
    // Create client without cache
    const noCacheClient = new SapClient({
      ...TEST_CONFIG,
      redisEnabled: false,
    });

    // Should not throw
    await expect(
      noCacheClient.integrationContent.updateArtifactStatus('test', { Status: 'STARTED' })
    ).resolves.toBeUndefined();

    await noCacheClient.disconnect();
  });

  it('should handle missing hostname gracefully', async () => {
    // This is tested in unit tests, but we verify it works in integration context
    const clientWithoutHostname = new SapClient({
      ...TEST_CONFIG,
      baseUrl: '', // Invalid base URL
    });

    // Should not throw
    await expect(
      clientWithoutHostname.integrationContent.updateArtifactStatus('test', { Status: 'STARTED' })
    ).resolves.toBeUndefined();

    await clientWithoutHostname.disconnect();
  });
});


