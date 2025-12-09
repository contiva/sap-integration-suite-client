/**
 * Integration tests for cache statistics
 * 
 * These tests validate:
 * - CacheManager.getStats() (Admin/Debug API)
 * - CacheManager.getKeyInfo()
 * - Performance considerations
 */

const { CacheManager } = require('../../dist/core/cache-manager');
const { createClient } = require('redis');
require('dotenv').config();

// Test configuration
const TEST_CONFIG = {
  redisConnectionString: process.env.REDIS_CONNECTION_STRING,
};

// Redis client for direct cache inspection
let redisClient;

// Helper function to clear Redis cache (only test keys to avoid conflicts with parallel tests)
async function clearCache() {
  if (redisClient && redisClient.isOpen) {
    // Only clear test keys, not all sap:* keys (to avoid conflicts with parallel tests)
    const keys = await redisClient.keys('sap:test:*');
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  }
}

// Helper function to generate unique test keys (prevents test isolation issues)
function generateTestKey(prefix = 'test') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

describe('Cache Statistics Integration Tests', () => {
  let cacheManager;

  beforeAll(async () => {
    // Skip tests if Redis is not configured
    if (!TEST_CONFIG.redisConnectionString) {
      console.warn('Skipping cache statistics tests: Redis not configured');
      return;
    }

    // Initialize Redis client for test utilities
    // Parse connection string (supports both Azure format and redis:// URLs)
    let connectionPart = TEST_CONFIG.redisConnectionString.split(',')[0];
    
    // Remove protocol prefix if present (redis:// or rediss://)
    connectionPart = connectionPart.replace(/^redis[s]?:\/\//, '');
    
    if (!connectionPart || !connectionPart.includes(':')) {
      throw new Error(`Invalid Redis connection string format: ${TEST_CONFIG.redisConnectionString}`);
    }
    
    const [host, port] = connectionPart.split(':');
    
    if (!host || !host.trim() || !port || !port.trim()) {
      throw new Error(`Invalid Redis connection string format. Missing host or port: ${TEST_CONFIG.redisConnectionString}`);
    }
    
    // Validate and parse port
    const portNumber = parseInt(port.trim(), 10);
    if (isNaN(portNumber) || portNumber < 0 || portNumber > 65535) {
      throw new Error(`Invalid Redis port: ${port.trim()}. Port must be a number between 0 and 65535.`);
    }
    
    const parts = TEST_CONFIG.redisConnectionString.split(',');
    let password = '';
    let ssl = false;
    
    // Check if SSL is indicated by protocol (rediss://)
    if (TEST_CONFIG.redisConnectionString.startsWith('rediss://')) {
      ssl = true;
    }
    
    for (const part of parts) {
      if (part.startsWith('password=')) {
        password = part.substring('password='.length);
      } else if (part.startsWith('ssl=')) {
        ssl = part.substring('ssl='.length).toLowerCase() === 'true';
      }
    }

    redisClient = createClient({
      socket: {
        host: host.trim(),
        port: portNumber,
        tls: ssl,
      },
      password,
    });

    await redisClient.connect();

    // Create cache manager
    cacheManager = new CacheManager(TEST_CONFIG.redisConnectionString, true);
    await cacheManager.connect();
  });

  afterAll(async () => {
    try {
      if (cacheManager) {
        await Promise.race([
          cacheManager.close(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
        ]).catch(() => {}); // Ignore timeout errors
      }
      if (redisClient && redisClient.isOpen) {
        await Promise.race([
          redisClient.quit(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
        ]).catch(() => {}); // Ignore timeout errors
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  }, 10000); // 10 second timeout for cleanup

  // No beforeEach - keys are unique (timestamp + random), so no conflicts between tests
  // Cleanup happens in afterAll if needed

  describe('CacheManager.getStats()', () => {
    test('should return stats for empty cache', async () => {
      if (!cacheManager) {
        console.warn('Skipping test: Cache manager not available');
        return;
      }

      // Note: In parallel test execution, other tests may have created keys
      // So we just verify that getStats() works correctly, not that cache is empty
      const stats = await cacheManager.getStats();
      expect(stats).toBeDefined();
      expect(stats.totalKeys).toBeGreaterThanOrEqual(0);
      expect(stats.totalSize).toBeGreaterThanOrEqual(0);
      // If there are keys, they should be from other parallel tests (which is fine)
    });

    test('should return stats for cache with entries', async () => {
      if (!cacheManager) {
        console.warn('Skipping test: Cache manager not available');
        return;
      }

      // Use unique test ID to avoid conflicts with other tests
      const testId = `stats-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      
      // Create multiple cache entries
      const now = Date.now();
      for (let i = 0; i < 5; i++) {
        const key = `sap:test:stats:${testId}:${i}`;
        await cacheManager.set(key, { data: { Id: `artifact${i}`, Status: 'STARTED' } }, {
          ttl: 3600,
          revalidateAfter: 1800,
        });
        // Small delay to ensure different cachedAt timestamps
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      const stats = await cacheManager.getStats();
      expect(stats).toBeDefined();
      // Note: getStats() counts ALL keys with pattern 'sap:*', not just test keys
      // So we check that at least 5 keys exist (our test keys plus potentially others from other tests)
      // In test isolation scenarios, we need to account for keys from other tests
      expect(stats.totalKeys).toBeGreaterThanOrEqual(5);
      expect(stats.totalSize).toBeGreaterThan(0);
      
      // Average TTL should be around 3600 seconds
      if (stats.averageTtl !== undefined) {
        expect(stats.averageTtl).toBeGreaterThan(3500);
        expect(stats.averageTtl).toBeLessThan(3700);
      }

      // Oldest and newest entries should be defined
      if (stats.oldestEntry) {
        expect(stats.oldestEntry.key).toBeDefined();
        expect(stats.oldestEntry.age).toBeGreaterThanOrEqual(0);
      }

      if (stats.newestEntry) {
        expect(stats.newestEntry.key).toBeDefined();
        expect(stats.newestEntry.age).toBeGreaterThanOrEqual(0);
      }
    });

    test('should handle performance considerations (warn about expensive operation)', async () => {
      if (!cacheManager) {
        console.warn('Skipping test: Cache manager not available');
        return;
      }

      // Use unique test ID to avoid conflicts with other tests
      const testId = generateTestKey('stats-perf');
      
      // Create many cache entries to test performance
      const numEntries = 50;
      for (let i = 0; i < numEntries; i++) {
        const key = `sap:test:stats:perf:${testId}:${i}`;
        await cacheManager.set(key, { data: { Id: `artifact${i}` } }, {
          ttl: 3600,
          revalidateAfter: 1800,
        });
      }

      // Measure time for getStats (should be relatively slow due to MEMORY USAGE)
      const start = Date.now();
      const stats = await cacheManager.getStats();
      const duration = Date.now() - start;

      // Note: getStats() counts ALL keys with pattern 'sap:*', not just test keys
      // So we check that at least numEntries keys exist (our test keys)
      expect(stats.totalKeys).toBeGreaterThanOrEqual(numEntries);
      
      // This operation should take some time (MEMORY USAGE is expensive)
      // But we don't enforce a strict limit as it depends on Redis performance
      console.log(`getStats() took ${duration}ms for ${numEntries} keys`);
      expect(duration).toBeGreaterThan(0);
    }, 30000);

    test('should return empty stats when cache manager is not ready', async () => {
      const disconnectedManager = new CacheManager('invalid:connection', false);
      const stats = await disconnectedManager.getStats();
      expect(stats.totalKeys).toBe(0);
      expect(stats.totalSize).toBe(0);
    });
  });

  describe('CacheManager.getKeyInfo()', () => {
    test('should return info for existing key', async () => {
      if (!cacheManager) {
        console.warn('Skipping test: Cache manager not available');
        return;
      }

      const testKey = 'sap:test:keyinfo';
      const ttl = 3600;
      await cacheManager.set(testKey, { data: { Status: 'STARTED' } }, {
        ttl,
        revalidateAfter: 1800,
      });

      const info = await cacheManager.getKeyInfo(testKey);
      expect(info).toBeDefined();
      expect(info.key).toBe(testKey);
      expect(info.exists).toBe(true);
      expect(info.size).toBeGreaterThan(0);
      expect(info.ttl).toBeGreaterThan(3500); // Should be close to 3600
      expect(info.age).toBeGreaterThanOrEqual(0);
      expect(info.expiresAt).toBeGreaterThan(Date.now());
      expect(info.revalidateAfter).toBeGreaterThan(Date.now());
    });

    test('should return info for non-existent key', async () => {
      if (!cacheManager) {
        console.warn('Skipping test: Cache manager not available');
        return;
      }

      const info = await cacheManager.getKeyInfo('sap:test:nonexistent');
      expect(info).toBeDefined();
      expect(info.exists).toBe(false);
      expect(info.size).toBe(0);
      expect(info.ttl).toBe(-1);
      expect(info.age).toBe(0);
    });

    test('should handle expired key', async () => {
      if (!cacheManager) {
        console.warn('Skipping test: Cache manager not available');
        return;
      }

      const testKey = 'sap:test:expired';
      // Set with very short TTL
      await cacheManager.set(testKey, { data: { Status: 'STARTED' } }, {
        ttl: 1, // 1 second
        revalidateAfter: 1, // Must be positive number
      });

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 1100));

      const info = await cacheManager.getKeyInfo(testKey);
      // Key might still exist but TTL should be -2 (expired) or -1 (doesn't exist)
      expect(info).toBeDefined();
      // TTL can be -1 (doesn't exist) or -2 (expired)
      expect([-1, -2]).toContain(info.ttl);
    }, 5000);

    test('should handle performance considerations (MEMORY USAGE is expensive)', async () => {
      if (!cacheManager) {
        console.warn('Skipping test: Cache manager not available');
        return;
      }

      // Use unique test ID to avoid conflicts with other tests
      const testId = generateTestKey('keyinfo-perf');
      const testKey = `sap:test:keyinfo:perf:${testId}`;
      await cacheManager.set(testKey, { data: { Status: 'STARTED' } }, {
        ttl: 3600,
        revalidateAfter: 1800,
      });

      // Measure time for getKeyInfo (should be relatively slow due to MEMORY USAGE)
      const start = Date.now();
      const info = await cacheManager.getKeyInfo(testKey);
      const duration = Date.now() - start;

      expect(info.exists).toBe(true);
      
      // MEMORY USAGE is expensive, but should still complete
      console.log(`getKeyInfo() took ${duration}ms`);
      expect(duration).toBeGreaterThan(0);
    });

    test('should return null when cache manager is not ready', async () => {
      const disconnectedManager = new CacheManager('invalid:connection', false);
      const info = await disconnectedManager.getKeyInfo('sap:test:key');
      expect(info).toBeNull();
    });
  });
});

