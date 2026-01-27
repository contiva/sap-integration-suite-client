/**
 * Smoke tests for queue deduplication
 * Basic verification that the deduplication logic works
 */

const { CacheManager } = require('../../dist/core/cache-manager');

describe('CacheManager - Queue Deduplication Smoke Tests', () => {
  let cacheManager;
  const mockRedisConnectionString = 'localhost:6379,password=test,ssl=False';

  beforeEach(() => {
    cacheManager = new CacheManager(mockRedisConnectionString, false);
  });

  afterEach(async () => {
    await cacheManager.close();
  });

  it('should have _revalidationInProgress Map initialized', () => {
    expect(cacheManager['_revalidationInProgress']).toBeDefined();
    expect(cacheManager['_revalidationInProgress'] instanceof Map).toBe(true);
    expect(cacheManager['_revalidationInProgress'].size).toBe(0);
  });

  it('should have _cleanupRevalidation method', () => {
    expect(typeof cacheManager['_cleanupRevalidation']).toBe('function');
  });

  it('should not break existing behavior when cache is disabled', async () => {
    const mockFetch = jest.fn(() => Promise.resolve({ data: 'test' }));
    
    await cacheManager.revalidateInBackground(
      'test-key',
      mockFetch,
      { ttl: 3600, revalidateAfter: 1800 }
    );
    
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should cleanup after revalidation completes', () => {
    const key = 'test-cleanup-key';
    
    cacheManager['_revalidationInProgress'].set(key, Promise.resolve());
    expect(cacheManager['_revalidationInProgress'].has(key)).toBe(true);
    
    cacheManager['_cleanupRevalidation'](key);
    
    expect(cacheManager['_revalidationInProgress'].has(key)).toBe(false);
  });

  it('should handle cleanup of non-existent key gracefully', () => {
    expect(() => {
      cacheManager['_cleanupRevalidation']('non-existent-key');
    }).not.toThrow();
  });
});
