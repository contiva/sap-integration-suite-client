/**
 * Unit tests for cache warming functionality
 * 
 * @module cache-warming.test
 */

const { CacheManager } = require('../../dist/core/cache-manager');
const { IntegrationContentClient } = require('../../dist/wrapper/integration-content-client');

describe('CacheManager - warmCache', () => {
  let cacheManager;
  const mockRedisConnectionString = 'localhost:6379,password=test,ssl=False';

  beforeEach(() => {
    cacheManager = new CacheManager(mockRedisConnectionString, false);
  });

  afterEach(async () => {
    await cacheManager.close();
  });

  it('should return { success: 0, failed: N, duration: 0 } when cache is disabled', async () => {
    const endpoints = [
      {
        key: 'test-key-1',
        fetchFn: async () => ({ data: 'test1' }),
      },
      {
        key: 'test-key-2',
        fetchFn: async () => ({ data: 'test2' }),
      },
    ];

    const result = await cacheManager.warmCache(endpoints);
    expect(result).toEqual({
      success: 0,
      failed: 2,
      duration: 0,
      errors: [
        { key: 'test-key-1', error: 'Cache not available' },
        { key: 'test-key-2', error: 'Cache not available' },
      ],
    });
  });

  it('should return { success: 0, failed: 0, duration: 0 } when endpoints array is empty', async () => {
    const result = await cacheManager.warmCache([]);
    expect(result).toMatchObject({
      success: 0,
      failed: 0,
      duration: 0,
    });
    // errors array is optional and may or may not be present
  });

  it('should return { success: 0, failed: N, duration: 0 } when not connected', async () => {
    const enabledManager = new CacheManager(mockRedisConnectionString, true);
    const endpoints = [
      {
        key: 'test-key-1',
        fetchFn: async () => ({ data: 'test1' }),
      },
    ];

    const result = await enabledManager.warmCache(endpoints);
    expect(result).toEqual({
      success: 0,
      failed: 1,
      duration: 0,
      errors: [
        { key: 'test-key-1', error: 'Cache not available' },
      ],
    });
    await enabledManager.close();
  });
});

describe('IntegrationContentClient - warmCache', () => {
  it('should return 0 when cache manager is not available', async () => {
    const mockApi = {};
    const client = new IntegrationContentClient(mockApi, null, '');

    const result = await client.warmCache();
    expect(result).toBe(0);
  });

  it('should return 0 when cache manager is not ready', async () => {
    const mockApi = {};
    const mockCacheManager = {
      isReady: () => false,
    };
    const client = new IntegrationContentClient(mockApi, mockCacheManager, '');

    const result = await client.warmCache();
    expect(result).toBe(0);
  });

  it('should return 0 when hostname is not available', async () => {
    const mockApi = {};
    const mockCacheManager = {
      isReady: () => true,
      warmCache: jest.fn(),
    };
    const client = new IntegrationContentClient(mockApi, mockCacheManager, '');

    const result = await client.warmCache();
    expect(result).toBe(0);
    expect(mockCacheManager.warmCache).not.toHaveBeenCalled();
  });
});



