/**
 * Helper functions for updating cache entries
 * 
 * @module cache-update-helper
 */

import { CachedData } from '../types/cache';
import { ArtifactStatusUpdate } from '../types/cache';

/**
 * Updates an artifact's status in a cache entry
 * Handles various cache formats (Array, OData-Format, etc.)
 * 
 * @param cachedData - The cached data to update
 * @param artifactId - The ID of the artifact to update
 * @param statusData - The status data to apply
 * @returns Updated cached data, or null if artifact not found
 * 
 * @example
 * const updated = updateArtifactInCache(cachedData, 'MyArtifact', {
 *   Status: 'STARTED',
 *   DeployedBy: 'user@example.com',
 *   DeployedOn: '2024-01-01T00:00:00Z'
 * });
 */
export function updateArtifactInCache(
  cachedData: CachedData,
  artifactId: string,
  statusData: ArtifactStatusUpdate
): CachedData | null {
  try {
    const data = cachedData.data;
    
    // Handle different cache formats
    let artifacts: any[] | null = null;
    
    // Format 1: Direct array
    if (Array.isArray(data)) {
      artifacts = data;
    }
    // Format 2: OData v2 format (d.results)
    else if (data?.d?.results && Array.isArray(data.d.results)) {
      artifacts = data.d.results;
    }
    // Format 3: OData v4 format (value array)
    else if (data?.value && Array.isArray(data.value)) {
      artifacts = data.value;
    }
    // Format 4: IntegrationPackages format
    else if (data?.IntegrationPackages && Array.isArray(data.IntegrationPackages)) {
      artifacts = data.IntegrationPackages;
    }
    // Format 5: IntegrationRuntimeArtifacts format
    else if (data?.IntegrationRuntimeArtifacts && Array.isArray(data.IntegrationRuntimeArtifacts)) {
      artifacts = data.IntegrationRuntimeArtifacts;
    }
    // Format 6: Single object (not an array)
    else if (data && typeof data === 'object' && !Array.isArray(data)) {
      // Check if this is a single artifact object
      if (data.Id === artifactId || data.id === artifactId) {
        // Update the single artifact
        const updated = { ...data };
        if (statusData.Status !== undefined) {
          updated.Status = statusData.Status;
        }
        if (statusData.DeployedBy !== undefined) {
          updated.DeployedBy = statusData.DeployedBy;
        }
        if (statusData.DeployedOn !== undefined) {
          updated.DeployedOn = statusData.DeployedOn;
        }
        
        return {
          ...cachedData,
          data: updated,
        };
      }
      return null;
    }
    
    // If we have an array of artifacts, find and update the matching one
    if (artifacts) {
      const artifactIndex = artifacts.findIndex(
        (artifact: any) => artifact.Id === artifactId || artifact.id === artifactId
      );
      
      if (artifactIndex === -1) {
        return null; // Artifact not found
      }
      
      // Update the artifact
      const updatedArtifacts = [...artifacts];
      const artifact = { ...updatedArtifacts[artifactIndex] };
      
      if (statusData.Status !== undefined) {
        artifact.Status = statusData.Status;
      }
      if (statusData.DeployedBy !== undefined) {
        artifact.DeployedBy = statusData.DeployedBy;
      }
      if (statusData.DeployedOn !== undefined) {
        artifact.DeployedOn = statusData.DeployedOn;
      }
      
      updatedArtifacts[artifactIndex] = artifact;
      
      // Reconstruct the data structure with the updated array
      let updatedData: any;
      
      if (Array.isArray(data)) {
        updatedData = updatedArtifacts;
      } else if (data?.d?.results) {
        updatedData = {
          ...data,
          d: {
            ...data.d,
            results: updatedArtifacts,
          },
        };
      } else if (data?.value) {
        updatedData = {
          ...data,
          value: updatedArtifacts,
        };
      } else if (data?.IntegrationPackages) {
        updatedData = {
          ...data,
          IntegrationPackages: updatedArtifacts,
        };
      } else if (data?.IntegrationRuntimeArtifacts) {
        updatedData = {
          ...data,
          IntegrationRuntimeArtifacts: updatedArtifacts,
        };
      } else {
        updatedData = updatedArtifacts;
      }
      
      return {
        ...cachedData,
        data: updatedData,
      };
    }
    
    return null;
  } catch (error) {
    console.error('[CacheUpdateHelper] Error updating artifact in cache:', error);
    return null;
  }
}

/**
 * Updates an artifact's status in a package cache entry
 * Finds the artifact in the package's artifact arrays and updates it
 * 
 * @param cachedData - The cached package data to update
 * @param artifactId - The ID of the artifact to update
 * @param statusData - The status data to apply
 * @returns Updated cached data, or null if artifact not found
 * 
 * @example
 * const updated = updateArtifactInPackageCache(cachedData, 'MyArtifact', {
 *   Status: 'STARTED'
 * });
 */
export function updateArtifactInPackageCache(
  cachedData: CachedData,
  artifactId: string,
  statusData: ArtifactStatusUpdate
): CachedData | null {
  try {
    const data = cachedData.data;
    
    // Handle package format - could be single package or array of packages
    let packages: any[] = [];
    
    if (Array.isArray(data)) {
      packages = data;
    } else if (data?.d?.results && Array.isArray(data.d.results)) {
      packages = data.d.results;
    } else if (data?.value && Array.isArray(data.value)) {
      packages = data.value;
    } else if (data?.IntegrationPackages && Array.isArray(data.IntegrationPackages)) {
      packages = data.IntegrationPackages;
    } else if (data && typeof data === 'object' && !Array.isArray(data)) {
      // Single package object
      packages = [data];
    }
    
    let found = false;
    const updatedPackages = packages.map((pkg: any) => {
      // Check all artifact arrays in the package
      // Note: IntegrationFlows is not a property of packages - use IntegrationDesigntimeArtifacts instead
      const artifactArrays = [
        pkg.IntegrationDesigntimeArtifacts,
        pkg.ValueMappingDesigntimeArtifacts,
        pkg.MessageMappingDesigntimeArtifacts,
        pkg.ScriptCollectionDesigntimeArtifacts,
      ].filter(Boolean);
      
      let packageUpdated = false;
      const updatedPkg = { ...pkg };
      
      for (const artifactArray of artifactArrays) {
        if (Array.isArray(artifactArray)) {
          const artifactIndex = artifactArray.findIndex(
            (artifact: any) => artifact.Id === artifactId || artifact.id === artifactId
          );
          
          if (artifactIndex !== -1) {
            found = true;
            packageUpdated = true;
            const updatedArtifacts = [...artifactArray];
            const artifact = { ...updatedArtifacts[artifactIndex] };
            
            if (statusData.Status !== undefined) {
              artifact.Status = statusData.Status;
            }
            if (statusData.DeployedBy !== undefined) {
              artifact.DeployedBy = statusData.DeployedBy;
            }
            if (statusData.DeployedOn !== undefined) {
              artifact.DeployedOn = statusData.DeployedOn;
            }
            
            updatedArtifacts[artifactIndex] = artifact;
            
            // Update the corresponding array in the package
            if (pkg.IntegrationDesigntimeArtifacts === artifactArray) {
              updatedPkg.IntegrationDesigntimeArtifacts = updatedArtifacts;
            } else if (pkg.ValueMappingDesigntimeArtifacts === artifactArray) {
              updatedPkg.ValueMappingDesigntimeArtifacts = updatedArtifacts;
            } else if (pkg.MessageMappingDesigntimeArtifacts === artifactArray) {
              updatedPkg.MessageMappingDesigntimeArtifacts = updatedArtifacts;
            } else if (pkg.ScriptCollectionDesigntimeArtifacts === artifactArray) {
              updatedPkg.ScriptCollectionDesigntimeArtifacts = updatedArtifacts;
            }
          }
        }
      }
      
      return packageUpdated ? updatedPkg : pkg;
    });
    
    if (!found) {
      return null; // Artifact not found in any package
    }
    
    // Reconstruct the data structure
    let updatedData: any;
    
    if (Array.isArray(data)) {
      updatedData = updatedPackages;
    } else if (data?.d?.results) {
      updatedData = {
        ...data,
        d: {
          ...data.d,
          results: updatedPackages,
        },
      };
    } else if (data?.value) {
      updatedData = {
        ...data,
        value: updatedPackages,
      };
    } else if (data?.IntegrationPackages) {
      updatedData = {
        ...data,
        IntegrationPackages: updatedPackages,
      };
    } else {
      // Single package object
      updatedData = updatedPackages[0];
    }
    
    return {
      ...cachedData,
      data: updatedData,
    };
  } catch (error) {
    console.error('[CacheUpdateHelper] Error updating artifact in package cache:', error);
    return null;
  }
}


