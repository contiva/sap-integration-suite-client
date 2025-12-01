/**
 * Unit tests for cache update functionality
 * 
 * @module cache-update.test
 */

const { CacheManager } = require('../../dist/core/cache-manager');
const { IntegrationContentClient } = require('../../dist/wrapper/integration-content-client');
const { updateArtifactInCache, updateArtifactInPackageCache } = require('../../dist/utils/cache-update-helper');

describe('CacheManager - findKeysByPattern', () => {
  let cacheManager;
  const mockRedisConnectionString = 'localhost:6379,password=test,ssl=False';

  beforeEach(() => {
    cacheManager = new CacheManager(mockRedisConnectionString, false);
  });

  afterEach(async () => {
    await cacheManager.close();
  });

  it('should return empty array when cache is disabled', async () => {
    const keys = await cacheManager.findKeysByPattern('sap:*');
    expect(keys).toEqual([]);
  });

  it('should return empty array when not connected', async () => {
    const enabledManager = new CacheManager(mockRedisConnectionString, true);
    const keys = await enabledManager.findKeysByPattern('sap:*');
    expect(keys).toEqual([]);
    await enabledManager.close();
  });
});

describe('CacheManager - updatePartial', () => {
  let cacheManager;
  const mockRedisConnectionString = 'localhost:6379,password=test,ssl=False';

  beforeEach(() => {
    cacheManager = new CacheManager(mockRedisConnectionString, false);
  });

  afterEach(async () => {
    await cacheManager.close();
  });

  it('should return false when cache is disabled', async () => {
    const result = await cacheManager.updatePartial('test-key', (data) => data);
    expect(result).toBe(false);
  });

  it('should return false when not connected', async () => {
    const enabledManager = new CacheManager(mockRedisConnectionString, true);
    const result = await enabledManager.updatePartial('test-key', (data) => data);
    expect(result).toBe(false);
    await enabledManager.close();
  });
});

describe('updateArtifactInCache', () => {
  const artifactId = 'TestArtifact';
  const statusData = {
    Status: 'STARTED',
    DeployedBy: 'test@example.com',
    DeployedOn: '2024-01-01T00:00:00Z',
  };

  it('should update artifact in direct array format', () => {
    const cachedData = {
      data: [
        { Id: artifactId, Name: 'Test', Status: 'STOPPED' },
        { Id: 'OtherArtifact', Name: 'Other', Status: 'STARTED' },
      ],
      cachedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
      revalidateAfter: Date.now() + 1800000,
    };

    const result = updateArtifactInCache(cachedData, artifactId, statusData);
    
    expect(result).not.toBeNull();
    expect(result.data[0].Status).toBe('STARTED');
    expect(result.data[0].DeployedBy).toBe('test@example.com');
    expect(result.data[0].DeployedOn).toBe('2024-01-01T00:00:00Z');
    expect(result.data[1].Status).toBe('STARTED'); // Unchanged
  });

  it('should update artifact in OData v2 format', () => {
    const cachedData = {
      data: {
        d: {
          results: [
            { Id: artifactId, Name: 'Test', Status: 'STOPPED' },
          ],
        },
      },
      cachedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
      revalidateAfter: Date.now() + 1800000,
    };

    const result = updateArtifactInCache(cachedData, artifactId, statusData);
    
    expect(result).not.toBeNull();
    expect(result.data.d.results[0].Status).toBe('STARTED');
  });

  it('should update artifact in OData v4 format', () => {
    const cachedData = {
      data: {
        value: [
          { Id: artifactId, Name: 'Test', Status: 'STOPPED' },
        ],
      },
      cachedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
      revalidateAfter: Date.now() + 1800000,
    };

    const result = updateArtifactInCache(cachedData, artifactId, statusData);
    
    expect(result).not.toBeNull();
    expect(result.data.value[0].Status).toBe('STARTED');
  });

  it('should update single artifact object', () => {
    const cachedData = {
      data: { Id: artifactId, Name: 'Test', Status: 'STOPPED' },
      cachedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
      revalidateAfter: Date.now() + 1800000,
    };

    const result = updateArtifactInCache(cachedData, artifactId, statusData);
    
    expect(result).not.toBeNull();
    expect(result.data.Status).toBe('STARTED');
  });

  it('should return null when artifact not found', () => {
    const cachedData = {
      data: [
        { Id: 'OtherArtifact', Name: 'Other', Status: 'STARTED' },
      ],
      cachedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
      revalidateAfter: Date.now() + 1800000,
    };

    const result = updateArtifactInCache(cachedData, artifactId, statusData);
    
    expect(result).toBeNull();
  });

  it('should handle case-insensitive ID matching', () => {
    const cachedData = {
      data: [
        { id: artifactId, Name: 'Test', Status: 'STOPPED' },
      ],
      cachedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
      revalidateAfter: Date.now() + 1800000,
    };

    const result = updateArtifactInCache(cachedData, artifactId, statusData);
    
    expect(result).not.toBeNull();
    expect(result.data[0].Status).toBe('STARTED');
  });
});

describe('updateArtifactInPackageCache', () => {
  const artifactId = 'TestArtifact';
  const statusData = {
    Status: 'STARTED',
  };

  it('should update artifact in package IntegrationDesigntimeArtifacts array', () => {
    const cachedData = {
      data: [
        {
          Id: 'TestPackage',
          Name: 'Test Package',
          IntegrationDesigntimeArtifacts: [
            { Id: artifactId, Name: 'Test', Status: 'STOPPED' },
          ],
        },
      ],
      cachedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
      revalidateAfter: Date.now() + 1800000,
    };

    const result = updateArtifactInPackageCache(cachedData, artifactId, statusData);
    
    expect(result).not.toBeNull();
    expect(result.data[0].IntegrationDesigntimeArtifacts[0].Status).toBe('STARTED');
  });

  it('should return null when artifact not found in any package', () => {
    const cachedData = {
      data: [
        {
          Id: 'TestPackage',
          Name: 'Test Package',
          IntegrationDesigntimeArtifacts: [
            { Id: 'OtherArtifact', Name: 'Other', Status: 'STOPPED' },
          ],
        },
      ],
      cachedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
      revalidateAfter: Date.now() + 1800000,
    };

    const result = updateArtifactInPackageCache(cachedData, artifactId, statusData);
    
    expect(result).toBeNull();
  });
});

describe('IntegrationContentClient - updateArtifactStatus', () => {
  it('should handle missing cache manager gracefully', async () => {
    // Mock API
    const mockApi = {};
    const client = new IntegrationContentClient(mockApi, null, '');
    
    // Should not throw
    await expect(
      client.updateArtifactStatus('test', { Status: 'STARTED' })
    ).resolves.toBeUndefined();
  });

  it('should handle missing hostname gracefully', async () => {
    // Mock API
    const mockApi = {};
    const mockCacheManager = {
      isReady: () => true,
      findKeysByPattern: jest.fn(),
    };
    
    const client = new IntegrationContentClient(mockApi, mockCacheManager, '');
    
    // Should not throw
    await expect(
      client.updateArtifactStatus('test', { Status: 'STARTED' })
    ).resolves.toBeUndefined();
    
    // Should not call findKeysByPattern
    expect(mockCacheManager.findKeysByPattern).not.toHaveBeenCalled();
  });

  describe('Input validation', () => {
    it('should reject empty artifactId', async () => {
      const mockApi = {};
      const mockCacheManager = {
        isReady: () => true,
        findKeysByPattern: jest.fn(),
      };
      
      const client = new IntegrationContentClient(mockApi, mockCacheManager, 'test-hostname');
      
      // Should not throw and not call findKeysByPattern
      await expect(
        client.updateArtifactStatus('', { Status: 'STARTED' })
      ).resolves.toBeUndefined();
      
      expect(mockCacheManager.findKeysByPattern).not.toHaveBeenCalled();
    });

    it('should reject null artifactId', async () => {
      const mockApi = {};
      const mockCacheManager = {
        isReady: () => true,
        findKeysByPattern: jest.fn(),
      };
      
      const client = new IntegrationContentClient(mockApi, mockCacheManager, 'test-hostname');
      
      await expect(
        client.updateArtifactStatus(null, { Status: 'STARTED' })
      ).resolves.toBeUndefined();
      
      expect(mockCacheManager.findKeysByPattern).not.toHaveBeenCalled();
    });

    it('should reject empty statusData', async () => {
      const mockApi = {};
      const mockCacheManager = {
        isReady: () => true,
        findKeysByPattern: jest.fn(),
      };
      
      const client = new IntegrationContentClient(mockApi, mockCacheManager, 'test-hostname');
      
      await expect(
        client.updateArtifactStatus('test', {})
      ).resolves.toBeUndefined();
      
      expect(mockCacheManager.findKeysByPattern).not.toHaveBeenCalled();
    });

    it('should reject null statusData', async () => {
      const mockApi = {};
      const mockCacheManager = {
        isReady: () => true,
        findKeysByPattern: jest.fn(),
      };
      
      const client = new IntegrationContentClient(mockApi, mockCacheManager, 'test-hostname');
      
      await expect(
        client.updateArtifactStatus('test', null)
      ).resolves.toBeUndefined();
      
      expect(mockCacheManager.findKeysByPattern).not.toHaveBeenCalled();
    });

    it('should reject non-string artifactId', async () => {
      const mockApi = {};
      const mockCacheManager = {
        isReady: () => true,
        findKeysByPattern: jest.fn(),
      };
      
      const client = new IntegrationContentClient(mockApi, mockCacheManager, 'test-hostname');
      
      await expect(
        client.updateArtifactStatus(123, { Status: 'STARTED' })
      ).resolves.toBeUndefined();
      
      expect(mockCacheManager.findKeysByPattern).not.toHaveBeenCalled();
    });
  });

  describe('Pattern matching', () => {
    it('should match cache keys with hash', async () => {
      const mockApi = {};
      const mockKeys = [
        `sap:test-hostname:GET:/IntegrationRuntimeArtifacts('TestArtifact')`,
        `sap:test-hostname:GET:/IntegrationRuntimeArtifacts('TestArtifact'):a1b2c3d4`,
      ];
      const mockCacheManager = {
        isReady: () => true,
        findKeysByPattern: jest.fn().mockResolvedValue(mockKeys),
        updatePartial: jest.fn().mockResolvedValue(true),
      };
      
      const client = new IntegrationContentClient(mockApi, mockCacheManager, 'test-hostname');
      
      await client.updateArtifactStatus('TestArtifact', { Status: 'STARTED' });
      
      // Should find keys matching the pattern (with and without hash)
      expect(mockCacheManager.findKeysByPattern).toHaveBeenCalledWith(
        `sap:test-hostname:GET:/IntegrationRuntimeArtifacts('TestArtifact')*`
      );
      
      // Should update both keys
      expect(mockCacheManager.updatePartial).toHaveBeenCalledTimes(2);
    });

    it('should only match keys with correct artifactId', async () => {
      const mockApi = {};
      const mockKeys = [
        `sap:test-hostname:GET:/IntegrationRuntimeArtifacts('TestArtifact')`,
        `sap:test-hostname:GET:/IntegrationRuntimeArtifacts('OtherArtifact')`, // Should not match
      ];
      const mockCacheManager = {
        isReady: () => true,
        findKeysByPattern: jest.fn().mockResolvedValue(mockKeys),
        updatePartial: jest.fn().mockResolvedValue(true),
      };
      
      const client = new IntegrationContentClient(mockApi, mockCacheManager, 'test-hostname');
      
      await client.updateArtifactStatus('TestArtifact', { Status: 'STARTED' });
      
      // Should only update the matching key
      expect(mockCacheManager.updatePartial).toHaveBeenCalledTimes(1);
    });

    it('should match package cache keys with correct packageId', async () => {
      const mockApi = {};
      const mockKeys = [
        `sap:test-hostname:GET:/IntegrationPackages('TestPackage')`,
        `sap:test-hostname:GET:/IntegrationPackages('TestPackage'):hash`,
      ];
      const mockCacheManager = {
        isReady: () => true,
        findKeysByPattern: jest.fn().mockResolvedValue(mockKeys),
        updatePartial: jest.fn().mockResolvedValue(true),
      };
      
      const client = new IntegrationContentClient(mockApi, mockCacheManager, 'test-hostname');
      
      await client.updateArtifactStatus('TestArtifact', { Status: 'STARTED' }, 'TestPackage');
      
      // Should find both runtime and package patterns
      expect(mockCacheManager.findKeysByPattern).toHaveBeenCalledTimes(2);
    });
  });

  describe('Logging', () => {
    it('should log warning when no keys found', async () => {
      const mockApi = {};
      const mockCacheManager = {
        isReady: () => true,
        findKeysByPattern: jest.fn().mockResolvedValue([]),
      };
      
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const client = new IntegrationContentClient(mockApi, mockCacheManager, 'test-hostname');
      
      await client.updateArtifactStatus('TestArtifact', { Status: 'STARTED' });
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('No cache keys found for artifact TestArtifact')
      );
      
      consoleSpy.mockRestore();
    });

    it('should log success when keys updated', async () => {
      const mockApi = {};
      const mockKeys = [
        `sap:test-hostname:GET:/IntegrationRuntimeArtifacts('TestArtifact')`,
      ];
      const mockCacheManager = {
        isReady: () => true,
        findKeysByPattern: jest.fn().mockResolvedValue(mockKeys),
        updatePartial: jest.fn().mockResolvedValue(true),
      };
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const client = new IntegrationContentClient(mockApi, mockCacheManager, 'test-hostname');
      
      await client.updateArtifactStatus('TestArtifact', { Status: 'STARTED' });
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Updated 1/1 cache keys for artifact TestArtifact')
      );
      
      consoleSpy.mockRestore();
    });
  });
});


