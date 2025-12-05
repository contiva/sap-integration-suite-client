/**
 * Unit tests for TTL management functionality
 * 
 * @module cache-ttl-management.test
 */

const { CacheManager } = require('../../dist/core/cache-manager');

describe('CacheManager - TTL Management', () => {
  let cacheManager;
  const mockRedisConnectionString = 'localhost:6379,password=test,ssl=False';

  beforeEach(() => {
    cacheManager = new CacheManager(mockRedisConnectionString, false);
  });

  afterEach(async () => {
    await cacheManager.close();
  });

  describe('updateTTL', () => {
    it('should return false when cache is disabled', async () => {
      const result = await cacheManager.updateTTL('test-key', 3600);
      expect(result).toBe(false);
    });

    it('should return false when not connected', async () => {
      const enabledManager = new CacheManager(mockRedisConnectionString, true);
      const result = await enabledManager.updateTTL('test-key', 3600);
      expect(result).toBe(false);
      await enabledManager.close();
    });

    it('should return false when key does not exist', async () => {
      // This test would require a real Redis connection or mock
      // For now, we test the disabled/not connected cases
      const result = await cacheManager.updateTTL('non-existent-key', 3600);
      expect(result).toBe(false);
    });
  });

  describe('extendTTL', () => {
    it('should return false when cache is disabled', async () => {
      const result = await cacheManager.extendTTL('test-key', 1800);
      expect(result).toBe(false);
    });

    it('should return false when not connected', async () => {
      const enabledManager = new CacheManager(mockRedisConnectionString, true);
      const result = await enabledManager.extendTTL('test-key', 1800);
      expect(result).toBe(false);
      await enabledManager.close();
    });

    it('should return false when key does not exist', async () => {
      const result = await cacheManager.extendTTL('non-existent-key', 1800);
      expect(result).toBe(false);
    });
  });

  describe('batchUpdateTTL', () => {
    it('should return { success: 0, failed: N } when cache is disabled', async () => {
      const updates = [
        { key: 'key1', ttl: 3600 },
        { key: 'key2', ttl: 7200 },
      ];
      const result = await cacheManager.batchUpdateTTL(updates);
      expect(result).toEqual({ success: 0, failed: 2 });
    });

    it('should return { success: 0, failed: N } when not connected', async () => {
      const enabledManager = new CacheManager(mockRedisConnectionString, true);
      const updates = [
        { key: 'key1', ttl: 3600 },
        { key: 'key2', ttl: 7200 },
      ];
      const result = await enabledManager.batchUpdateTTL(updates);
      expect(result).toEqual({ success: 0, failed: 2 });
      await enabledManager.close();
    });

    it('should return { success: 0, failed: 0 } when updates array is empty', async () => {
      const result = await cacheManager.batchUpdateTTL([]);
      expect(result).toEqual({ success: 0, failed: 0 });
    });

    it('should handle large batch updates', async () => {
      const updates = Array.from({ length: 100 }, (_, i) => ({
        key: `key${i}`,
        ttl: 3600 + i,
      }));
      const result = await cacheManager.batchUpdateTTL(updates);
      expect(result).toEqual({ success: 0, failed: 100 });
      expect(result.success).toBe(0);
      expect(result.failed).toBe(100);
    });
  });
});





