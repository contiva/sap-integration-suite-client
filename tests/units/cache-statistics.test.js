/**
 * Unit tests for extended cache statistics functionality
 * 
 * @module cache-statistics.test
 */

const { CacheManager } = require('../../dist/core/cache-manager');

describe('CacheManager - Extended Statistics', () => {
  let cacheManager;
  const mockRedisConnectionString = 'localhost:6379,password=test,ssl=False';

  beforeEach(() => {
    cacheManager = new CacheManager(mockRedisConnectionString, false);
  });

  afterEach(async () => {
    await cacheManager.close();
  });

  describe('getStatsByPattern', () => {
    it('should return empty stats when cache is disabled', async () => {
      const result = await cacheManager.getStatsByPattern('sap:*');
      expect(result).toEqual({
        totalKeys: 0,
        totalSize: 0,
      });
    });

    it('should return empty stats when not connected', async () => {
      const enabledManager = new CacheManager(mockRedisConnectionString, true);
      const result = await enabledManager.getStatsByPattern('sap:*');
      expect(result).toEqual({
        totalKeys: 0,
        totalSize: 0,
      });
      await enabledManager.close();
    });

    it('should return empty stats for pattern without matches', async () => {
      const result = await cacheManager.getStatsByPattern('non-existent-pattern:*');
      expect(result).toEqual({
        totalKeys: 0,
        totalSize: 0,
      });
    });
  });

  describe('getCacheHealth', () => {
    it('should return unhealthy status when cache is disabled', async () => {
      const result = await cacheManager.getCacheHealth();
      expect(result).toBeDefined();
      expect(result.isHealthy).toBe(false);
      expect(result.connectionStatus).toBe('disconnected');
      expect(result.totalKeys).toBe(0);
      expect(result.uptime).toBe(0);
    });

    it('should return unhealthy status when not connected', async () => {
      const enabledManager = new CacheManager(mockRedisConnectionString, true);
      const result = await enabledManager.getCacheHealth();
      expect(result).toBeDefined();
      expect(result.isHealthy).toBe(false);
      expect(result.connectionStatus).toBe('disconnected');
      expect(result.totalKeys).toBe(0);
      expect(result.uptime).toBe(0);
      await enabledManager.close();
    });

    it('should return health status with correct structure', async () => {
      const result = await cacheManager.getCacheHealth();
      expect(result).toHaveProperty('isHealthy');
      expect(result).toHaveProperty('connectionStatus');
      expect(result).toHaveProperty('totalKeys');
      expect(result).toHaveProperty('uptime');
      expect(['connected', 'disconnected', 'error']).toContain(result.connectionStatus);
      expect(typeof result.isHealthy).toBe('boolean');
      expect(typeof result.totalKeys).toBe('number');
      expect(typeof result.uptime).toBe('number');
    });
  });

  describe('getStatsByEndpoint', () => {
    it('should return empty stats when cache is disabled', async () => {
      const result = await cacheManager.getStatsByEndpoint('/IntegrationPackages');
      expect(result).toEqual({
        endpoint: '/IntegrationPackages',
        keys: 0,
        totalSize: 0,
      });
    });

    it('should return empty stats when not connected', async () => {
      const enabledManager = new CacheManager(mockRedisConnectionString, true);
      const result = await enabledManager.getStatsByEndpoint('/IntegrationPackages');
      expect(result).toEqual({
        endpoint: '/IntegrationPackages',
        keys: 0,
        totalSize: 0,
      });
      await enabledManager.close();
    });

    it('should return empty stats for endpoint without matches', async () => {
      const result = await cacheManager.getStatsByEndpoint('/NonExistentEndpoint');
      expect(result).toEqual({
        endpoint: '/NonExistentEndpoint',
        keys: 0,
        totalSize: 0,
      });
    });

    it('should return stats with correct structure', async () => {
      const result = await cacheManager.getStatsByEndpoint('/IntegrationPackages');
      expect(result).toHaveProperty('endpoint');
      expect(result).toHaveProperty('keys');
      expect(result).toHaveProperty('totalSize');
      expect(result.endpoint).toBe('/IntegrationPackages');
      expect(typeof result.keys).toBe('number');
      expect(typeof result.totalSize).toBe('number');
    });
  });
});



