/**
 * Unit tests for cache update helper functions
 * 
 * @module cache-update-helper.test
 */

const { addArtifactToCacheArray, removeArtifactFromCacheArray } = require('../../dist/utils/cache-update-helper');

describe('addArtifactToCacheArray', () => {
  const newArtifact = { Id: 'NewArtifact', Name: 'New Artifact', Status: 'STARTED' };

  describe('Direct Array Format', () => {
    it('should add artifact to direct array format', () => {
      const cachedData = {
        data: [
          { Id: 'Artifact1', Name: 'Artifact 1' },
          { Id: 'Artifact2', Name: 'Artifact 2' },
        ],
        cachedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        revalidateAfter: Date.now() + 1800000,
      };

      const result = addArtifactToCacheArray(cachedData, newArtifact);

      expect(result).not.toBeNull();
      expect(result.data).toHaveLength(3);
      expect(result.data[2].Id).toBe('NewArtifact');
    });
  });

  describe('OData v2 Format', () => {
    it('should add artifact to OData v2 format (d.results)', () => {
      const cachedData = {
        data: {
          d: {
            results: [
              { Id: 'Artifact1', Name: 'Artifact 1' },
            ],
          },
        },
        cachedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        revalidateAfter: Date.now() + 1800000,
      };

      const result = addArtifactToCacheArray(cachedData, newArtifact);

      expect(result).not.toBeNull();
      expect(result.data.d.results).toHaveLength(2);
      expect(result.data.d.results[1].Id).toBe('NewArtifact');
    });
  });

  describe('OData v4 Format', () => {
    it('should add artifact to OData v4 format (value)', () => {
      const cachedData = {
        data: {
          value: [
            { Id: 'Artifact1', Name: 'Artifact 1' },
          ],
        },
        cachedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        revalidateAfter: Date.now() + 1800000,
      };

      const result = addArtifactToCacheArray(cachedData, newArtifact);

      expect(result).not.toBeNull();
      expect(result.data.value).toHaveLength(2);
      expect(result.data.value[1].Id).toBe('NewArtifact');
    });
  });

  describe('IntegrationPackages Format', () => {
    it('should add artifact to IntegrationPackages format', () => {
      const cachedData = {
        data: {
          IntegrationPackages: [
            { Id: 'Package1', Name: 'Package 1' },
          ],
        },
        cachedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        revalidateAfter: Date.now() + 1800000,
      };

      const result = addArtifactToCacheArray(cachedData, newArtifact);

      expect(result).not.toBeNull();
      expect(result.data.IntegrationPackages).toHaveLength(2);
      expect(result.data.IntegrationPackages[1].Id).toBe('NewArtifact');
    });
  });

  describe('IntegrationRuntimeArtifacts Format', () => {
    it('should add artifact to IntegrationRuntimeArtifacts format', () => {
      const cachedData = {
        data: {
          IntegrationRuntimeArtifacts: [
            { Id: 'Artifact1', Name: 'Artifact 1' },
          ],
        },
        cachedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        revalidateAfter: Date.now() + 1800000,
      };

      const result = addArtifactToCacheArray(cachedData, newArtifact);

      expect(result).not.toBeNull();
      expect(result.data.IntegrationRuntimeArtifacts).toHaveLength(2);
      expect(result.data.IntegrationRuntimeArtifacts[1].Id).toBe('NewArtifact');
    });
  });

  describe('Custom Array Path', () => {
    it('should add artifact to custom array path', () => {
      const cachedData = {
        data: {
          custom: {
            path: [
              { Id: 'Artifact1', Name: 'Artifact 1' },
            ],
          },
        },
        cachedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        revalidateAfter: Date.now() + 1800000,
      };

      const result = addArtifactToCacheArray(cachedData, newArtifact, {
        arrayPath: 'custom.path',
      });

      expect(result).not.toBeNull();
      expect(result.data.custom.path).toHaveLength(2);
      expect(result.data.custom.path[1].Id).toBe('NewArtifact');
    });
  });

  describe('Duplikat-Prüfung', () => {
    it('should prevent duplicates when preventDuplicates is true', () => {
      const duplicate = { Id: 'Artifact1', Name: 'Artifact 1' };
      const cachedData = {
        data: [
          duplicate,
          { Id: 'Artifact2', Name: 'Artifact 2' },
        ],
        cachedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        revalidateAfter: Date.now() + 1800000,
      };

      const result = addArtifactToCacheArray(cachedData, duplicate, {
        preventDuplicates: true,
      });

      expect(result).toBeNull();
    });

    it('should allow duplicates when preventDuplicates is false', () => {
      const duplicate = { Id: 'Artifact1', Name: 'Artifact 1' };
      const cachedData = {
        data: [
          duplicate,
          { Id: 'Artifact2', Name: 'Artifact 2' },
        ],
        cachedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        revalidateAfter: Date.now() + 1800000,
      };

      const result = addArtifactToCacheArray(cachedData, duplicate, {
        preventDuplicates: false,
      });

      expect(result).not.toBeNull();
      expect(result.data).toHaveLength(3);
    });

    it('should allow duplicates when preventDuplicates is not set', () => {
      const duplicate = { Id: 'Artifact1', Name: 'Artifact 1' };
      const cachedData = {
        data: [
          duplicate,
          { Id: 'Artifact2', Name: 'Artifact 2' },
        ],
        cachedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        revalidateAfter: Date.now() + 1800000,
      };

      const result = addArtifactToCacheArray(cachedData, duplicate);

      expect(result).not.toBeNull();
      expect(result.data).toHaveLength(3);
    });

    it('should check for duplicates using lowercase id property', () => {
      const duplicate = { id: 'Artifact1', Name: 'Artifact 1' };
      const cachedData = {
        data: [
          { id: 'Artifact1', Name: 'Artifact 1' },
        ],
        cachedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        revalidateAfter: Date.now() + 1800000,
      };

      const result = addArtifactToCacheArray(cachedData, duplicate, {
        preventDuplicates: true,
      });

      expect(result).toBeNull();
    });
  });

  describe('Unerkanntes Format', () => {
    it('should return null for unrecognized format', () => {
      const cachedData = {
        data: {
          unknown: 'structure',
        },
        cachedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        revalidateAfter: Date.now() + 1800000,
      };

      const result = addArtifactToCacheArray(cachedData, newArtifact);

      expect(result).toBeNull();
    });
  });

  describe('Fehlerbehandlung', () => {
    it('should return null on exception', () => {
      const cachedData = {
        data: null, // This will cause an error
        cachedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        revalidateAfter: Date.now() + 1800000,
      };

      const result = addArtifactToCacheArray(cachedData, newArtifact);

      expect(result).toBeNull();
    });
  });
});

describe('removeArtifactFromCacheArray', () => {
  const artifactId = 'Artifact1';

  describe('Direct Array Format', () => {
    it('should remove artifact from direct array format', () => {
      const cachedData = {
        data: [
          { Id: 'Artifact1', Name: 'Artifact 1' },
          { Id: 'Artifact2', Name: 'Artifact 2' },
        ],
        cachedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        revalidateAfter: Date.now() + 1800000,
      };

      const result = removeArtifactFromCacheArray(cachedData, artifactId);

      expect(result).not.toBeNull();
      expect(result.data).toHaveLength(1);
      expect(result.data[0].Id).toBe('Artifact2');
    });
  });

  describe('OData v2 Format', () => {
    it('should remove artifact from OData v2 format', () => {
      const cachedData = {
        data: {
          d: {
            results: [
              { Id: 'Artifact1', Name: 'Artifact 1' },
              { Id: 'Artifact2', Name: 'Artifact 2' },
            ],
          },
        },
        cachedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        revalidateAfter: Date.now() + 1800000,
      };

      const result = removeArtifactFromCacheArray(cachedData, artifactId);

      expect(result).not.toBeNull();
      expect(result.data.d.results).toHaveLength(1);
      expect(result.data.d.results[0].Id).toBe('Artifact2');
    });
  });

  describe('OData v4 Format', () => {
    it('should remove artifact from OData v4 format', () => {
      const cachedData = {
        data: {
          value: [
            { Id: 'Artifact1', Name: 'Artifact 1' },
            { Id: 'Artifact2', Name: 'Artifact 2' },
          ],
        },
        cachedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        revalidateAfter: Date.now() + 1800000,
      };

      const result = removeArtifactFromCacheArray(cachedData, artifactId);

      expect(result).not.toBeNull();
      expect(result.data.value).toHaveLength(1);
      expect(result.data.value[0].Id).toBe('Artifact2');
    });
  });

  describe('IntegrationPackages Format', () => {
    it('should remove artifact from IntegrationPackages format', () => {
      const cachedData = {
        data: {
          IntegrationPackages: [
            { Id: 'Artifact1', Name: 'Artifact 1' },
            { Id: 'Artifact2', Name: 'Artifact 2' },
          ],
        },
        cachedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        revalidateAfter: Date.now() + 1800000,
      };

      const result = removeArtifactFromCacheArray(cachedData, artifactId);

      expect(result).not.toBeNull();
      expect(result.data.IntegrationPackages).toHaveLength(1);
      expect(result.data.IntegrationPackages[0].Id).toBe('Artifact2');
    });
  });

  describe('IntegrationRuntimeArtifacts Format', () => {
    it('should remove artifact from IntegrationRuntimeArtifacts format', () => {
      const cachedData = {
        data: {
          IntegrationRuntimeArtifacts: [
            { Id: 'Artifact1', Name: 'Artifact 1' },
            { Id: 'Artifact2', Name: 'Artifact 2' },
          ],
        },
        cachedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        revalidateAfter: Date.now() + 1800000,
      };

      const result = removeArtifactFromCacheArray(cachedData, artifactId);

      expect(result).not.toBeNull();
      expect(result.data.IntegrationRuntimeArtifacts).toHaveLength(1);
      expect(result.data.IntegrationRuntimeArtifacts[0].Id).toBe('Artifact2');
    });
  });

  describe('Custom Array Path', () => {
    it('should remove artifact from custom array path', () => {
      const cachedData = {
        data: {
          custom: {
            path: [
              { Id: 'Artifact1', Name: 'Artifact 1' },
              { Id: 'Artifact2', Name: 'Artifact 2' },
            ],
          },
        },
        cachedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        revalidateAfter: Date.now() + 1800000,
      };

      const result = removeArtifactFromCacheArray(cachedData, artifactId, {
        arrayPath: 'custom.path',
      });

      expect(result).not.toBeNull();
      expect(result.data.custom.path).toHaveLength(1);
      expect(result.data.custom.path[0].Id).toBe('Artifact2');
    });
  });

  describe('Artefakt nicht gefunden', () => {
    it('should return null when artifact not found', () => {
      const cachedData = {
        data: [
          { Id: 'Artifact2', Name: 'Artifact 2' },
        ],
        cachedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        revalidateAfter: Date.now() + 1800000,
      };

      const result = removeArtifactFromCacheArray(cachedData, artifactId);

      expect(result).toBeNull();
    });
  });

  describe('Unerkanntes Format', () => {
    it('should return null for unrecognized format', () => {
      const cachedData = {
        data: {
          unknown: 'structure',
        },
        cachedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        revalidateAfter: Date.now() + 1800000,
      };

      const result = removeArtifactFromCacheArray(cachedData, artifactId);

      expect(result).toBeNull();
    });
  });

  describe('Fehlerbehandlung', () => {
    it('should return null on exception', () => {
      const cachedData = {
        data: null, // This will cause an error
        cachedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        revalidateAfter: Date.now() + 1800000,
      };

      const result = removeArtifactFromCacheArray(cachedData, artifactId);

      expect(result).toBeNull();
    });
  });

  describe('ID Matching', () => {
    it('should match using lowercase id property', () => {
      const cachedData = {
        data: [
          { id: 'Artifact1', Name: 'Artifact 1' },
          { id: 'Artifact2', Name: 'Artifact 2' },
        ],
        cachedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
        revalidateAfter: Date.now() + 1800000,
      };

      const result = removeArtifactFromCacheArray(cachedData, 'Artifact1');

      expect(result).not.toBeNull();
      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('Artifact2');
    });
  });
});





