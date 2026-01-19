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
        // If Status is null, remove the artifact (set data to null or empty)
        if (statusData.Status === null) {
          // For single artifact objects, we can't really "remove" it,
          // but we can set it to null or an empty object
          // However, this might break the cache structure, so we return null
          // to indicate the cache entry should be invalidated
          return null;
        }
        
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
      
      // Heuristik: Struktur nicht erkannt oder semantisch andere Ressource
      if (process.env.DEBUG === 'true') {
        console.debug('[CacheUpdateHelper] Cache structure not recognized or semantically different resource. ' +
          'Expected artifact array or single artifact object, but got:', {
          hasData: !!data,
          dataType: typeof data,
          isArray: Array.isArray(data),
          keys: data ? Object.keys(data).slice(0, 10) : [],
          artifactId
        });
      }
      return null;
    }
    
    // If we have an array of artifacts, find and update the matching one
    if (artifacts) {
      // Heuristik: Prüfe, ob Array die erwartete Struktur hat (z.B. Artefakte mit Id/id)
      const hasExpectedStructure = artifacts.some((item: any) => 
        item && typeof item === 'object' && (item.Id || item.id)
      );
      
      if (!hasExpectedStructure && artifacts.length > 0) {
        // Array hat nicht die erwartete Struktur (semantisch andere Ressource)
        if (process.env.DEBUG === 'true') {
          console.debug('[CacheUpdateHelper] Array structure does not match expected artifact format. ' +
            'Expected artifacts with Id/id property, but got:', {
            arrayLength: artifacts.length,
            firstItemType: artifacts[0] ? typeof artifacts[0] : 'null',
            firstItemKeys: artifacts[0] && typeof artifacts[0] === 'object' ? Object.keys(artifacts[0]).slice(0, 10) : [],
            artifactId
          });
        }
        return null; // No-op: Struktur nicht erkannt
      }
      
      const artifactIndex = artifacts.findIndex(
        (artifact: any) => artifact.Id === artifactId || artifact.id === artifactId
      );
      
      if (process.env.DEBUG === 'true') {
        console.debug('[CacheUpdateHelper] Searching for artifact in array:', {
          artifactId,
          arrayLength: artifacts.length,
          artifactIndex,
          statusData,
          sampleIds: artifacts.slice(0, 3).map((a: any) => ({ Id: a?.Id, id: a?.id })),
        });
      }
      
      if (artifactIndex === -1) {
        // Artifact not found in array
        // If Status is null, the artifact should be removed from the collection (already removed)
        if (statusData.Status === null) {
          // Artifact already removed from collection - this is expected for undeploy
          if (process.env.DEBUG === 'true') {
            console.debug('[CacheUpdateHelper] Artifact not found in array (expected for undeploy):', {
              artifactId,
              arrayLength: artifacts.length
            });
          }
          // Return null to indicate no update needed (artifact already removed)
          return null;
        }
        
        // For deploy/status updates: If artifact is not in collection, add it
        // This can happen if the artifact was just deployed and not yet in the cached collection
        // Check if Status is defined and not null (including empty string check)
        const shouldAddArtifact = statusData.Status !== undefined && statusData.Status !== null && statusData.Status !== '';
        
        if (process.env.DEBUG === 'true') {
          console.debug('[CacheUpdateHelper] Artifact not found in array, checking if should add:', {
            artifactId,
            arrayLength: artifacts.length,
            statusData,
            shouldAddArtifact,
            statusValue: statusData.Status,
            statusType: typeof statusData.Status,
          });
        }
        
        if (shouldAddArtifact) {
          // Create a new artifact object with the status data
          const newArtifact: any = {
            Id: artifactId,
            id: artifactId,
            ...statusData,
          };
          
          // Add the artifact to the array
          const updatedArtifacts = [...artifacts, newArtifact];
          
          if (process.env.DEBUG === 'true') {
            console.debug('[CacheUpdateHelper] Adding artifact to collection:', {
              artifactId,
              originalArrayLength: artifacts.length,
              newArrayLength: updatedArtifacts.length,
              newArtifact,
            });
          }
          
          // Reconstruct the data structure with the new artifact added
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
          
          const result = {
            ...cachedData,
            data: updatedData,
          };
          
          if (process.env.DEBUG === 'true') {
            console.debug('[CacheUpdateHelper] Returning updated cache data:', {
              artifactId,
              hasData: !!result.data,
              dataType: Array.isArray(result.data) ? 'array' : typeof result.data,
              dataLength: Array.isArray(result.data) ? result.data.length : (result.data?.d?.results?.length || result.data?.value?.length || 'unknown'),
            });
          }
          
          return result;
        }
        
        // For other cases, artifact should be in collection but isn't
        if (process.env.DEBUG === 'true') {
          console.debug('[CacheUpdateHelper] Artifact not found in array:', {
            artifactId,
            arrayLength: artifacts.length,
            statusData
          });
        }
        return null; // Artifact not found and no status to add
      }
      
      // If Status is null, remove the artifact from the collection (undeploy)
      if (statusData.Status === null) {
        const updatedArtifacts = artifacts.filter((_, index) => index !== artifactIndex);
        
        // Reconstruct the data structure with the artifact removed
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
    
    // Heuristik: Keine erkannte Struktur gefunden
    if (process.env.DEBUG === 'true') {
      console.debug('[CacheUpdateHelper] No recognized cache structure found. ' +
        'Expected array, OData format, or single artifact object, but got:', {
        hasData: !!data,
        dataType: typeof data,
        isArray: Array.isArray(data),
        dataKeys: data && typeof data === 'object' ? Object.keys(data).slice(0, 10) : [],
        artifactId
      });
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

/**
 * Gets a nested value from an object using a dot-notation path
 * Supports array indexing (e.g. 'data.d.results[0].Status')
 * 
 * @param obj - The object to get the value from
 * @param path - The dot-notation path (e.g. 'data.Status' or 'data.d.results[0].Status')
 * @returns The value at the path, or undefined if the path doesn't exist
 * 
 * @example
 * const value = getNestedValue(data, 'data.Status');
 * const arrayValue = getNestedValue(data, 'data.d.results[0].Name');
 */
export function getNestedValue(obj: any, path: string): any {
  if (!obj || !path) {
    return undefined;
  }

  try {
    const parts = path.split('.');
    let current = obj;

    for (const part of parts) {
      // Check if part contains array index (e.g. 'results[0]')
      const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/);
      
      if (arrayMatch) {
        const [, arrayName, index] = arrayMatch;
        if (current && typeof current === 'object' && arrayName in current) {
          const array = current[arrayName];
          if (Array.isArray(array) && parseInt(index, 10) < array.length) {
            current = array[parseInt(index, 10)];
          } else {
            return undefined;
          }
        } else {
          return undefined;
        }
      } else {
        if (current && typeof current === 'object' && part in current) {
          current = current[part];
        } else {
          return undefined;
        }
      }
    }

    return current;
  } catch (error) {
    if (process.env.DEBUG === 'true') {
      console.debug('[CacheUpdateHelper] Error getting nested value:', { path, error });
    }
    return undefined;
  }
}

/**
 * Sets a nested value in an object using a dot-notation path
 * Supports array indexing (e.g. 'data.d.results[0].Status')
 * Creates intermediate objects/arrays if they don't exist
 * 
 * @param obj - The object to set the value in
 * @param path - The dot-notation path (e.g. 'data.Status' or 'data.d.results[0].Status')
 * @param value - The value to set
 * @returns true if the value was set successfully, false otherwise
 * 
 * @example
 * setNestedValue(data, 'data.Status', 'STARTED');
 * setNestedValue(data, 'data.d.results[0].Name', 'MyArtifact');
 */
export function setNestedValue(obj: any, path: string, value: any): boolean {
  if (!obj || !path) {
    if (process.env.DEBUG === 'true') {
      console.debug('[CacheUpdateHelper] setNestedValue: Invalid input', { hasObj: !!obj, hasPath: !!path });
    }
    return false;
  }

  try {
    const parts = path.split('.');
    if (parts.length === 0) {
      if (process.env.DEBUG === 'true') {
        console.debug('[CacheUpdateHelper] setNestedValue: Empty path parts', { path });
      }
      return false;
    }

    let current = obj;

    // Navigate to the parent of the target property
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/);
      
      if (arrayMatch) {
        const [, arrayName, index] = arrayMatch;
        // Check if current is a valid object and has the array property
        if (!current || typeof current !== 'object' || Array.isArray(current)) {
          if (process.env.DEBUG === 'true') {
            console.debug('[CacheUpdateHelper] setNestedValue: Invalid current for array access', { 
              part, 
              currentType: typeof current, 
              isArray: Array.isArray(current),
              path 
            });
          }
          return false;
        }
        // Use 'in' operator to check if property exists (more compatible with nested objects)
        if (!(arrayName in current)) {
          if (process.env.DEBUG === 'true') {
            console.debug('[CacheUpdateHelper] setNestedValue: Array property not found', { 
              arrayName, 
              availableKeys: Object.keys(current).slice(0, 10),
              path 
            });
          }
          return false;
        }
        const array = current[arrayName];
        if (!Array.isArray(array)) {
          if (process.env.DEBUG === 'true') {
            console.debug('[CacheUpdateHelper] setNestedValue: Property is not an array', { 
              arrayName, 
              actualType: typeof array,
              path 
            });
          }
          return false;
        }
        const arrayIndex = parseInt(index, 10);
        if (isNaN(arrayIndex) || arrayIndex < 0 || arrayIndex >= array.length) {
          if (process.env.DEBUG === 'true') {
            console.debug('[CacheUpdateHelper] setNestedValue: Array index out of bounds', { 
              arrayName, 
              index: arrayIndex, 
              arrayLength: array.length,
              path 
            });
          }
          return false;
        }
        current = array[arrayIndex];
      } else {
        // Check if current is a valid object (not null, not array, not primitive)
        if (!current || typeof current !== 'object' || Array.isArray(current)) {
          if (process.env.DEBUG === 'true') {
            console.debug('[CacheUpdateHelper] setNestedValue: Invalid current for property access', { 
              part, 
              currentType: typeof current, 
              isArray: Array.isArray(current),
              path 
            });
          }
          return false;
        }
        // Use 'in' operator to check if property exists (more compatible with nested objects)
        if (!(part in current)) {
          if (process.env.DEBUG === 'true') {
            console.debug('[CacheUpdateHelper] setNestedValue: Property not found', { 
              part, 
              availableKeys: Object.keys(current).slice(0, 10),
              path 
            });
          }
          return false;
        }
        current = current[part];
      }
    }

    // Set the value at the final path
    const finalPart = parts[parts.length - 1];
    const arrayMatch = finalPart.match(/^(\w+)\[(\d+)\]$/);
    
    if (arrayMatch) {
      const [, arrayName, index] = arrayMatch;
      if (!current || typeof current !== 'object' || Array.isArray(current)) {
        if (process.env.DEBUG === 'true') {
          console.debug('[CacheUpdateHelper] setNestedValue: Invalid current for final array access', { 
            arrayName, 
            currentType: typeof current,
            path 
          });
        }
        return false;
      }
      // Use 'in' operator to check if property exists (more compatible with nested objects)
      if (!(arrayName in current)) {
        if (process.env.DEBUG === 'true') {
          console.debug('[CacheUpdateHelper] setNestedValue: Final array property not found', { 
            arrayName, 
            availableKeys: Object.keys(current).slice(0, 10),
            path 
          });
        }
        return false;
      }
      const array = current[arrayName];
      if (!Array.isArray(array)) {
        if (process.env.DEBUG === 'true') {
          console.debug('[CacheUpdateHelper] setNestedValue: Final property is not an array', { 
            arrayName, 
            actualType: typeof array,
            path 
          });
        }
        return false;
      }
      const arrayIndex = parseInt(index, 10);
      if (isNaN(arrayIndex) || arrayIndex < 0 || arrayIndex >= array.length) {
        if (process.env.DEBUG === 'true') {
          console.debug('[CacheUpdateHelper] setNestedValue: Final array index out of bounds', { 
            arrayName, 
            index: arrayIndex, 
            arrayLength: array.length,
            path 
          });
        }
        return false;
      }
      array[arrayIndex] = value;
    } else {
      // For setting a property, we need current to be a non-null object (not array, not null, not primitive)
      if (!current || typeof current !== 'object' || Array.isArray(current) || current === null) {
        if (process.env.DEBUG === 'true') {
          console.debug('[CacheUpdateHelper] setNestedValue: Invalid current for final property access', { 
            finalPart, 
            currentType: typeof current,
            isArray: Array.isArray(current),
            isNull: current === null,
            current: JSON.stringify(current).substring(0, 100),
            path 
          });
        }
        return false;
      }
      // Set the value directly - we don't need to check if property exists for setting
      current[finalPart] = value;
      
      if (process.env.DEBUG === 'true') {
        console.debug('[CacheUpdateHelper] setNestedValue: Successfully set value', { 
          finalPart, 
          path,
          valueType: typeof value
        });
      }
    }

    return true;
  } catch (error) {
    if (process.env.DEBUG === 'true') {
      console.debug('[CacheUpdateHelper] Error setting nested value:', { path, value, error });
    }
    return false;
  }
}

/**
 * Adds an artifact to a cache array
 * Handles various cache formats (Array, OData-Format, etc.)
 * 
 * @param cachedData - The cached data to update
 * @param artifact - The artifact to add
 * @param options - Optional configuration
 * @param options.arrayPath - Custom dot-notation path to the array (e.g. 'data.custom.path')
 * @param options.preventDuplicates - If true, prevents adding duplicate artifacts (checks Id/id property)
 * @returns Updated cached data, or null if error or duplicate found (when preventDuplicates is true)
 * 
 * @example
 * const updated = addArtifactToCacheArray(cachedData, newArtifact, {
 *   preventDuplicates: true
 * });
 */
export function addArtifactToCacheArray(
  cachedData: CachedData,
  artifact: any,
  options?: {
    arrayPath?: string;
    preventDuplicates?: boolean;
  }
): CachedData | null {
  try {
    const data = cachedData.data;
    
    // Handle custom array path if provided
    if (options?.arrayPath) {
      const array = getNestedValue(data, options.arrayPath);
      if (!Array.isArray(array)) {
        if (process.env.DEBUG === 'true') {
          console.debug('[CacheUpdateHelper] Custom array path does not point to an array:', {
            arrayPath: options.arrayPath
          });
        }
        return null;
      }
      
      // Check for duplicates if enabled
      if (options.preventDuplicates) {
        const artifactId = artifact?.Id || artifact?.id;
        if (artifactId) {
          const duplicate = array.find((item: any) => 
            item && (item.Id === artifactId || item.id === artifactId)
          );
          if (duplicate) {
            if (process.env.DEBUG === 'true') {
              console.debug('[CacheUpdateHelper] Duplicate artifact found, preventing addition:', {
                artifactId
              });
            }
            return null;
          }
        }
      }
      
      // Add artifact to array
      const updatedArray = [...array, artifact];
      
      // Reconstruct data structure with updated array
      const updatedData = { ...data };
      setNestedValue(updatedData, options.arrayPath, updatedArray);
      
      return {
        ...cachedData,
        data: updatedData,
      };
    }
    
    // Handle different cache formats
    let artifacts: any[] | null = null;
    let formatType: 'direct' | 'odata-v2' | 'odata-v4' | 'integration-packages' | 'integration-runtime-artifacts' | null = null;
    
    // Format 1: Direct array
    if (Array.isArray(data)) {
      artifacts = data;
      formatType = 'direct';
    }
    // Format 2: OData v2 format (d.results)
    else if (data?.d?.results && Array.isArray(data.d.results)) {
      artifacts = data.d.results;
      formatType = 'odata-v2';
    }
    // Format 3: OData v4 format (value array)
    else if (data?.value && Array.isArray(data.value)) {
      artifacts = data.value;
      formatType = 'odata-v4';
    }
    // Format 4: IntegrationPackages format
    else if (data?.IntegrationPackages && Array.isArray(data.IntegrationPackages)) {
      artifacts = data.IntegrationPackages;
      formatType = 'integration-packages';
    }
    // Format 5: IntegrationRuntimeArtifacts format
    else if (data?.IntegrationRuntimeArtifacts && Array.isArray(data.IntegrationRuntimeArtifacts)) {
      artifacts = data.IntegrationRuntimeArtifacts;
      formatType = 'integration-runtime-artifacts';
    }
    
    if (!artifacts) {
      // Unrecognized format
      if (process.env.DEBUG === 'true') {
        console.debug('[CacheUpdateHelper] Cache structure not recognized for addArtifactToCacheArray. ' +
          'Expected array, OData format, or known structure, but got:', {
          hasData: !!data,
          dataType: typeof data,
          isArray: Array.isArray(data),
          keys: data && typeof data === 'object' ? Object.keys(data).slice(0, 10) : [],
        });
      }
      return null;
    }
    
    // Check for duplicates if enabled
    if (options?.preventDuplicates) {
      const artifactId = artifact?.Id || artifact?.id;
      if (artifactId) {
        const duplicate = artifacts.find((item: any) => 
          item && (item.Id === artifactId || item.id === artifactId)
        );
        if (duplicate) {
          if (process.env.DEBUG === 'true') {
            console.debug('[CacheUpdateHelper] Duplicate artifact found, preventing addition:', {
              artifactId
            });
          }
          return null;
        }
      }
    }
    
    // Add artifact to array
    const updatedArtifacts = [...artifacts, artifact];
    
    // Reconstruct the data structure with the updated array
    let updatedData: any;
    
    if (formatType === 'direct') {
      updatedData = updatedArtifacts;
    } else if (formatType === 'odata-v2') {
      updatedData = {
        ...data,
        d: {
          ...data.d,
          results: updatedArtifacts,
        },
      };
    } else if (formatType === 'odata-v4') {
      updatedData = {
        ...data,
        value: updatedArtifacts,
      };
    } else if (formatType === 'integration-packages') {
      updatedData = {
        ...data,
        IntegrationPackages: updatedArtifacts,
      };
    } else if (formatType === 'integration-runtime-artifacts') {
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
  } catch (error) {
    console.error('[CacheUpdateHelper] Error adding artifact to cache:', error);
    return null;
  }
}

/**
 * Removes an artifact from a cache array
 * Handles various cache formats (Array, OData-Format, etc.)
 * 
 * @param cachedData - The cached data to update
 * @param artifactId - The ID of the artifact to remove
 * @param options - Optional configuration
 * @param options.arrayPath - Custom dot-notation path to the array (e.g. 'data.custom.path')
 * @returns Updated cached data, or null if artifact not found or error occurred
 * 
 * @example
 * const updated = removeArtifactFromCacheArray(cachedData, 'MyArtifactId');
 */
export function removeArtifactFromCacheArray(
  cachedData: CachedData,
  artifactId: string,
  options?: {
    arrayPath?: string;
  }
): CachedData | null {
  try {
    const data = cachedData.data;
    
    // Handle custom array path if provided
    if (options?.arrayPath) {
      const array = getNestedValue(data, options.arrayPath);
      if (!Array.isArray(array)) {
        if (process.env.DEBUG === 'true') {
          console.debug('[CacheUpdateHelper] Custom array path does not point to an array:', {
            arrayPath: options.arrayPath
          });
        }
        return null;
      }
      
      // Find and remove artifact
      const artifactIndex = array.findIndex(
        (item: any) => item && (item.Id === artifactId || item.id === artifactId)
      );
      
      if (artifactIndex === -1) {
        if (process.env.DEBUG === 'true') {
          console.debug('[CacheUpdateHelper] Artifact not found in custom array path:', {
            artifactId,
            arrayPath: options.arrayPath
          });
        }
        return null;
      }
      
      // Remove artifact from array (immutable)
      const updatedArray = array.filter((_, index) => index !== artifactIndex);
      
      // Reconstruct data structure with updated array
      const updatedData = { ...data };
      setNestedValue(updatedData, options.arrayPath, updatedArray);
      
      return {
        ...cachedData,
        data: updatedData,
      };
    }
    
    // Handle different cache formats
    let artifacts: any[] | null = null;
    let formatType: 'direct' | 'odata-v2' | 'odata-v4' | 'integration-packages' | 'integration-runtime-artifacts' | null = null;
    
    // Format 1: Direct array
    if (Array.isArray(data)) {
      artifacts = data;
      formatType = 'direct';
    }
    // Format 2: OData v2 format (d.results)
    else if (data?.d?.results && Array.isArray(data.d.results)) {
      artifacts = data.d.results;
      formatType = 'odata-v2';
    }
    // Format 3: OData v4 format (value array)
    else if (data?.value && Array.isArray(data.value)) {
      artifacts = data.value;
      formatType = 'odata-v4';
    }
    // Format 4: IntegrationPackages format
    else if (data?.IntegrationPackages && Array.isArray(data.IntegrationPackages)) {
      artifacts = data.IntegrationPackages;
      formatType = 'integration-packages';
    }
    // Format 5: IntegrationRuntimeArtifacts format
    else if (data?.IntegrationRuntimeArtifacts && Array.isArray(data.IntegrationRuntimeArtifacts)) {
      artifacts = data.IntegrationRuntimeArtifacts;
      formatType = 'integration-runtime-artifacts';
    }
    
    if (!artifacts) {
      // Unrecognized format
      if (process.env.DEBUG === 'true') {
        console.debug('[CacheUpdateHelper] Cache structure not recognized for removeArtifactFromCacheArray. ' +
          'Expected array, OData format, or known structure, but got:', {
          hasData: !!data,
          dataType: typeof data,
          isArray: Array.isArray(data),
          keys: data && typeof data === 'object' ? Object.keys(data).slice(0, 10) : [],
          artifactId
        });
      }
      return null;
    }
    
    // Find artifact in array
    const artifactIndex = artifacts.findIndex(
      (item: any) => item && (item.Id === artifactId || item.id === artifactId)
    );
    
    if (artifactIndex === -1) {
      if (process.env.DEBUG === 'true') {
        console.debug('[CacheUpdateHelper] Artifact not found in array:', {
          artifactId,
          arrayLength: artifacts.length
        });
      }
      return null;
    }
    
    // Remove artifact from array (immutable)
    const updatedArtifacts = artifacts.filter((_, index) => index !== artifactIndex);
    
    // Reconstruct the data structure with the updated array
    let updatedData: any;
    
    if (formatType === 'direct') {
      updatedData = updatedArtifacts;
    } else if (formatType === 'odata-v2') {
      updatedData = {
        ...data,
        d: {
          ...data.d,
          results: updatedArtifacts,
        },
      };
    } else if (formatType === 'odata-v4') {
      updatedData = {
        ...data,
        value: updatedArtifacts,
      };
    } else if (formatType === 'integration-packages') {
      updatedData = {
        ...data,
        IntegrationPackages: updatedArtifacts,
      };
    } else if (formatType === 'integration-runtime-artifacts') {
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
  } catch (error) {
    console.error('[CacheUpdateHelper] Error removing artifact from cache:', error);
    return null;
  }
}

