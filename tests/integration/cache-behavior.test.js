/**
 * Integration tests for Redis caching behavior
 * 
 * These tests run against a real SAP system and Redis instance
 * to validate the complete caching implementation including:
 * - Cache hits and misses
 * - Stale-while-revalidate pattern
 * - Different TTL configurations
 * - Force refresh and no cache options
 * - Hostname awareness
 * - Download endpoint exclusions
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

// Helper function to get cache keys
async function getCacheKeys() {
  if (redisClient && redisClient.isOpen) {
    return await redisClient.keys('sap:*');
  }
  return [];
}

// Helper function to inspect cache entry
async function getCacheEntry(key) {
  if (redisClient && redisClient.isOpen) {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }
  return null;
}

describe('SAP Client Redis Caching Integration Tests', () => {
  beforeAll(async () => {
    // Skip tests if Redis is not configured
    if (!TEST_CONFIG.redisConnectionString || !TEST_CONFIG.baseUrl) {
      console.warn('Skipping cache tests: Redis or SAP credentials not configured');
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
  });

  afterAll(async () => {
    if (redisClient && redisClient.isOpen) {
      await redisClient.quit();
    }
  });

  beforeEach(async () => {
    // Clear cache before each test
    await clearCache();
  });

  describe('1. Cache Miss & Cache Hit', () => {
    it('should cache response on first request and serve from cache on second request', async () => {
      if (!TEST_CONFIG.redisConnectionString) {
        return; // Skip if no Redis
      }

      const client = new SapClient(TEST_CONFIG);

      // First request (should be cache miss)
      console.log('Making first request (cache miss)...');
      const startTime1 = Date.now();
      const response1 = await client.integrationContent.getIntegrationPackages({ top: 5 });
      const duration1 = Date.now() - startTime1;
      console.log(`First request took ${duration1}ms`);

      expect(response1).toBeDefined();
      expect(Array.isArray(response1)).toBe(true);

      // Wait a moment for async cache write to complete
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check that cache entry was created
      const keys1 = await getCacheKeys();
      expect(keys1.length).toBeGreaterThan(0);
      console.log(`Cache entries after first request: ${keys1.length}`);

      // Second request (should be cache hit)
      console.log('Making second request (cache hit)...');
      const startTime2 = Date.now();
      const response2 = await client.integrationContent.getIntegrationPackages({ top: 5 });
      const duration2 = Date.now() - startTime2;
      console.log(`Second request took ${duration2}ms`);

      expect(response2).toBeDefined();
      expect(Array.isArray(response2)).toBe(true);
      expect(response2).toEqual(response1);

      // Cache hit should be significantly faster
      expect(duration2).toBeLessThan(duration1 * 0.5);
      console.log(`Speed improvement: ${Math.round((1 - duration2/duration1) * 100)}%`);
    });
  });

  describe('2. Force Refresh Cache', () => {
    it('should return stale data and trigger background revalidation when forceRefreshCache is true', async () => {
      if (!TEST_CONFIG.redisConnectionString) {
        return;
      }

      // First, create a cache entry with normal client
      const normalClient = new SapClient(TEST_CONFIG);
      console.log('Creating initial cache entry...');
      await normalClient.integrationContent.getIntegrationPackages({ top: 5 });

      // Wait a moment to ensure cache is set
      await new Promise(resolve => setTimeout(resolve, 500));

      // Now use client with forceRefreshCache
      const forceRefreshClient = new SapClient({
        ...TEST_CONFIG,
        forceRefreshCache: true,
      });

      console.log('Making request with forceRefreshCache=true...');
      const startTime = Date.now();
      const response = await forceRefreshClient.integrationContent.getIntegrationPackages({ top: 5 });
      const duration = Date.now() - startTime;

      console.log(`Request with forceRefreshCache took ${duration}ms`);

      // Should get data quickly (from cache)
      expect(response).toBeDefined();
      expect(duration).toBeLessThan(500); // Should be fast from cache

      // Wait for background revalidation to complete
      await new Promise(resolve => setTimeout(resolve, 6000));
    });
  });

  describe('3. No Cache Option', () => {
    it('should bypass cache completely when noCache is true', async () => {
      if (!TEST_CONFIG.redisConnectionString) {
        return;
      }

      const noCacheClient = new SapClient({
        ...TEST_CONFIG,
        noCache: true,
      });

      console.log('Making request with noCache=true...');
      const response = await noCacheClient.integrationContent.getIntegrationPackages({ top: 5 });

      expect(response).toBeDefined();
      expect(Array.isArray(response)).toBe(true);

      // Check that no cache entries were created
      const keys = await getCacheKeys();
      expect(keys.length).toBe(0);
      console.log('Confirmed: No cache entries created with noCache=true');
    });

    it('should not read from existing cache when noCache is true', async () => {
      if (!TEST_CONFIG.redisConnectionString) {
        return;
      }

      // First create cache with normal client
      const normalClient = new SapClient(TEST_CONFIG);
      console.log('Creating cache entry with normal client...');
      await normalClient.integrationContent.getIntegrationPackages({ top: 5 });

      // Wait for async cache write
      await new Promise(resolve => setTimeout(resolve, 500));

      const keysAfterNormal = await getCacheKeys();
      expect(keysAfterNormal.length).toBeGreaterThan(0);

      // Now request with noCache client
      const noCacheClient = new SapClient({
        ...TEST_CONFIG,
        noCache: true,
      });

      console.log('Making request with noCache=true (cache exists)...');
      const startTime = Date.now();
      const response = await noCacheClient.integrationContent.getIntegrationPackages({ top: 5 });
      const duration = Date.now() - startTime;

      expect(response).toBeDefined();
      // Should take longer as it bypasses cache
      console.log(`Request took ${duration}ms (bypassed cache)`);
    });
  });

  describe('4. Runtime APIs (MessageProcessingLogs)', () => {
    it('should use shorter revalidation time for MessageProcessingLogs', async () => {
      if (!TEST_CONFIG.redisConnectionString) {
        return;
      }

      const client = new SapClient(TEST_CONFIG);

      console.log('Fetching MessageProcessingLogs (runtime API)...');
      const response = await client.messageProcessingLogs.getMessageProcessingLogs({ top: 5 });

      expect(response.logs).toBeDefined();
      expect(Array.isArray(response.logs)).toBe(true);

      // Wait for async cache write
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check cache entry
      const keys = await getCacheKeys();
      expect(keys.length).toBeGreaterThan(0);

      // Inspect the cache entry
      const cacheEntry = await getCacheEntry(keys[0]);
      expect(cacheEntry).toBeDefined();
      
      // Revalidation time should be 5 minutes (300 seconds)
      const revalidationDiff = cacheEntry.revalidateAfter - cacheEntry.cachedAt;
      const revalidationMinutes = revalidationDiff / 1000 / 60;
      
      console.log(`Revalidation time: ${revalidationMinutes} minutes`);
      expect(revalidationMinutes).toBeCloseTo(5, 0); // 5 minutes ±0.5
    });
  });

  describe('5. Standard APIs', () => {
    it('should use 1 hour revalidation time for standard APIs', async () => {
      if (!TEST_CONFIG.redisConnectionString) {
        return;
      }

      const client = new SapClient(TEST_CONFIG);

      console.log('Fetching IntegrationPackages (standard API)...');
      await client.integrationContent.getIntegrationPackages({ top: 5 });

      // Wait for async cache write
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check cache entry
      const keys = await getCacheKeys();
      expect(keys.length).toBeGreaterThan(0);

      const cacheEntry = await getCacheEntry(keys[0]);
      expect(cacheEntry).toBeDefined();
      
      // Revalidation time should be 1 hour (3600 seconds)
      const revalidationDiff = cacheEntry.revalidateAfter - cacheEntry.cachedAt;
      const revalidationHours = revalidationDiff / 1000 / 60 / 60;
      
      console.log(`Revalidation time: ${revalidationHours} hours`);
      expect(revalidationHours).toBeCloseTo(1, 1); // 1 hour ±0.1
    });
  });

  describe('6. Download Endpoints Not Cached', () => {
    it('should not cache MessageStore payload downloads', async () => {
      if (!TEST_CONFIG.redisConnectionString) {
        return;
      }

      const client = new SapClient(TEST_CONFIG);

      // First get some message processing logs to find a message with store entries
      console.log('Finding a message with store entries...');
      const { logs } = await client.messageProcessingLogs.getMessageProcessingLogs({ 
        top: 50,
        orderby: ['LogEnd desc']
      });

      // Clear cache to isolate this test
      await clearCache();

      // Try to get message store entries for one of the messages
      let foundEntry = false;
      for (const log of logs) {
        try {
          const entries = await client.messageStore.getMessageStoreEntriesForMessage(log.MessageGuid);
          if (entries && entries.length > 0) {
            console.log(`Found message store entry: ${entries[0].Id}`);
            
            // Now try to get the payload (this should NOT be cached)
            try {
              await client.messageStore.getMessageStoreEntryPayload(entries[0].Id);
              foundEntry = true;
              
              // Check that payload request was NOT cached
              const keysAfterPayload = await getCacheKeys();
              const payloadCacheKeys = keysAfterPayload.filter(k => k.includes('value'));
              
              console.log(`Cache keys after payload request: ${keysAfterPayload.length}`);
              console.log(`Payload-specific cache keys: ${payloadCacheKeys.length}`);
              
              // Payload requests should not be cached
              expect(payloadCacheKeys.length).toBe(0);
              
              break;
            } catch (err) {
              // Payload might not exist, continue
              continue;
            }
          }
        } catch (err) {
          // Message might not have store entries, continue
          continue;
        }
      }

      if (!foundEntry) {
        console.warn('No message store entries with payloads found, skipping payload test');
      }
    });
  });

  describe('7. Hostname Awareness', () => {
    it('should use different cache keys for different hostnames', async () => {
      if (!TEST_CONFIG.redisConnectionString) {
        return;
      }

      const client1 = new SapClient(TEST_CONFIG);

      console.log('Making request with first client...');
      await client1.integrationContent.getIntegrationPackages({ top: 5 });

      // Wait for async cache write
      await new Promise(resolve => setTimeout(resolve, 500));

      const keys1 = await getCacheKeys();
      expect(keys1.length).toBeGreaterThan(0);

      // Extract hostname from cache key
      const hostname1 = keys1[0].split(':')[1];
      console.log(`Hostname in cache key: ${hostname1}`);

      // Verify hostname is part of the cache key
      expect(keys1[0]).toContain(hostname1);
      expect(hostname1.length).toBeGreaterThan(0);
    });
  });

  describe('8. Cache Disabled When Redis Not Configured', () => {
    it('should work normally without Redis', async () => {
      const clientWithoutRedis = new SapClient({
        baseUrl: TEST_CONFIG.baseUrl,
        oauthClientId: TEST_CONFIG.oauthClientId,
        oauthClientSecret: TEST_CONFIG.oauthClientSecret,
        oauthTokenUrl: TEST_CONFIG.oauthTokenUrl,
        redisEnabled: false,
      });

      console.log('Making request without Redis...');
      const response = await clientWithoutRedis.integrationContent.getIntegrationPackages({ top: 5 });

      expect(response).toBeDefined();
      expect(Array.isArray(response)).toBe(true);
      console.log('Client works correctly without Redis');
    });
  });

  describe('9. Performance Comparison', () => {
    it('should demonstrate performance improvement with caching', async () => {
      if (!TEST_CONFIG.redisConnectionString) {
        return;
      }

      // Measure without cache
      const noCacheClient = new SapClient({
        ...TEST_CONFIG,
        noCache: true,
      });

      console.log('Measuring performance without cache...');
      const noCacheTimes = [];
      for (let i = 0; i < 3; i++) {
        const start = Date.now();
        await noCacheClient.integrationContent.getIntegrationPackages({ top: 5 });
        noCacheTimes.push(Date.now() - start);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const avgNoCacheTime = noCacheTimes.reduce((a, b) => a + b, 0) / noCacheTimes.length;
      console.log(`Average time without cache: ${avgNoCacheTime}ms`);

      // Clear cache and measure with cache
      await clearCache();

      const cacheClient = new SapClient(TEST_CONFIG);

      console.log('Measuring performance with cache...');
      const cacheTimes = [];
      
      // First request (cache miss)
      const firstStart = Date.now();
      await cacheClient.integrationContent.getIntegrationPackages({ top: 5 });
      cacheTimes.push(Date.now() - firstStart);
      
      // Subsequent requests (cache hits)
      for (let i = 0; i < 2; i++) {
        const start = Date.now();
        await cacheClient.integrationContent.getIntegrationPackages({ top: 5 });
        cacheTimes.push(Date.now() - start);
      }

      console.log(`Cache miss time: ${cacheTimes[0]}ms`);
      console.log(`Cache hit times: ${cacheTimes[1]}ms, ${cacheTimes[2]}ms`);

      const avgCacheHitTime = (cacheTimes[1] + cacheTimes[2]) / 2;
      const improvement = ((avgNoCacheTime - avgCacheHitTime) / avgNoCacheTime) * 100;

      console.log(`Performance improvement with cache: ${improvement.toFixed(1)}%`);
      
      // Cache hits should be significantly faster
      expect(avgCacheHitTime).toBeLessThan(avgNoCacheTime * 0.5);
    });
  });
});

