/**
 * Unit tests for Queue Deduplication in CacheManager
 * Tests concurrent revalidations, memory management, and edge cases
 */

const { CacheManager } = require('../../dist/core/cache-manager');

// Helper to simulate delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('CacheManager - Queue Deduplication Unit Tests', () => {
  let cacheManager;
  const mockRedisConnectionString = 'localhost:6379,password=test,ssl=False';

  beforeEach(() => {
    cacheManager = new CacheManager(mockRedisConnectionString, false);
    // Mock cache as enabled and connected for testing
    cacheManager['isEnabled'] = true;
    cacheManager['isConnected'] = true;
  });

  afterEach(async () => {
    cacheManager['isEnabled'] = false;
    cacheManager['isConnected'] = false;
    await cacheManager.close();
  });

  describe('1. Deduplication Logic', () => {
    it('should prevent duplicate revalidations for the same key', async () => {
      const mockFetch = jest.fn(async () => {
        await delay(100); // Simulate slow SAP call
        return { data: 'test' };
      });

      const key = 'test-key-duplicate';
      const options = { ttl: 3600, revalidateAfter: 1800 };

      // Trigger 5 revalidations for the same key in parallel
      await Promise.all([
        cacheManager.revalidateInBackground(key, mockFetch, options),
        cacheManager.revalidateInBackground(key, mockFetch, options),
        cacheManager.revalidateInBackground(key, mockFetch, options),
        cacheManager.revalidateInBackground(key, mockFetch, options),
        cacheManager.revalidateInBackground(key, mockFetch, options),
      ]);

      // Wait for queue processing
      await delay(200);

      // mockFetch should only be called once
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should allow revalidations for different keys in parallel', async () => {
      const mockFetch1 = jest.fn(async () => ({ data: 'test1' }));
      const mockFetch2 = jest.fn(async () => ({ data: 'test2' }));
      const mockFetch3 = jest.fn(async () => ({ data: 'test3' }));

      const options = { ttl: 3600, revalidateAfter: 1800 };

      await Promise.all([
        cacheManager.revalidateInBackground('key-1', mockFetch1, options),
        cacheManager.revalidateInBackground('key-2', mockFetch2, options),
        cacheManager.revalidateInBackground('key-3', mockFetch3, options),
      ]);

      await delay(200);

      expect(mockFetch1).toHaveBeenCalledTimes(1);
      expect(mockFetch2).toHaveBeenCalledTimes(1);
      expect(mockFetch3).toHaveBeenCalledTimes(1);
    });

    it('should track multiple concurrent revalidations in _revalidationInProgress', async () => {
      const mockFetch = jest.fn(async () => {
        await delay(50); // Short delay
        return { data: 'test' };
      });

      const options = { ttl: 3600, revalidateAfter: 1800 };

      // Start 3 revalidations for different keys
      const promises = [
        cacheManager.revalidateInBackground('key-a', mockFetch, options),
        cacheManager.revalidateInBackground('key-b', mockFetch, options),
        cacheManager.revalidateInBackground('key-c', mockFetch, options),
      ];

      // Check that at least one is being tracked
      await delay(20); // Small delay to let first task register
      const inProgressSize = cacheManager['_revalidationInProgress'].size;
      expect(inProgressSize).toBeGreaterThanOrEqual(1);

      // Wait for all promises to complete
      await Promise.all(promises);
      
      // Since the queue processes sequentially with 1s delay between tasks,
      // we need to wait for: 3 tasks * (50ms fetch + 1000ms delay) + buffer
      // Total: ~3200ms
      await delay(3500);

      // After completion, map should be empty
      expect(cacheManager['_revalidationInProgress'].size).toBe(0);
    });

    it('should skip duplicate revalidation if already in progress', async () => {
      const mockFetch = jest.fn(async () => {
        await delay(200); // Long running task
        return { data: 'test' };
      });

      const key = 'slow-key';
      const options = { ttl: 3600, revalidateAfter: 1800 };

      // Start first revalidation
      const promise1 = cacheManager.revalidateInBackground(key, mockFetch, options);
      
      // Wait a bit to ensure it's registered
      await delay(10);
      
      // Try to start second revalidation (should be skipped)
      await cacheManager.revalidateInBackground(key, mockFetch, options);

      await promise1;
      await delay(300);

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('2. Memory Management', () => {
    it('should cleanup key from _revalidationInProgress after successful revalidation', async () => {
      const mockFetch = jest.fn(async () => ({ data: 'test' }));
      const key = 'cleanup-success-key';

      await cacheManager.revalidateInBackground(key, mockFetch, { ttl: 3600, revalidateAfter: 1800 });
      await delay(100);

      expect(cacheManager['_revalidationInProgress'].has(key)).toBe(false);
    });

    it('should cleanup key from _revalidationInProgress after failed revalidation', async () => {
      const mockFetch = jest.fn(async () => {
        throw new Error('SAP Error');
      });
      const key = 'cleanup-error-key';

      await cacheManager.revalidateInBackground(key, mockFetch, { ttl: 3600, revalidateAfter: 1800 });
      await delay(100);

      expect(cacheManager['_revalidationInProgress'].has(key)).toBe(false);
    });

    it('should not have memory leaks with many sequential revalidations', async () => {
      const mockFetch = jest.fn(async () => ({ data: 'test' }));
      const options = { ttl: 3600, revalidateAfter: 1800 };

      // Run 50 sequential revalidations
      for (let i = 0; i < 50; i++) {
        await cacheManager.revalidateInBackground(`key-${i}`, mockFetch, options);
      }

      await delay(200);

      // All should be cleaned up
      expect(cacheManager['_revalidationInProgress'].size).toBe(0);
    });

    it('should clear _revalidationInProgress on close()', async () => {
      // Create a mock client to trigger cleanup logic in close()
      cacheManager['client'] = { 
        removeAllListeners: jest.fn(),
        quit: jest.fn().mockResolvedValue('OK')
      };

      const mockFetch = jest.fn(async () => {
        await delay(100);
        return { data: 'test' };
      });

      // Start a revalidation
      cacheManager.revalidateInBackground('key-close', mockFetch, { ttl: 3600, revalidateAfter: 1800 });
      await delay(10);

      // Verify key is in map
      expect(cacheManager['_revalidationInProgress'].size).toBeGreaterThan(0);

      // Close cache manager
      await cacheManager.close();

      // Map should be cleared
      expect(cacheManager['_revalidationInProgress'].size).toBe(0);
    });
  });

  describe('3. Error Handling', () => {
    it('should handle errors during revalidation without breaking deduplication', async () => {
      let callCount = 0;
      const mockFetch = jest.fn(async () => {
        callCount++;
        if (callCount === 1) {
          throw new Error('First call fails');
        }
        return { data: 'success' };
      });

      const key = 'error-handling-key';
      const options = { ttl: 3600, revalidateAfter: 1800 };

      // First call will fail
      await cacheManager.revalidateInBackground(key, mockFetch, options);
      await delay(100);

      // Second call should work (not deduplicated because first finished)
      await cacheManager.revalidateInBackground(key, mockFetch, options);
      await delay(100);

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(cacheManager['_revalidationInProgress'].size).toBe(0);
    });

    it('should handle 429 rate limit errors gracefully', async () => {
      const error429 = new Error('Too Many Requests');
      error429.status = 429;

      const mockFetch = jest.fn(async () => {
        throw error429;
      });

      const key = 'rate-limit-key';

      await cacheManager.revalidateInBackground(key, mockFetch, { ttl: 3600, revalidateAfter: 1800 });
      await delay(100);

      // Should cleanup even after 429 error
      expect(cacheManager['_revalidationInProgress'].has(key)).toBe(false);
    });

    it('should handle timeout errors gracefully', async () => {
      const mockFetch = jest.fn(async () => {
        // Simulate a task that takes longer than expected
        await delay(200);
        throw new Error('Operation timed out');
      });

      const key = 'timeout-key';

      await cacheManager.revalidateInBackground(key, mockFetch, { ttl: 3600, revalidateAfter: 1800 });
      
      // Wait for the task to complete (200ms for fetch + some buffer)
      await delay(300);

      // Should cleanup after timeout error
      expect(cacheManager['_revalidationInProgress'].has(key)).toBe(false);
    });

    it('should not throw when revalidating with invalid fetch function', async () => {
      const key = 'invalid-fetch-key';

      await expect(async () => {
        await cacheManager.revalidateInBackground(key, null, { ttl: 3600, revalidateAfter: 1800 });
        await delay(100);
      }).not.toThrow();

      expect(cacheManager['_revalidationInProgress'].has(key)).toBe(false);
    });
  });

  describe('4. Edge Cases', () => {
    it('should handle empty key gracefully', async () => {
      const mockFetch = jest.fn(async () => ({ data: 'test' }));

      await expect(async () => {
        await cacheManager.revalidateInBackground('', mockFetch, { ttl: 3600, revalidateAfter: 1800 });
        await delay(100);
      }).not.toThrow();
    });

    it('should handle very long keys', async () => {
      const mockFetch = jest.fn(async () => ({ data: 'test' }));
      const longKey = 'x'.repeat(1000);

      await cacheManager.revalidateInBackground(longKey, mockFetch, { ttl: 3600, revalidateAfter: 1800 });
      await delay(100);

      expect(cacheManager['_revalidationInProgress'].has(longKey)).toBe(false);
    });

    it('should handle special characters in keys', async () => {
      const mockFetch = jest.fn(async () => ({ data: 'test' }));
      const specialKey = 'key:with:colons/and\\slashes';

      await cacheManager.revalidateInBackground(specialKey, mockFetch, { ttl: 3600, revalidateAfter: 1800 });
      await delay(100);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(cacheManager['_revalidationInProgress'].has(specialKey)).toBe(false);
    });

    it('should handle cache disabled state', async () => {
      cacheManager['isEnabled'] = false;
      const mockFetch = jest.fn(async () => ({ data: 'test' }));

      await cacheManager.revalidateInBackground('key', mockFetch, { ttl: 3600, revalidateAfter: 1800 });
      await delay(100);

      expect(mockFetch).not.toHaveBeenCalled();
      expect(cacheManager['_revalidationInProgress'].size).toBe(0);
    });

    it('should handle cache disconnected state', async () => {
      cacheManager['isConnected'] = false;
      const mockFetch = jest.fn(async () => ({ data: 'test' }));

      await cacheManager.revalidateInBackground('key', mockFetch, { ttl: 3600, revalidateAfter: 1800 });
      await delay(100);

      expect(mockFetch).not.toHaveBeenCalled();
      expect(cacheManager['_revalidationInProgress'].size).toBe(0);
    });
  });

  describe('5. Cleanup Helper Function', () => {
    it('should have _cleanupRevalidation method', () => {
      expect(typeof cacheManager['_cleanupRevalidation']).toBe('function');
    });

    it('should remove key from map when cleanup is called', () => {
      const key = 'manual-cleanup-key';
      cacheManager['_revalidationInProgress'].set(key, Promise.resolve());

      expect(cacheManager['_revalidationInProgress'].has(key)).toBe(true);

      cacheManager['_cleanupRevalidation'](key);

      expect(cacheManager['_revalidationInProgress'].has(key)).toBe(false);
    });

    it('should handle cleanup of non-existent key', () => {
      expect(() => {
        cacheManager['_cleanupRevalidation']('non-existent-key');
      }).not.toThrow();
    });

    it('should handle cleanup with undefined key', () => {
      expect(() => {
        cacheManager['_cleanupRevalidation'](undefined);
      }).not.toThrow();
    });
  });

  describe('6. Regression Tests', () => {
    it('should not break existing revalidation behavior without duplicates', async () => {
      const mockFetch = jest.fn(async () => ({ data: 'test' }));

      await cacheManager.revalidateInBackground('key-1', mockFetch, { ttl: 3600, revalidateAfter: 1800 });
      await delay(50);
      await cacheManager.revalidateInBackground('key-2', mockFetch, { ttl: 3600, revalidateAfter: 1800 });
      await delay(50);

      await delay(200);

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should maintain queue order for different keys', async () => {
      const callOrder = [];
      
      const mockFetch1 = jest.fn(async () => {
        callOrder.push(1);
        return { data: 'test1' };
      });
      
      const mockFetch2 = jest.fn(async () => {
        callOrder.push(2);
        return { data: 'test2' };
      });
      
      const mockFetch3 = jest.fn(async () => {
        callOrder.push(3);
        return { data: 'test3' };
      });

      await cacheManager.revalidateInBackground('key-1', mockFetch1, { ttl: 3600, revalidateAfter: 1800 });
      await cacheManager.revalidateInBackground('key-2', mockFetch2, { ttl: 3600, revalidateAfter: 1800 });
      await cacheManager.revalidateInBackground('key-3', mockFetch3, { ttl: 3600, revalidateAfter: 1800 });

      await delay(500);

      expect(callOrder).toEqual([1, 2, 3]);
    });

    it('should not interfere with differential updates', async () => {
      const mockFetch = jest.fn(async () => ({
        d: {
          results: [
            { Id: '1', Name: 'Artifact 1' },
            { Id: '2', Name: 'Artifact 2' },
          ],
        },
      }));

      const key = 'differential-key';
      const options = {
        ttl: 3600,
        revalidateAfter: 1800,
        enableDifferential: true,
        isCollectionEndpoint: true,
      };

      await cacheManager.revalidateInBackground(key, mockFetch, options);
      await delay(100);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(cacheManager['_revalidationInProgress'].has(key)).toBe(false);
    });
  });
});
