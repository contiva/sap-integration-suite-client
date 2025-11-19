/**
 * SAP Integration Content Advanced Client
 * 
 * Diese Datei enthält erweiterte Methoden für die Integration Content APIs von SAP Cloud Integration.
 * Diese Methoden sind Erweiterungen der grundlegenden API-Funktionen und bieten zusammengesetzte Operationen.
 * 
 * @module sap-integration-suite-client/integration-content-advanced
 */

import { 
  ComSapHciApiIntegrationPackage, 
  ComSapHciApiIntegrationDesigntimeArtifact,
  ComSapHciApiScriptCollectionDesigntimeArtifact,
  ComSapHciApiMessageMappingDesigntimeArtifact,
  ComSapHciApiValueMappingDesigntimeArtifact
} from '../../types/sap.IntegrationContent';

import { PackageWithArtifacts, DetailedErrorInformation, ParsedErrorDetails } from '../../types/sap.ContentClient';
import { IntegrationContentClient } from '../integration-content-client';
import { BaseCustomClient, CustomClientFactory } from './base-custom-client';

/**
 * Erweiterter SAP Integration Content Client
 * 
 * Diese Klasse stellt erweiterte, zusammengesetzte Operationen für die Interaktion 
 * mit den SAP Integration Content APIs bereit.
 */
export class IntegrationContentAdvancedClient extends BaseCustomClient<IntegrationContentClient> {
  /** Counter für 429 Rate Limit Fehler */
  private rateLimitErrors: number = 0;
  
  /**
   * Erstellt einen neuen IntegrationContentAdvancedClient
   * 
   * @param {IntegrationContentClient} client - Die zugrundeliegende Client-Instanz
   */
  constructor(client: IntegrationContentClient) {
    super(client);
  }
  
  /**
   * Gibt die Anzahl der 429 Rate Limit Fehler zurück
   * 
   * @returns {number} Anzahl der Rate Limit Fehler
   */
  getRateLimitErrorCount(): number {
    return this.rateLimitErrors;
  }
  
  /**
   * Setzt den Rate Limit Error Counter zurück
   */
  resetRateLimitErrorCount(): void {
    this.rateLimitErrors = 0;
  }

  /**
   * Ruft alle Integrationspakete mit ihren zugehörigen Artefakten ab
   * 
   * Diese Methode holt alle Integrationspakete und sammelt für jedes Paket:
   * - Integrationsflows
   * - Message Mappings
   * - Value Mappings
   * - Script Collections
   * 
   * **Optimierungen:**
   * - MessageMappings & ValueMappings werden über globale Endpunkte abgerufen (nur 2 API-Calls)
   * - IntegrationFlows & ScriptCollections werden mit Concurrency-Limit abgerufen
   * - Bis zu 50% weniger API-Aufrufe im Vergleich zur nicht-optimierten Variante
   * 
   * **Best Practices:**
   * - Für kleine bis mittlere Systeme (bis 100 Packages): `concurrency: 7-10`
   * - Für größere Systeme: Starte mit `concurrency: 5` und erhöhe schrittweise
   * - 429 Rate Limit Fehler können mit `getRateLimitErrorCount()` überwacht werden
   * 
   * @param {Object} options Optionale Parameter für die Anfrage
   * @param {number} [options.top] Maximale Anzahl der zurückzugebenden Pakete
   * @param {number} [options.skip] Anzahl der zu überspringenden Pakete
   * @param {boolean} [options.includeEmpty=false] Ob leere Pakete ohne Artefakte inkludiert werden sollen
   * @param {boolean} [options.parallel=false] Ob die Artefakte parallel abgerufen werden sollen (schneller, aber möglicherweise API-Limits)
   * @param {number} [options.concurrency=2] Maximale Anzahl paralleler Requests (nur bei parallel=true). Default: 7 (optimal für die meisten Systeme)
   * @returns {Promise<PackageWithArtifacts[]>} Liste von Paketen mit ihren Artefakten
   * 
   * @example
   * // Alle Pakete mit ihren Artefakten abrufen (sequentiell)
   * const packagesWithArtifacts = await client.getPackagesWithArtifacts();
   * 
   * // Nur die ersten 5 Pakete mit Artefakten abrufen
   * const packagesWithArtifacts = await client.getPackagesWithArtifacts({ top: 5 });
   * 
   * // Alle Pakete mit parallelen API-Aufrufen abrufen (mit optimalem Concurrency Limit)
   * const packagesWithArtifacts = await client.getPackagesWithArtifacts({ parallel: true, concurrency: 7 });
   * 
   * // 429 Rate Limit Fehler überwachen
   * const packagesWithArtifacts = await client.getPackagesWithArtifacts({ parallel: true });
   * const rateLimitErrors = client.getRateLimitErrorCount();
   * if (rateLimitErrors > 0) {
   *   console.warn(`${rateLimitErrors} Rate Limit Fehler aufgetreten - reduziere Concurrency`);
   * }
   */
  async getPackagesWithArtifacts(options: { 
    top?: number; 
    skip?: number; 
    includeEmpty?: boolean;
    parallel?: boolean;
    concurrency?: number;
  } = {}): Promise<PackageWithArtifacts[]> {
    // Hole alle Integrationspakete
    const packages = await this.client.getIntegrationPackages({
      top: options.top,
      skip: options.skip
    });

    // Wenn keine Pakete gefunden wurden, direkt leeres Array zurückgeben
    if (packages.length === 0) {
      return [];
    }

    // Map von PackageId -> Package erstellen für einfacheren Zugriff
    const packageMap = new Map<string, ComSapHciApiIntegrationPackage>();
    for (const pkg of packages) {
      if (pkg.Id) {
        packageMap.set(pkg.Id as string, pkg);
      }
    }

    // Array für das Ergebnis mit erweiterter Struktur
    const result: PackageWithArtifacts[] = packages.map(pkg => ({
      package: {
        ...pkg,
        IntegrationDesigntimeArtifacts: [],
        MessageMappingDesigntimeArtifacts: [],
        ValueMappingDesigntimeArtifacts: [],
        ScriptCollectionDesigntimeArtifacts: []
      }
    }));

    // Direktes Mapping von PackageId zu Result-Index
    const packageIndexMap = new Map<string, number>();
    packages.forEach((pkg, index) => {
      if (pkg.Id) {
        packageIndexMap.set(pkg.Id as string, index);
      }
    });

    try {
      if (options.parallel) {
        // Optimiert: Nutze globale Endpunkte für MessageMappings und ValueMappings
        // Hole alle Artefakte parallel mit Concurrency-Limit - IntegrationFlows und ScriptCollections müssen pro Package abgerufen werden
        const concurrency = options.concurrency || 7; // Default: 7 parallele Requests (optimal für die meisten Systeme)
        
        // Hole MessageMappings und ValueMappings global (nur 2 Calls)
        const [allMessageMappings, allValueMappings] = await Promise.all([
          this.client._fetchAllMessageMappingsFromGlobalEndpoint(),
          this.client._fetchAllValueMappingsFromGlobalEndpoint()
        ]);
        
        // Hole IntegrationFlows und ScriptCollections mit Concurrency-Limit
        const allFlows = await this.getAllIntegrationFlowsWithConcurrency({ packages, concurrency });
        const allScriptCollections = await this.getAllScriptCollectionsWithConcurrency({ packages, concurrency });

        // Sortiere Flows nach PackageId
        for (const flow of allFlows) {
          if (flow.PackageId && packageIndexMap.has(flow.PackageId as string)) {
            const index = packageIndexMap.get(flow.PackageId as string)!;
            result[index].package.IntegrationDesigntimeArtifacts.push(flow);
          }
        }

        // Sortiere Message Mappings nach PackageId
        for (const mapping of allMessageMappings) {
          if (mapping.PackageId && packageIndexMap.has(mapping.PackageId as string)) {
            const index = packageIndexMap.get(mapping.PackageId as string)!;
            result[index].package.MessageMappingDesigntimeArtifacts.push(mapping);
          }
        }

        // Sortiere Value Mappings nach PackageId
        for (const mapping of allValueMappings) {
          if (mapping.PackageId && packageIndexMap.has(mapping.PackageId as string)) {
            const index = packageIndexMap.get(mapping.PackageId as string)!;
            result[index].package.ValueMappingDesigntimeArtifacts.push(mapping);
          }
        }

        // Sortiere Script Collections nach PackageId
        for (const script of allScriptCollections) {
          if (script.PackageId && packageIndexMap.has(script.PackageId as string)) {
            const index = packageIndexMap.get(script.PackageId as string)!;
            result[index].package.ScriptCollectionDesigntimeArtifacts.push(script);
          }
        }
      } else {
        // Optimierter Sequentieller Ansatz
        // Hole MessageMappings und ValueMappings einmal für alle Packages (globale Endpunkte)
        // IntegrationFlows und ScriptCollections müssen pro Package abgerufen werden
        const [allMessageMappings, allValueMappings] = await Promise.allSettled([
          this.client._fetchAllMessageMappingsFromGlobalEndpoint(),
          this.client._fetchAllValueMappingsFromGlobalEndpoint()
        ]);
        
        // Erstelle Maps für schnellere Zuordnung
        const messageMappingsByPackage = new Map<string, ComSapHciApiMessageMappingDesigntimeArtifact[]>();
        const valueMappingsByPackage = new Map<string, ComSapHciApiValueMappingDesigntimeArtifact[]>();
        
        if (allMessageMappings.status === 'fulfilled') {
          for (const mapping of allMessageMappings.value) {
            if (mapping.PackageId) {
              const pkgId = mapping.PackageId as string;
              if (!messageMappingsByPackage.has(pkgId)) {
                messageMappingsByPackage.set(pkgId, []);
              }
              messageMappingsByPackage.get(pkgId)!.push(mapping);
            }
          }
        }
        
        if (allValueMappings.status === 'fulfilled') {
          for (const mapping of allValueMappings.value) {
            if (mapping.PackageId) {
              const pkgId = mapping.PackageId as string;
              if (!valueMappingsByPackage.has(pkgId)) {
                valueMappingsByPackage.set(pkgId, []);
              }
              valueMappingsByPackage.get(pkgId)!.push(mapping);
            }
          }
        }
        
        // Hole IntegrationFlows und ScriptCollections für jedes Package
        for (const [i, pkg] of packages.entries()) {
          const packageId = pkg.Id as string;
          
          // Nutze Promise.allSettled für parallele Ausführung der package-spezifischen Artefakte
          const [flows, scripts] = await Promise.allSettled([
            this.client.getIntegrationFlows(packageId),
            this.client.getScriptCollections(packageId),
          ]);
          
          result[i].package.IntegrationDesigntimeArtifacts = 
            flows.status === 'fulfilled' ? flows.value : [];
          result[i].package.ScriptCollectionDesigntimeArtifacts = 
            scripts.status === 'fulfilled' ? scripts.value : [];
          
          // Weise die bereits abgerufenen MessageMappings und ValueMappings zu
          result[i].package.MessageMappingDesigntimeArtifacts = 
            messageMappingsByPackage.get(packageId) || [];
          result[i].package.ValueMappingDesigntimeArtifacts = 
            valueMappingsByPackage.get(packageId) || [];
          
          // Log errors in debug mode
          if (process.env.DEBUG === 'true') {
            if (flows.status === 'rejected') {
              console.error(`Fehler beim Abrufen der Integrationsflows für Paket ${packageId}:`, flows.reason);
            }
            if (scripts.status === 'rejected') {
              console.error(`Fehler beim Abrufen der Script Collections für Paket ${packageId}:`, scripts.reason);
            }
            if (allMessageMappings.status === 'rejected') {
              console.error(`Fehler beim Abrufen aller Message Mappings:`, allMessageMappings.reason);
            }
            if (allValueMappings.status === 'rejected') {
              console.error(`Fehler beim Abrufen aller Value Mappings:`, allValueMappings.reason);
            }
          }
        }
      }

      // Entferne leere Pakete, wenn includeEmpty=false
      if (!options.includeEmpty) {
        return result.filter(item => 
          item.package.IntegrationDesigntimeArtifacts.length > 0 || 
          item.package.MessageMappingDesigntimeArtifacts.length > 0 || 
          item.package.ValueMappingDesigntimeArtifacts.length > 0 || 
          item.package.ScriptCollectionDesigntimeArtifacts.length > 0
        );
      }

      return result;
    } catch (error) {
      console.error(`Fehler beim Abrufen der Artefakte:`, error);
      throw error;
    }
  }

  /**
   * Hilfsmethode: Führt Promises mit Concurrency-Limit aus
   * 
   * @private
   * @param tasks Array von Promise-Factories
   * @param concurrency Maximale Anzahl paralleler Promises
   * @returns Promise mit allen Ergebnissen
   */
  private async executWithConcurrency<T>(
    tasks: (() => Promise<T>)[],
    concurrency: number
  ): Promise<T[]> {
    const results: T[] = [];
    const executing: Set<Promise<any>> = new Set();
    
    for (const task of tasks) {
      const promise = task().then(result => {
        results.push(result);
        executing.delete(promise);
        return result;
      }).catch(err => {
        executing.delete(promise);
        throw err;
      });
      
      executing.add(promise);
      
      // Wenn wir das Concurrency-Limit erreicht haben, warte auf das erste fertige Promise
      if (executing.size >= concurrency) {
        await Promise.race(executing);
      }
    }
    
    // Warte auf alle verbleibenden Promises
    await Promise.all(Array.from(executing));
    return results;
  }

  /**
   * Ruft alle Integrationsflows aller Pakete mit Concurrency-Limit ab
   * 
   * @private
   * @param {Object} options Parameter für die Anfrage
   * @param {ComSapHciApiIntegrationPackage[]} options.packages Pakete
   * @param {number} options.concurrency Maximale Anzahl paralleler Requests
   * @returns {Promise<ComSapHciApiIntegrationDesigntimeArtifact[]>} Liste aller Integrationsflows
   */
  private async getAllIntegrationFlowsWithConcurrency(options: { 
    packages: ComSapHciApiIntegrationPackage[];
    concurrency: number;
  }): Promise<ComSapHciApiIntegrationDesigntimeArtifact[]> {
    const allFlows: ComSapHciApiIntegrationDesigntimeArtifact[] = [];
    
    // Erstelle Tasks für jedes Package
    const tasks = options.packages.map(pkg => () =>
      this.client.getIntegrationFlows(pkg.Id as string)
        .then(flows => {
          flows.forEach(flow => {
            if (!flow.PackageId && pkg.Id) {
              flow.PackageId = pkg.Id;
            }
          });
          allFlows.push(...flows);
          return flows;
        })
        .catch(error => {
          // Zähle 429 Fehler
          if (error?.statusCode === 429 || error?.response?.status === 429) {
            this.rateLimitErrors++;
          }
          if (process.env.DEBUG === 'true') {
            console.error(`Fehler beim Abrufen der Flows für Paket ${pkg.Id}:`, error.message || error);
          }
          return [];
        })
    );
    
    await this.executWithConcurrency(tasks, options.concurrency);
    return allFlows;
  }

  /**
   * Ruft alle Script Collections aller Pakete mit Concurrency-Limit ab
   * 
   * @private
   * @param {Object} options Parameter für die Anfrage
   * @param {ComSapHciApiIntegrationPackage[]} options.packages Pakete
   * @param {number} options.concurrency Maximale Anzahl paralleler Requests
   * @returns {Promise<ComSapHciApiScriptCollectionDesigntimeArtifact[]>} Liste aller Script Collections
   */
  private async getAllScriptCollectionsWithConcurrency(options: { 
    packages: ComSapHciApiIntegrationPackage[];
    concurrency: number;
  }): Promise<ComSapHciApiScriptCollectionDesigntimeArtifact[]> {
    const allScripts: ComSapHciApiScriptCollectionDesigntimeArtifact[] = [];
    
    // Erstelle Tasks für jedes Package
    const tasks = options.packages.map(pkg => () =>
      this.client.getScriptCollections(pkg.Id as string)
        .then(scripts => {
          scripts.forEach(script => {
            if (!script.PackageId && pkg.Id) {
              script.PackageId = pkg.Id;
            }
          });
          allScripts.push(...scripts);
          return scripts;
        })
        .catch(error => {
          // Zähle 429 Fehler
          if (error?.statusCode === 429 || error?.response?.status === 429) {
            this.rateLimitErrors++;
          }
          if (process.env.DEBUG === 'true') {
            console.error(`Fehler beim Abrufen der Script Collections für Paket ${pkg.Id}:`, error.message || error);
          }
          return [];
        })
    );
    
    await this.executWithConcurrency(tasks, options.concurrency);
    return allScripts;
  }

  /**
   * Ruft alle Integrationsflows aller Pakete ab
   * 
   * @param {Object} options Optionale Parameter für die Anfrage
   * @param {number} [options.top] Maximale Anzahl der zurückzugebenden Pakete für die Abfrage
   * @param {ComSapHciApiIntegrationPackage[]} [options.packages] Bereits abgerufene Pakete, um redundante API-Aufrufe zu vermeiden
   * @returns {Promise<ComSapHciApiIntegrationDesigntimeArtifact[]>} Liste aller Integrationsflows
   * 
   * @example
   * const allFlows = await client.getAllIntegrationFlows();
   * 
   * // Mit bereits vorhandenen Paketen
   * const packages = await client.getIntegrationPackages();
   * const allFlows = await client.getAllIntegrationFlows({ packages });
   */
  async getAllIntegrationFlows(options: { 
    top?: number; 
    packages?: ComSapHciApiIntegrationPackage[] 
  } = {}): Promise<ComSapHciApiIntegrationDesigntimeArtifact[]> {
    // Verwende übergebene Pakete oder hole sie, wenn nicht vorhanden
    const packages = options.packages || await this.client.getIntegrationPackages({ top: options.top });
    
    // Sammel alle Flows
    const allFlows: ComSapHciApiIntegrationDesigntimeArtifact[] = [];
    
    // Arrays von Promises für Promise.all - Retry-Logik ist bereits in den Basis-Methoden implementiert
    const promises = packages.map(pkg =>
      this.client.getIntegrationFlows(pkg.Id as string)
        .then(flows => {
          // Stelle sicher, dass die PackageId in den Flows gesetzt ist
          flows.forEach(flow => {
            if (!flow.PackageId && pkg.Id) {
              flow.PackageId = pkg.Id;
            }
          });
          allFlows.push(...flows);
        })
        .catch(error => {
          console.error(`Fehler beim Abrufen der Flows für Paket ${pkg.Id}:`, error);
          return []; // Fehler ignorieren
        })
    );
    
    // Warte auf alle Promises
    await Promise.all(promises);
    return allFlows;
  }

  /**
   * Ruft alle Script Collections aller Pakete ab
   * 
   * @param {Object} options Optionale Parameter für die Anfrage
   * @param {number} [options.top] Maximale Anzahl der zurückzugebenden Pakete für die Abfrage
   * @param {ComSapHciApiIntegrationPackage[]} [options.packages] Bereits abgerufene Pakete, um redundante API-Aufrufe zu vermeiden
   * @returns {Promise<ComSapHciApiScriptCollectionDesigntimeArtifact[]>} Liste aller Script Collections
   * 
   * @example
   * const allScriptCollections = await client.getAllScriptCollections();
   * 
   * // Mit bereits vorhandenen Paketen
   * const packages = await client.getIntegrationPackages();
   * const allScripts = await client.getAllScriptCollections({ packages });
   */
  async getAllScriptCollections(options: { 
    top?: number; 
    packages?: ComSapHciApiIntegrationPackage[] 
  } = {}): Promise<ComSapHciApiScriptCollectionDesigntimeArtifact[]> {
    // Verwende übergebene Pakete oder hole sie, wenn nicht vorhanden
    const packages = options.packages || await this.client.getIntegrationPackages({ top: options.top });
    
    // Sammel alle Script Collections
    const allScripts: ComSapHciApiScriptCollectionDesigntimeArtifact[] = [];
    
    // Arrays von Promises für Promise.all - Retry-Logik ist bereits in den Basis-Methoden implementiert
    const promises = packages.map(pkg =>
      this.client.getScriptCollections(pkg.Id as string)
        .then(scripts => {
          // Stelle sicher, dass die PackageId in den Script Collections gesetzt ist
          scripts.forEach(script => {
            if (!script.PackageId && pkg.Id) {
              script.PackageId = pkg.Id;
            }
          });
          allScripts.push(...scripts);
        })
        .catch(error => {
          console.error(`Fehler beim Abrufen der Script Collections für Paket ${pkg.Id}:`, error);
          return []; // Fehler ignorieren
        })
    );
    
    // Warte auf alle Promises
    await Promise.all(promises);
    return allScripts;
  }

  /**
   * Gibt alle Message Mappings (tenant-weit) zurück.
   * 
   * @param {Object} options Optionale Parameter für die Anfrage
   * @param {number} [options.top] Maximale Anzahl der zurückzugebenden Mappings
   * @param {number} [options.skip] Anzahl der zu überspringenden Mappings
   * @param {string} [options.select] Zu selektierende Properties
   * @param {string} [options.orderby] Sortierreihenfolge
   * @returns {Promise<ComSapHciApiMessageMappingDesigntimeArtifact[]>} Promise mit einer Liste von Message Mappings
   * 
   * @example
   * const allMappings = await client.getAllMessageMappings({ top: 50 });
   */
  async getAllMessageMappings(options: { 
    top?: number; 
    skip?: number; 
    select?: ("Id" | "Version" | "PackageId" | "Name" | "Description" | "ArtifactContent")[]; 
    orderby?: ("Name" | "Name desc")[]; 
    packages?: ComSapHciApiIntegrationPackage[];
  } = {}): Promise<ComSapHciApiMessageMappingDesigntimeArtifact[]> {
    // Wenn Pakete vorhanden sind, hole Mappings paketweise, ansonsten über die zentrale API
    if (options.packages && options.packages.length > 0) {
      const allMappings: ComSapHciApiMessageMappingDesigntimeArtifact[] = [];
      
      // Arrays von Promises für Promise.all - Retry-Logik ist bereits in den Basis-Methoden implementiert
      const promises = options.packages.map(pkg =>
        this.client.getMessageMappings(pkg.Id as string)
          .then(mappings => {
            // Stelle sicher, dass die PackageId in den Message Mappings gesetzt ist
            mappings.forEach(mapping => {
              if (!mapping.PackageId && pkg.Id) {
                mapping.PackageId = pkg.Id;
              }
            });
            allMappings.push(...mappings);
          })
          .catch(error => {
            console.error(`Fehler beim Abrufen der Message Mappings für Paket ${pkg.Id}:`, error);
            return []; // Fehler ignorieren
          })
      );
      
      // Warte auf alle Promises
      await Promise.all(promises);
      return allMappings;
    } else {
      // Über die zentrale API mit den ursprünglichen Parametern
      return this.client.getAllMessageMappings(options);
    }
  }

  /**
   * Gibt alle Value Mappings (tenant-weit) zurück.
   * 
   * @param {Object} options Optionale Parameter für die Anfrage
   * @param {number} [options.top] Maximale Anzahl der zurückzugebenden Mappings
   * @param {number} [options.skip] Anzahl der zu überspringenden Mappings
   * @param {string} [options.select] Zu selektierende Properties
   * @param {string} [options.orderby] Sortierreihenfolge
   * @returns {Promise<ComSapHciApiValueMappingDesigntimeArtifact[]>} Promise mit einer Liste von Value Mappings
   * 
   * @example
   * const allValueMappings = await client.getAllValueMappings({ top: 20 });
   */
  async getAllValueMappings(options: { 
    top?: number; 
    skip?: number; 
    select?: ("Id" | "Version" | "PackageId" | "Name" | "Description" | "ArtifactContent")[];
    orderby?: ("Name" | "Name desc")[];
    packages?: ComSapHciApiIntegrationPackage[];
  } = {}): Promise<ComSapHciApiValueMappingDesigntimeArtifact[]> {
    // Wenn Pakete vorhanden sind, hole Mappings paketweise, ansonsten über die zentrale API
    if (options.packages && options.packages.length > 0) {
      const allMappings: ComSapHciApiValueMappingDesigntimeArtifact[] = [];
      
      // Arrays von Promises für Promise.all - Retry-Logik ist bereits in den Basis-Methoden implementiert
      const promises = options.packages.map(pkg =>
        this.client.getValueMappings(pkg.Id as string)
          .then(mappings => {
            // Stelle sicher, dass die PackageId in den Value Mappings gesetzt ist
            mappings.forEach(mapping => {
              if (!mapping.PackageId && pkg.Id) {
                mapping.PackageId = pkg.Id;
              }
            });
            allMappings.push(...mappings);
          })
          .catch(error => {
            console.error(`Fehler beim Abrufen der Value Mappings für Paket ${pkg.Id}:`, error);
            return []; // Fehler ignorieren
          })
      );
      
      // Warte auf alle Promises
      await Promise.all(promises);
      return allMappings;
    } else {
      // Über die zentrale API mit den ursprünglichen Parametern
      return this.client.getAllValueMappings(options);
    }
  }

  /**
   * Gibt detaillierte Fehlerinformationen für ein deployten Integrationsartefakt zurück
   * Diese Methode ruft den spezifischen $value-Endpunkt auf, der mehr Details enthält
   * 
   * @param {string} artifactId ID des deployten Integrationsartefakts
   * @returns {Promise<DetailedErrorInformation | null>} Promise mit den detaillierten Fehlerinformationen oder null bei Fehlern
   * 
   * @example
   * const detailedError = await client.getDetailedArtifactErrorInformation('MyFailedFlow');
   * if (detailedError && detailedError.message) {
   *   console.log(`Fehlertyp: ${detailedError.message.messageId}`);
   *   if (detailedError.parameter && detailedError.parameter.length > 0) {
   *     try {
   *       const paramJson = JSON.parse(detailedError.parameter[0]);
   *       console.log(`Fehlermeldung: ${paramJson.message}`);
   *     } catch (e) {
   *       console.log(`Parameter: ${detailedError.parameter[0]}`);
   *     }
   *   }
   * }
   */
  async getDetailedArtifactErrorInformation(artifactId: string): Promise<DetailedErrorInformation | null> {
    return this.client.getDetailedArtifactErrorInformation(artifactId);
  }

  /**
   * Parst die Fehlerdetails aus den Parametern einer DetailedErrorInformation
   * 
   * @param {DetailedErrorInformation} errorInfo Die detaillierten Fehlerinformationen
   * @returns {ParsedErrorDetails | null} Die geparsten Fehlerdetails oder null, wenn keine Parameter vorhanden oder das Parsing fehlschlägt
   * 
   * @example
   * const detailedError = await client.getDetailedArtifactErrorInformation('MyFailedFlow');
   * if (detailedError) {
   *   const errorDetails = client.parseErrorDetails(detailedError);
   *   if (errorDetails && errorDetails.message) {
   *     console.log(`Fehlermeldung: ${errorDetails.message}`);
   *     
   *     if (errorDetails.childMessageInstances && errorDetails.childMessageInstances.length > 0) {
   *       console.log(`Hauptursache: ${errorDetails.childMessageInstances[0].message}`);
   *     }
   *   }
   * }
   */
  parseErrorDetails(errorInfo: DetailedErrorInformation): ParsedErrorDetails | null {
    return this.client.parseErrorDetails(errorInfo);
  }
}

/**
 * Factory für die Erstellung von IntegrationContentAdvancedClient-Instanzen
 */
export class IntegrationContentAdvancedClientFactory implements CustomClientFactory<IntegrationContentClient, IntegrationContentAdvancedClient> {
  /**
   * Erstellt eine neue IntegrationContentAdvancedClient-Instanz
   * 
   * @param baseClient - Der zugrundeliegende Standard-Client
   * @returns Ein IntegrationContentAdvancedClient
   */
  create(baseClient: IntegrationContentClient): IntegrationContentAdvancedClient {
    return new IntegrationContentAdvancedClient(baseClient);
  }
} 