/**
 * SAP Integration Content Client
 * 
 * Diese Datei enthält eine vereinfachte Client-Klasse für die Interaktion mit 
 * den Integration Content APIs von SAP Cloud Integration.
 * 
 * @module sap-integration-suite-client/integration-content
 */

import { 
  Api as IntegrationContentApi,
  ComSapHciApiIntegrationPackage, 
  ComSapHciApiIntegrationPackageCreate,
  ComSapHciApiIntegrationDesigntimeArtifact,
  ComSapHciApiConfiguration,
  ComSapHciApiServiceEndpoint,
  ComSapHciApiIntegrationRuntimeArtifact,
  ComSapHciApiValueMappingDesigntimeArtifact,
  ComSapHciApiMessageMappingDesigntimeArtifact,
  ComSapHciApiScriptCollectionDesigntimeArtifact,
  ComSapHciApiIntegrationPackageUpdate,
  ComSapHciApiIntegrationDesigntimeArtifactCreate,
  ComSapHciApiIntegrationDesigntimeArtifactUpdate,
  ComSapHciApiResourceCreate, 
  ComSapHciApiResourceUpdate, 
  ComSapHciApiBuildAndDeployStatus,
  ComSapHciApiCustomTagsUpdate, 
  ComSapHciApiDesignGuidlineExecutionResult,
  ComSapHciApiDesignGuidelineExecutionResultsSkip,
  ComSapHciApiValueMappingDesigntimeArtifactCreate,
  ComSapHciApiMessageMappingDesigntimeArtifactCreate,
  ComSapHciApiMessageMappingDesigntimeArtifactUpdate,
  ComSapHciApiScriptCollectionDesigntimeArtifactCreate,
  ComSapHciApiScriptCollectionDesigntimeArtifactUpdate, 
  ComSapHciApiResource,
  ComSapHciApiValMapSchema,
  ComSapHciApiValMaps,
  ComSapHciApiCustomTagsConfiguration,
  ComSapHciApiCustomTagsConfigurationCreate,
  ComSapHciApiIntegrationAdapterDesigntimeArtifact,
  ComSapHciApiIntegrationAdapterDesigntimeArtifactImport,
  ComSapHciApiMDIDeltaToken
} from '../types/sap.IntegrationContent';

import { ResponseNormalizer } from '../utils/response-normalizer';

/**
 * Struktur für ein Paket mit allen zugehörigen Artefakten
 */
export interface PackageWithArtifacts {
  /** Das Integrationspaket mit allen Artefakten */
  package: ComSapHciApiIntegrationPackage & {
    /** Liste der Integrationsflows im Paket */
    IntegrationDesigntimeArtifacts: ComSapHciApiIntegrationDesigntimeArtifact[];
    /** Liste der Message Mappings im Paket */
    MessageMappingDesigntimeArtifacts: ComSapHciApiMessageMappingDesigntimeArtifact[];
    /** Liste der Value Mappings im Paket */
    ValueMappingDesigntimeArtifacts: ComSapHciApiValueMappingDesigntimeArtifact[];
    /** Liste der Script Collections im Paket */
    ScriptCollectionDesigntimeArtifacts: ComSapHciApiScriptCollectionDesigntimeArtifact[];
  }
}

/**
 * Erweiterter SAP Integration Content Client
 * 
 * Diese Klasse stellt eine vereinfachte API für die Interaktion 
 * mit den SAP Integration Content APIs bereit.
 */
export class IntegrationContentClient {
  private api: IntegrationContentApi<unknown>;
  private normalizer: ResponseNormalizer;

  /**
   * Erstellt einen neuen IntegrationContentClient
   * 
   * @param {IntegrationContentApi<unknown>} api - Die zugrunde liegende API-Instanz
   */
  constructor(api: IntegrationContentApi<unknown>) {
    this.api = api;
    this.normalizer = new ResponseNormalizer();
  }

  /**
   * Gibt alle Integrationspakete zurück
   * 
   * @param {Object} options Optionale Parameter für die Anfrage
   * @param {number} [options.top] Maximale Anzahl der zurückzugebenden Pakete
   * @param {number} [options.skip] Anzahl der zu überspringenden Pakete
   * @param {string} [options.author] Filtern nach Autor (Custom Tag)
   * @param {string} [options.lob] Filtern nach Line of Business (Custom Tag)
   * @returns {Promise<ComSapHciApiIntegrationPackage[]>} Promise mit einer Liste von Integrationspaketen
   * 
   * @example
   * // Alle Integrationspakete abrufen
   * const packages = await client.getIntegrationPackages();
   * 
   * @example
   * // Pakete mit Paginierung abrufen
   * const packages = await client.getIntegrationPackages({ top: 10, skip: 20 });
   */
  async getIntegrationPackages(options: { top?: number; skip?: number; author?: string; lob?: string } = {}): Promise<ComSapHciApiIntegrationPackage[]> {
    const response = await this.api.integrationPackages.integrationPackagesList({
      $top: options.top,
      $skip: options.skip,
      Author: options.author,
      LoB: options.lob
    });
    
    return this.normalizer.normalizeArrayResponse(response.data, 'getIntegrationPackages', 'IntegrationPackages');
  }

  /**
   * Gibt ein Integrationspaket anhand seiner ID zurück
   * 
   * @param {string} packageId ID des Integrationspakets
   * @returns {Promise<ComSapHciApiIntegrationPackage>} Promise mit dem Integrationspaket
   * 
   * @example
   * const package = await client.getIntegrationPackageById('MyPackageId');
   */
  async getIntegrationPackageById(packageId: string): Promise<ComSapHciApiIntegrationPackage> {
    const response = await this.api.integrationPackagesId.integrationPackagesList(packageId);
    return response.data;
  }

  /**
   * Erstellt ein neues Integrationspaket
   * 
   * @param {ComSapHciApiIntegrationPackageCreate} packageData Daten des Integrationspakets
   * @param {boolean} [overwrite=false] Ob ein existierendes Paket mit der gleichen ID überschrieben werden soll
   * @returns {Promise<ComSapHciApiIntegrationPackage>} Promise mit dem erstellten Integrationspaket
   * 
   * @example
   * const newPackage = await client.createIntegrationPackage({
   *   Id: 'MyNewPackage',
   *   Name: 'My New Integration Package',
   *   Description: 'This is a new package'
   * });
   */
  async createIntegrationPackage(packageData: ComSapHciApiIntegrationPackageCreate, overwrite = false): Promise<ComSapHciApiIntegrationPackage> {
    const response = await this.api.integrationPackages.integrationPackagesCreate(
      packageData,
      overwrite ? { Overwrite: ["true"] } : undefined
    );
    return response.data;
  }

  /**
   * Löscht ein Integrationspaket anhand seiner ID
   * 
   * @param {string} packageId ID des zu löschenden Integrationspakets
   * @returns {Promise<void>} Promise, der aufgelöst wird, wenn das Paket gelöscht wurde
   * 
   * @example
   * await client.deleteIntegrationPackage('MyPackageId');
   */
  async deleteIntegrationPackage(packageId: string): Promise<void> {
    await this.api.integrationPackagesId.integrationPackagesDelete(packageId);
  }

  /**
   * Gibt alle Integrationsflows für ein bestimmtes Paket zurück
   * 
   * @param {string} packageId ID des Integrationspakets
   * @returns {Promise<ComSapHciApiIntegrationDesigntimeArtifact[]>} Promise mit einer Liste von Integrationsflows
   * 
   * @example
   * const flows = await client.getIntegrationFlows('MyPackageId');
   */
  async getIntegrationFlows(packageId: string): Promise<ComSapHciApiIntegrationDesigntimeArtifact[]> {
    const response = await this.api.integrationPackagesId.integrationDesigntimeArtifactsList(packageId);
    return this.normalizer.normalizeArrayResponse(response.data, 'getIntegrationFlows', 'IntegrationDesigntimeArtifacts');
  }

  /**
   * Gibt einen bestimmten Integrationsflow anhand seiner ID und Version zurück
   * 
   * @param {string} flowId ID des Integrationsflows
   * @param {string} version Version des Integrationsflows (Standard: 'active')
   * @returns {Promise<ComSapHciApiIntegrationDesigntimeArtifact>} Promise mit dem Integrationsflow
   * 
   * @example
   * const flow = await client.getIntegrationFlowById('MyFlowId', '1.0.0');
   */
  async getIntegrationFlowById(flowId: string, version = 'active'): Promise<ComSapHciApiIntegrationDesigntimeArtifact | undefined> {
    const response = await this.api.integrationDesigntimeArtifactsIdIdVersionVersion.integrationDesigntimeArtifactsIdVersionList(
      flowId, 
      version
    );
    return this.normalizer.normalizeEntityResponse(response.data, 'getIntegrationFlowById');
  }

  /**
   * Erstellt oder lädt einen neuen Integrationsflow hoch.
   * 
   * @param {ComSapHciApiIntegrationDesigntimeArtifactCreate} flowData Daten des zu erstellenden Flows
   * @returns {Promise<ComSapHciApiIntegrationDesigntimeArtifact>} Promise mit dem erstellten Integrationsflow
   * 
   * @example
   * const newFlow = await client.createIntegrationFlow({
   *   Id: 'MyNewFlow',
   *   Name: 'My New Flow',
   *   PackageId: 'MyPackageId',
   *   ArtifactContent: 'base64encodedZipContent' // Base64 kodierter ZIP-Inhalt
   * });
   */
  async createIntegrationFlow(flowData: ComSapHciApiIntegrationDesigntimeArtifactCreate): Promise<ComSapHciApiIntegrationDesigntimeArtifact | undefined> {
    const response = await this.api.integrationDesigntimeArtifacts.integrationDesigntimeArtifactsCreate(flowData);
    return this.normalizer.normalizeEntityResponse(response.data, 'createIntegrationFlow');
  }

  /**
   * Aktualisiert einen vorhandenen Integrationsflow.
   * 
   * @param {string} flowId ID des zu aktualisierenden Flows
   * @param {string} version Version des zu aktualisierenden Flows
   * @param {ComSapHciApiIntegrationDesigntimeArtifactUpdate} flowData Die zu aktualisierenden Daten
   * @returns {Promise<void>} Promise, der aufgelöst wird, wenn der Flow aktualisiert wurde
   * 
   * @example
   * await client.updateIntegrationFlow('MyFlowId', '1.0.0', {
   *   Name: 'Updated Flow Name',
   *   ArtifactContent: 'newBase64encodedZipContent' // Neuer Base64 kodierter ZIP-Inhalt
   * });
   */
  async updateIntegrationFlow(flowId: string, version: string, flowData: ComSapHciApiIntegrationDesigntimeArtifactUpdate): Promise<void> {
    await this.api.integrationDesigntimeArtifactsIdIdVersionVersion.integrationDesigntimeArtifactsIdVersionUpdate(
      flowId,
      version,
      flowData
    );
  }

  /**
   * Löscht einen Integrationsflow anhand seiner ID und Version.
   * 
   * @param {string} flowId ID des zu löschenden Integrationsflows
   * @param {string} version Version des zu löschenden Integrationsflows
   * @returns {Promise<void>} Promise, der aufgelöst wird, wenn der Flow gelöscht wurde
   * 
   * @example
   * await client.deleteIntegrationFlow('MyFlowId', '1.0.0');
   */
  async deleteIntegrationFlow(flowId: string, version: string): Promise<void> {
    await this.api.integrationDesigntimeArtifactsIdIdVersionVersion.integrationDesigntimeArtifactsIdVersionDelete(flowId, version);
  }

  /**
   * Lädt einen Integrationsflow als ZIP-Datei herunter.
   * 
   * Hinweis: Download von Flows aus Configure-Only-Paketen ist nicht möglich.
   * Der Rückgabetyp `File` ist primär für Browser-Umgebungen relevant. In Node.js 
   * müsste die Response anders behandelt werden (z.B. als Stream oder Buffer).
   * 
   * @param {string} flowId ID des herunterzuladenden Flows
   * @param {string} [version='active'] Version des herunterzuladenden Flows
   * @returns {Promise<File>} Promise mit der heruntergeladenen Datei (im Browser-Kontext)
   * 
   * @example
   * // Im Browser:
   * try {
   *   const file = await client.downloadIntegrationFlow('MyFlowId', '1.0.1');
   *   // ... (Code zum Speichern der Datei, siehe downloadIntegrationPackage Beispiel)
   * } catch (error) {
   *   console.error('Download failed:', error);
   * }
   */
  async downloadIntegrationFlow(flowId: string, version = 'active'): Promise<File> {
    const response = await this.api.integrationDesigntimeArtifactsIdIdVersionVersion.valueList(flowId, version);
    // Die API-Client-Generierung gibt 'File' zurück, was ggf. angepasst werden muss.
    return response.data as File;
  }

  /**
   * Deployed einen Integrationsflow
   * 
   * @param {string} flowId ID des zu deployenden Integrationsflows
   * @param {string} [version='active'] Version des Integrationsflows
   * @returns {Promise<void>} Promise, der aufgelöst wird, wenn das Deployment gestartet wurde
   * 
   * @example
   * await client.deployIntegrationFlow('MyFlowId');
   */
  async deployIntegrationFlow(flowId: string, version = 'active'): Promise<void> {
    await this.api.deployIntegrationDesigntimeArtifact.deployIntegrationDesigntimeArtifactCreate({
      Id: flowId,
      Version: `'${version}'`
    });
  }

  /**
   * Undeployed einen Integrationsflow
   * 
   * @param {string} flowId ID des zu undeployenden Integrationsflows
   * @returns {Promise<void>} Promise, der aufgelöst wird, wenn der Flow undeployed wurde
   * 
   * @example
   * await client.undeployIntegrationFlow('MyFlowId');
   */
  async undeployIntegrationFlow(flowId: string): Promise<void> {
    await this.api.integrationRuntimeArtifactsId.integrationRuntimeArtifactsDelete(flowId);
  }

  /**
   * Gibt alle deployten Integrationsartefakte zurück
   * 
   * @param {Object} options Optionale Parameter für die Anfrage
   * @param {number} [options.top] Maximale Anzahl der zurückzugebenden Artefakte
   * @param {number} [options.skip] Anzahl der zu überspringenden Artefakte
   * @param {string} [options.filter] OData-Filterausdruck
   * @returns {Promise<ComSapHciApiIntegrationRuntimeArtifact[]>} Promise mit einer Liste von Runtime-Artefakten
   * 
   * @example
   * // Alle deployten Artefakte abrufen
   * const runtimeArtifacts = await client.getDeployedArtifacts();
   * 
   * @example
   * // Deployten Artefakte mit Filter abrufen
   * const errorArtifacts = await client.getDeployedArtifacts({ 
   *   filter: "Status eq 'ERROR'" 
   * });
   */
  async getDeployedArtifacts(options: { top?: number; skip?: number; filter?: string } = {}): Promise<ComSapHciApiIntegrationRuntimeArtifact[]> {
    const response = await this.api.integrationRuntimeArtifacts.integrationRuntimeArtifactsList({
      $top: options.top,
      $skip: options.skip,
      $filter: options.filter
    });
    return this.normalizer.normalizeArrayResponse(response.data, 'getDeployedArtifacts');
  }

  /**
   * Gibt Konfigurationsparameter für einen Integrationsflow zurück
   * 
   * @param {string} flowId ID des Integrationsflows
   * @param {string} [version='active'] Version des Integrationsflows
   * @param {string} [filter] Optionaler OData-Filterausdruck
   * @returns {Promise<ComSapHciApiConfiguration[]>} Promise mit einer Liste von Konfigurationen
   * 
   * @example
   * const configs = await client.getIntegrationFlowConfigurations('MyFlowId');
   */
  async getIntegrationFlowConfigurations(flowId: string, version = 'active', filter?: string): Promise<ComSapHciApiConfiguration[]> {
    const response = await this.api.integrationDesigntimeArtifactsIdIdVersionVersion.configurationsList(
      flowId,
      version,
      { $filter: filter }
    );
    return this.normalizer.normalizeArrayResponse(response.data, 'getIntegrationFlowConfigurations');
  }

  /**
   * Gibt die Anzahl der Konfigurationsparameter für einen Integrationsflow zurück.
   * 
   * @param {string} flowId ID des Integrationsflows
   * @param {string} [version='active'] Version des Integrationsflows
   * @param {string} [filter] Optionaler OData-Filterausdruck
   * @returns {Promise<number>} Promise mit der Anzahl der Konfigurationen
   * 
   * @example
   * const count = await client.getIntegrationFlowConfigurationCount('MyFlowId');
   * console.log(`Flow has ${count} configurations.`);
   */
  async getIntegrationFlowConfigurationCount(flowId: string, version = 'active', filter?: string): Promise<number> {
    // Die API gibt keinen direkten Zähler zurück, daher holen wir alle und zählen sie.
    // Beachte: Das ist bei sehr vielen Konfigurationen ineffizient.
    // Eine bessere Implementierung würde die $count-Option nutzen, falls die generierte API sie unterstützt.
    // Da der generierte Client `configurationsCountList` hat, verwenden wir diesen.
    const response = await this.api.integrationDesigntimeArtifactsIdIdVersionVersion.configurationsCountList(
      flowId,
      version,
      { $filter: filter }
    );
    // Die API gibt die Anzahl als String im Body zurück, wenn $count verwendet wird.
    // Wir parsen diesen String zu einer Zahl.
    const countString = response.data as unknown as string; 
    return parseInt(countString || '0', 10);
  }

  /**
   * Aktualisiert einen Konfigurationsparameter für einen Integrationsflow
   * 
   * @param {string} flowId ID des Integrationsflows
   * @param {string} parameterKey Schlüssel des zu aktualisierenden Parameters
   * @param {string} parameterValue Neuer Wert für den Parameter
   * @param {string} [dataType] Datentyp des Parameters (z.B., 'xsd:string')
   * @param {string} [version='active'] Version des Integrationsflows
   * @returns {Promise<void>} Promise, der aufgelöst wird, wenn der Parameter aktualisiert wurde
   * 
   * @example
   * await client.updateIntegrationFlowConfiguration(
   *   'MyFlowId', 
   *   'Receiver_Host', 
   *   'api.example.com',
   *   'xsd:string'
   * );
   */
  async updateIntegrationFlowConfiguration(
    flowId: string, 
    parameterKey: string, 
    parameterValue: string, 
    dataType?: string,
    version = 'active'
  ): Promise<void> {
    await this.api.integrationDesigntimeArtifactsIdIdVersionVersion.linksConfigurationsUpdate(
      flowId,
      version,
      parameterKey,
      {
        ParameterValue: parameterValue,
        DataType: dataType
      }
    );
  }

  /**
   * Gibt alle Service-Endpoints von deployten Integrationsflows zurück
   * 
   * @param {Object} options Optionale Parameter für die Anfrage
   * @param {number} [options.top] Maximale Anzahl der zurückzugebenden Endpoints
   * @param {number} [options.skip] Anzahl der zu überspringenden Endpoints
   * @param {string} [options.filter] OData-Filterausdruck
   * @returns {Promise<ComSapHciApiServiceEndpoint[]>} Promise mit einer Liste von Service-Endpoints
   * 
   * @example
   * const endpoints = await client.getServiceEndpoints();
   */
  async getServiceEndpoints(options: { top?: number; skip?: number; filter?: string } = {}): Promise<ComSapHciApiServiceEndpoint[]> {
    // Korrektur: OData-konforme Parameter für $expand
    // Bei OData werden mehrere expand-Werte durch Kommas getrennt in einem Parameter übergeben
    const response = await this.api.serviceEndpoints.serviceEndpointsList({
      $top: options.top,
      $skip: options.skip,
      $filter: options.filter,
      $expand: "EntryPoints,ApiDefinitions" as any // Type Assertion, damit der TypeScript-Compiler dies akzeptiert
    });
    
    return this.normalizer.normalizeArrayResponse(response.data, 'getServiceEndpoints');
  }

  /**
   * Gibt Fehlerinformationen für ein deployten Integrationsartefakt zurück
   * 
   * @param {string} artifactId ID des deployten Integrationsartefakts
   * @returns {Promise<string>} Promise mit den Fehlerinformationen
   * 
   * @example
   * const errorInfo = await client.getArtifactErrorInformation('MyFailedFlow');
   */
  async getArtifactErrorInformation(artifactId: string): Promise<string> {
    const response = await this.api.integrationRuntimeArtifactsId.errorInformationValueList(artifactId);
    return response.data as unknown as string;
  }

  /**
   * Gibt alle Value Mappings für ein bestimmtes Paket zurück
   * 
   * @param {string} packageId ID des Integrationspakets
   * @returns {Promise<ComSapHciApiValueMappingDesigntimeArtifact[]>} Promise mit einer Liste von Value Mappings
   * 
   * @example
   * const valueMappings = await client.getValueMappings('MyPackageId');
   */
  async getValueMappings(packageId: string): Promise<ComSapHciApiValueMappingDesigntimeArtifact[]> {
    const response = await this.api.integrationPackagesId.valueMappingDesigntimeArtifactsList(packageId);
    return this.normalizer.normalizeArrayResponse(response.data, 'getValueMappings');
  }

  /**
   * Gibt alle Message Mappings für ein bestimmtes Paket zurück
   * 
   * @param {string} packageId ID des Integrationspakets
   * @returns {Promise<ComSapHciApiMessageMappingDesigntimeArtifact[]>} Promise mit einer Liste von Message Mappings
   * 
   * @example
   * const messageMappings = await client.getMessageMappings('MyPackageId');
   */
  async getMessageMappings(packageId: string): Promise<ComSapHciApiMessageMappingDesigntimeArtifact[]> {
    const response = await this.api.integrationPackagesId.messageMappingDesigntimeArtifactsList(packageId);
    return this.normalizer.normalizeArrayResponse(response.data, 'getMessageMappings');
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
   * @param {Object} options Optionale Parameter für die Anfrage
   * @param {number} [options.top] Maximale Anzahl der zurückzugebenden Pakete
   * @param {number} [options.skip] Anzahl der zu überspringenden Pakete
   * @param {boolean} [options.includeEmpty=false] Ob leere Pakete ohne Artefakte inkludiert werden sollen
   * @param {boolean} [options.parallel=false] Ob die Artefakte parallel abgerufen werden sollen (schneller, aber möglicherweise API-Limits)
   * @returns {Promise<PackageWithArtifacts[]>} Liste von Paketen mit ihren Artefakten
   * 
   * @example
   * // Alle Pakete mit ihren Artefakten abrufen
   * const packagesWithArtifacts = await client.getPackagesWithArtifacts();
   * 
   * // Nur die ersten 5 Pakete mit Artefakten abrufen
   * const packagesWithArtifacts = await client.getPackagesWithArtifacts({ top: 5 });
   * 
   * // Alle Pakete mit parallelen API-Aufrufen abrufen (schneller)
   * const packagesWithArtifacts = await client.getPackagesWithArtifacts({ parallel: true });
   */
  async getPackagesWithArtifacts(options: { 
    top?: number; 
    skip?: number; 
    includeEmpty?: boolean;
    parallel?: boolean;
  } = {}): Promise<PackageWithArtifacts[]> {
    // Hole alle Integrationspakete
    const packages = await this.getIntegrationPackages({
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
        // Hole alle Artefakte parallel für alle Pakete
        // Dies ist schneller, kann aber API-Limits überschreiten
        const [allFlows, allMessageMappings, allValueMappings, allScriptCollections] = await Promise.all([
          this._fetchAllIntegrationFlows(),
          this._fetchAllMessageMappings(),
          this._fetchAllValueMappings(),
          this._fetchAllScriptCollections()
        ]);

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
        // Sequentieller Ansatz wie bisher, aber optimiert mit Try-Catch
        for (const [i, pkg] of packages.entries()) {
          const packageId = pkg.Id as string;
          
          try {
            // Hole alle Artefakte für dieses Paket
            result[i].package.IntegrationDesigntimeArtifacts = await this.getIntegrationFlows(packageId).catch(() => []);
          } catch (error) {
            console.error(`Fehler beim Abrufen der Integrationsflows für Paket ${packageId}:`, error);
            result[i].package.IntegrationDesigntimeArtifacts = [];
          }

          try {
            result[i].package.MessageMappingDesigntimeArtifacts = await this.getMessageMappings(packageId).catch(() => []);
          } catch (error) {
            console.error(`Fehler beim Abrufen der Message Mappings für Paket ${packageId}:`, error);
            result[i].package.MessageMappingDesigntimeArtifacts = [];
          }

          try {
            result[i].package.ValueMappingDesigntimeArtifacts = await this.getValueMappings(packageId).catch(() => []);
          } catch (error) {
            console.error(`Fehler beim Abrufen der Value Mappings für Paket ${packageId}:`, error);
            result[i].package.ValueMappingDesigntimeArtifacts = [];
          }

          try {
            result[i].package.ScriptCollectionDesigntimeArtifacts = await this.getScriptCollections(packageId).catch(() => []);
          } catch (error) {
            console.error(`Fehler beim Abrufen der Script Collections für Paket ${packageId}:`, error);
            result[i].package.ScriptCollectionDesigntimeArtifacts = [];
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
   * Ruft alle Integrationsflows aller Pakete ab
   * 
   * @returns {Promise<ComSapHciApiIntegrationDesigntimeArtifact[]>} Liste aller Integrationsflows
   * 
   * @private Interne Methode für getPackagesWithArtifacts
   */
  private async _fetchAllIntegrationFlows(): Promise<ComSapHciApiIntegrationDesigntimeArtifact[]> {
    // Für alle Integrationsflows gibt es keinen direkten API-Endpunkt
    // Daher müssen wir hier einen Trick anwenden und über alle Pakete iterieren
    const packages = await this.getIntegrationPackages();
    
    // Sammel alle Flows
    const allFlows: ComSapHciApiIntegrationDesigntimeArtifact[] = [];
    
    // Arrays von Promises für Promise.all
    const promises = packages.map(pkg => 
      this.getIntegrationFlows(pkg.Id as string)
        .then(flows => allFlows.push(...flows))
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
   * Ruft alle Message Mappings aller Pakete ab
   * 
   * @returns {Promise<ComSapHciApiMessageMappingDesigntimeArtifact[]>} Liste aller Message Mappings
   * 
   * @private Interne Methode für getPackagesWithArtifacts
   */
  private async _fetchAllMessageMappings(): Promise<ComSapHciApiMessageMappingDesigntimeArtifact[]> {
    // Hier können wir die existierende getAllMessageMappings-Methode verwenden, 
    // die bereits alle Tenant-weiten Mappings zurückgibt
    return this.getAllMessageMappings({ top: 999 }); // Größtmöglicher Wert für 'top'
  }

  /**
   * Ruft alle Value Mappings aller Pakete ab
   * 
   * @returns {Promise<ComSapHciApiValueMappingDesigntimeArtifact[]>} Liste aller Value Mappings
   * 
   * @private Interne Methode für getPackagesWithArtifacts
   */
  private async _fetchAllValueMappings(): Promise<ComSapHciApiValueMappingDesigntimeArtifact[]> {
    // Hier können wir die existierende getAllValueMappings-Methode verwenden
    return this.getAllValueMappings({ top: 999 }); // Größtmöglicher Wert für 'top'
  }

  /**
   * Ruft alle Script Collections aller Pakete ab
   * 
   * @returns {Promise<ComSapHciApiScriptCollectionDesigntimeArtifact[]>} Liste aller Script Collections
   * 
   * @private Interne Methode für getPackagesWithArtifacts
   */
  private async _fetchAllScriptCollections(): Promise<ComSapHciApiScriptCollectionDesigntimeArtifact[]> {
    // Für alle Script Collections gibt es keinen direkten API-Endpunkt
    // Daher müssen wir hier einen Trick anwenden und über alle Pakete iterieren
    const packages = await this.getIntegrationPackages();
    
    // Sammel alle Script Collections
    const allScripts: ComSapHciApiScriptCollectionDesigntimeArtifact[] = [];
    
    // Arrays von Promises für Promise.all
    const promises = packages.map(pkg => 
      this.getScriptCollections(pkg.Id as string)
        .then(scripts => allScripts.push(...scripts))
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
   * Aktualisiert ein Integrationspaket anhand seiner ID
   * 
   * @param {string} packageId ID des zu aktualisierenden Integrationspakets
   * @param {ComSapHciApiIntegrationPackageUpdate} packageData Die zu aktualisierenden Daten des Pakets
   * @returns {Promise<void>} Promise, der aufgelöst wird, wenn das Paket aktualisiert wurde
   * 
   * @example
   * await client.updateIntegrationPackage('MyPackageId', {
   *   Name: 'Updated Package Name',
   *   Description: 'This package has been updated.'
   * });
   */
  async updateIntegrationPackage(packageId: string, packageData: ComSapHciApiIntegrationPackageUpdate): Promise<void> {
    await this.api.integrationPackagesId.integrationPackagesUpdate(packageId, packageData);
  }

  /**
   * Lädt ein Integrationspaket als ZIP-Datei herunter
   * 
   * Hinweis: Download schlägt fehl, wenn das Paket Artefakte im Entwurfsstatus enthält.
   * Der Rückgabetyp `File` ist primär für Browser-Umgebungen relevant. In Node.js 
   * müsste die Response anders behandelt werden (z.B. als Stream oder Buffer).
   * 
   * @param {string} packageId ID des herunterzuladenden Integrationspakets
   * @returns {Promise<File>} Promise mit der heruntergeladenen Datei (im Browser-Kontext)
   * 
   * @example
   * // Im Browser:
   * try {
   *   const file = await client.downloadIntegrationPackage('MyPackageId');
   *   const url = URL.createObjectURL(file);
   *   const a = document.createElement('a');
   *   a.href = url;
   *   a.download = 'MyPackageId.zip';
   *   document.body.appendChild(a);
   *   a.click();
   *   window.URL.revokeObjectURL(url);
   *   document.body.removeChild(a);
   * } catch (error) {
   *   console.error('Download failed:', error);
   * }
   */
  async downloadIntegrationPackage(packageId: string): Promise<File> {
    const response = await this.api.integrationPackagesId.valueList(packageId);
    // Die API-Client-Generierung gibt 'File' zurück, was ggf. angepasst werden muss.
    return response.data as File; 
  }

  /**
   * Speichert einen Integrationsflow unter einer neuen Version.
   * 
   * @param {string} flowId ID des Integrationsflows
   * @param {string} newVersion Die neue Versionsnummer (z.B. '1.0.1')
   * @returns {Promise<void>} Promise, der aufgelöst wird, wenn die neue Version gespeichert wurde
   * 
   * @example
   * await client.saveIntegrationFlowAsVersion('MyFlowId', '1.0.1');
   */
  async saveIntegrationFlowAsVersion(flowId: string, newVersion: string): Promise<void> {
    await this.api.integrationDesigntimeArtifactSaveAsVersion.integrationDesigntimeArtifactSaveAsVersionCreate({
      Id: flowId,
      SaveAsVersion: newVersion
    });
  }

  /**
   * Gibt ein spezifisches deploytes Integrationsartefakt anhand seiner ID zurück.
   * 
   * @param {string} artifactId ID des deployten Artefakts
   * @returns {Promise<ComSapHciApiIntegrationRuntimeArtifact | undefined>} Promise mit dem Runtime-Artefakt oder undefined, wenn nicht gefunden.
   * 
   * @example
   * const artifact = await client.getDeployedArtifactById('MyDeployedFlow');
   * if (artifact) {
   *   console.log(`Status of ${artifact.Name}: ${artifact.Status}`);
   * }
   */
  async getDeployedArtifactById(artifactId: string): Promise<ComSapHciApiIntegrationRuntimeArtifact | undefined> {
    const response = await this.api.integrationRuntimeArtifactsId.integrationRuntimeArtifactsList(artifactId);
    return this.normalizer.normalizeEntityResponse(response.data, 'getDeployedArtifactById');
  }

  /**
   * Gibt die Anzahl der Service-Endpoints von deployten Integrationsflows zurück.
   * 
   * @param {string} [filter] Optionaler OData-Filterausdruck
   * @returns {Promise<number>} Promise mit der Anzahl der Service-Endpoints
   * 
   * @example
   * const count = await client.getServiceEndpointCount("Protocol eq 'SOAP'");
   * console.log(`Number of SOAP endpoints: ${count}`);
   */
  async getServiceEndpointCount(filter?: string): Promise<number> {
    const response = await this.api.serviceEndpoints.countList({ $filter: filter });
    // Die API gibt die Anzahl als String im Body zurück.
    const countString = response.data as unknown as string;
    return parseInt(countString || '0', 10);
  }

  /**
   * Gibt den Build- und Deploy-Status für eine bestimmte Task-ID zurück.
   * 
   * @param {string} taskId Die ID des Build/Deploy-Tasks
   * @returns {Promise<ComSapHciApiBuildAndDeployStatus['d'] | undefined>} Promise mit dem Status-Objekt oder undefined.
   * 
   * @example
   * const status = await client.getBuildAndDeployStatus('task123');
   * if (status) {
   *   console.log(`Task ${status.TaskId} status: ${status.Status}`);
   * }
   */
  async getBuildAndDeployStatus(taskId: string): Promise<ComSapHciApiBuildAndDeployStatus['d'] | undefined> {
    const response = await this.api.buildAndDeployStatusTaskIdTaskId.buildAndDeployStatusTaskIdList(taskId);
    return response.data?.d?.d;
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
  } = {}): Promise<ComSapHciApiMessageMappingDesigntimeArtifact[]> {
    const response = await this.api.messageMappingDesigntimeArtifacts.messageMappingDesigntimeArtifactsList({
      $top: options.top,
      $skip: options.skip,
      $select: options.select,
      $orderby: options.orderby
    });
    return this.normalizer.normalizeArrayResponse(response.data, 'getAllMessageMappings');
  }

  /**
   * Erstellt/lädt ein neues Message Mapping hoch.
   * 
   * @param {ComSapHciApiMessageMappingDesigntimeArtifactCreate} mappingData Daten des zu erstellenden Mappings
   * @returns {Promise<ComSapHciApiMessageMappingDesigntimeArtifact | undefined>} Promise mit dem erstellten Mapping
   * 
   * @example
   * const newMapping = await client.createMessageMapping({
   *   Id: 'MyNewMapping',
   *   Name: 'My New Mapping',
   *   PackageId: 'MyPackageId',
   *   Description: 'Mapping Description',
   *   ArtifactContent: 'base64encodedZipContent' // Base64 kodierter ZIP-Inhalt
   * });
   */
  async createMessageMapping(mappingData: ComSapHciApiMessageMappingDesigntimeArtifactCreate): Promise<ComSapHciApiMessageMappingDesigntimeArtifact | undefined> {
    const response = await this.api.messageMappingDesigntimeArtifacts.messageMappingDesigntimeArtifactsCreate(
      // Der generierte Client erwartet hier fälschlicherweise ValueMappingCreate, wir casten es.
      mappingData as unknown as ComSapHciApiValueMappingDesigntimeArtifactCreate 
    );
    return this.normalizer.normalizeEntityResponse(response.data, 'createMessageMapping');
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
  } = {}): Promise<ComSapHciApiValueMappingDesigntimeArtifact[]> {
    const response = await this.api.valueMappingDesigntimeArtifacts.valueMappingDesigntimeArtifactsList({
      $top: options.top,
      $skip: options.skip,
      $select: options.select,
      $orderby: options.orderby
    });
    return this.normalizer.normalizeArrayResponse(response.data, 'getAllValueMappings');
  }

  /**
   * Erstellt/lädt ein neues Value Mapping hoch.
   *
   * @param {ComSapHciApiValueMappingDesigntimeArtifactCreate} mappingData Daten des zu erstellenden Mappings
   * @returns {Promise<ComSapHciApiValueMappingDesigntimeArtifact | undefined>} Promise mit dem erstellten Mapping
   *
   * @example
   * const newMapping = await client.createValueMapping({
   *   Id: 'MyNewValueMap',
   *   Name: 'My New Value Map',
   *   PackageId: 'MyPackageId',
   *   Description: 'Value Map Description',
   *   ArtifactContent: 'base64encodedZipContent' // Base64 kodierter ZIP-Inhalt
   * });
   */
  async createValueMapping(mappingData: ComSapHciApiValueMappingDesigntimeArtifactCreate): Promise<ComSapHciApiValueMappingDesigntimeArtifact | undefined> {
    const response = await this.api.valueMappingDesigntimeArtifacts.valueMappingDesigntimeArtifactsCreate(mappingData);
    return this.normalizer.normalizeEntityResponse(response.data, 'createValueMapping');
  }

  /**
   * Gibt alle Value Mapping Schemas (Agency Identifiers) für ein Value Mapping zurück.
   *
   * @param {string} mappingId ID des Value Mappings
   * @param {string} [version='active'] Version des Value Mappings
   * @param {string} [filter] OData-Filterausdruck (z.B. "State eq 'Configured'")
   * @returns {Promise<ComSapHciApiValMapSchema[]>} Promise mit einer Liste von Schemas
   *
   * @example
   * const schemas = await client.getValueMappingSchemas('MyValueMapId');
   * const configuredSchemas = await client.getValueMappingSchemas('MyValueMapId', 'active', "State eq 'Configured'");
   */
  async getValueMappingSchemas(mappingId: string, version = 'active', filter?: string): Promise<ComSapHciApiValMapSchema[]> {
    const response = await this.api.valueMappingDesigntimeArtifactsIdIdVersionVersion.valMapSchemaList(mappingId, version, { $filter: filter });
    return this.normalizer.normalizeArrayResponse(response.data, 'getValueMappingSchemas');
  }

  /**
   * Gibt alle Value Mappings für ein spezifisches Schema (Agency Identifiers) zurück.
   *
   * @param {string} mappingId ID des Value Mappings
   * @param {string} version Version des Value Mappings
   * @param {string} srcAgency Source Agency
   * @param {string} srcId Source ID
   * @param {string} tgtAgency Target Agency
   * @param {string} tgtId Target ID
   * @param {string} [filter] OData-Filterausdruck (z.B. "Value/SrcValue eq 'SourceVal' and Value/TgtValue eq 'TargetVal'")
   * @returns {Promise<ComSapHciApiValMaps[]>} Promise mit einer Liste von Mappings für das Schema
   *
   * @example
   * const schemaMappings = await client.getValueMappingsForSchema(
   *   'MyValueMapId', 'active', 'SourceAgency', 'SrcID1', 'TargetAgency', 'TgtID1'
   * );
   */
  async getValueMappingsForSchema(
    mappingId: string, 
    version: string, 
    srcAgency: string, 
    srcId: string, 
    tgtAgency: string, 
    tgtId: string, 
    filter?: string
  ): Promise<ComSapHciApiValMaps[]> {
    const response = await this.api.valueMappingDesigntimeArtifactsIdIdVersionVersion.valMapSchemaSrcAgencySrcIdTgtAgencyTgtIdValMapsList(
      mappingId, version, srcAgency, srcId, tgtAgency, tgtId, { $filter: filter }
    );
    return this.normalizer.normalizeArrayResponse(response.data, 'getValueMappingsForSchema');
  }

  /**
   * Gibt alle Default Value Mappings für ein spezifisches Schema (Agency Identifiers) zurück.
   *
   * @param {string} mappingId ID des Value Mappings
   * @param {string} version Version des Value Mappings
   * @param {string} srcAgency Source Agency
   * @param {string} srcId Source ID
   * @param {string} tgtAgency Target Agency
   * @param {string} tgtId Target ID
   * @returns {Promise<ComSapHciApiValMaps[]>} Promise mit einer Liste von Default Mappings für das Schema
   *
   * @example
   * const defaultMappings = await client.getDefaultValueMappingsForSchema(
   *   'MyValueMapId', 'active', 'SourceAgency', 'SrcID1', 'TargetAgency', 'TgtID1'
   * );
   */
  async getDefaultValueMappingsForSchema(
    mappingId: string, 
    version: string, 
    srcAgency: string, 
    srcId: string, 
    tgtAgency: string, 
    tgtId: string
  ): Promise<ComSapHciApiValMaps[]> {
    const response = await this.api.valueMappingDesigntimeArtifactsIdIdVersionVersion.valMapSchemaSrcAgencySrcIdTgtAgencyTgtIdDefaultValMapsList(
      mappingId, version, srcAgency, srcId, tgtAgency, tgtId
    );
    return this.normalizer.normalizeArrayResponse(response.data, 'getDefaultValueMappingsForSchema');
  }

  /**
   * Deployed ein Value Mapping.
   *
   * @param {string} mappingId ID des zu deployenden Mappings
   * @param {string} [version='active'] Version des Mappings
   * @returns {Promise<void>} Promise, der aufgelöst wird, wenn das Deployment gestartet wurde
   *
   * @example
   * await client.deployValueMapping('MyValueMapId');
   */
  async deployValueMapping(mappingId: string, version = 'active'): Promise<void> {
    await this.api.deployValueMappingDesigntimeArtifact.deployValueMappingDesigntimeArtifactCreate({
      Id: `'${mappingId}'`, // API erwartet ID in einfachen Anführungszeichen
      Version: `'${version}'` // API erwartet Version in einfachen Anführungszeichen
    });
  }

  /**
   * Speichert ein Value Mapping unter einer neuen Version.
   *
   * @param {string} mappingId ID des Value Mappings
   * @param {string} newVersion Die neue Versionsnummer (z.B. '1.0.1')
   * @returns {Promise<void>} Promise, der aufgelöst wird, wenn die neue Version gespeichert wurde
   *
   * @example
   * await client.saveValueMappingAsVersion('MyValueMapId', '1.0.1');
   */
  async saveValueMappingAsVersion(mappingId: string, newVersion: string): Promise<void> {
    await this.api.valueMappingDesigntimeArtifactSaveAsVersion.valueMappingDesigntimeArtifactSaveAsVersionCreate({
      Id: mappingId,
      SaveAsVersion: newVersion
    });
  }

  /**
   * Erstellt oder aktualisiert einen Eintrag (Value Pair) in einem Value Mapping.
   *
   * @param {string} mappingId ID des Value Mappings
   * @param {string} version Version des Value Mappings
   * @param {string} srcAgency Source Agency
   * @param {string} srcId Source ID
   * @param {string} tgtAgency Target Agency
   * @param {string} tgtId Target ID
   * @param {string} srcValue Source Value
   * @param {string} tgtValue Target Value
   * @param {boolean} isConfigured Gibt an, ob das Schema konfiguriert ist
   * @returns {Promise<void>} Promise, der aufgelöst wird, wenn der Eintrag erstellt/aktualisiert wurde
   *
   * @example
   * await client.upsertValueMappingEntry(
   *   'MyValueMapId', 'active', 'AgencyA', 'ID1', 'AgencyB', 'ID2',
   *   'SourceVal1', 'TargetVal1', true
   * );
   */
  async upsertValueMappingEntry(
    mappingId: string, 
    version: string, 
    srcAgency: string, 
    srcId: string, 
    tgtAgency: string, 
    tgtId: string,
    srcValue: string,
    tgtValue: string,
    isConfigured: boolean
  ): Promise<void> {
    await this.api.upsertValMaps.upsertValMapsCreate({
      Id: `'${mappingId}'`, // API erwartet IDs in einfachen Anführungszeichen
      Version: `'${version}'`,
      SrcAgency: `'${srcAgency}'`,
      SrcId: `'${srcId}'`,
      TgtAgency: `'${tgtAgency}'`,
      TgtId: `'${tgtId}'`,
      SrcValue: `'${srcValue}'`,
      TgtValue: `'${tgtValue}'`,
      IsConfigured: String(isConfigured) // API erwartet String 'true'/'false'
    });
  }

  /**
   * Aktualisiert den Default-Eintrag für ein Value Mapping Schema.
   *
   * @param {string} mappingId ID des Value Mappings
   * @param {string} version Version des Value Mappings
   * @param {string} srcAgency Source Agency
   * @param {string} srcId Source ID
   * @param {string} tgtAgency Target Agency
   * @param {string} tgtId Target ID
   * @param {string} valMapId ID des Value Mappings (ValMaps entry ID)
   * @param {boolean} isConfigured Gibt an, ob das Schema konfiguriert ist
   * @returns {Promise<void>} Promise, der aufgelöst wird, wenn der Default-Eintrag aktualisiert wurde
   *
   * @example
   * await client.updateDefaultValueMappingEntry(
   *   'MyValueMapId', 'active', 'AgencyA', 'ID1', 'AgencyB', 'ID2', 'valMapEntry123', true
   * );
   */
  async updateDefaultValueMappingEntry(
    mappingId: string, 
    version: string, 
    srcAgency: string, 
    srcId: string, 
    tgtAgency: string, 
    tgtId: string,
    valMapId: string,
    isConfigured: boolean
  ): Promise<void> {
    await this.api.updateDefaultValMap.updateDefaultValMapCreate({
      Id: `'${mappingId}'`,
      Version: `'${version}'`,
      SrcAgency: `'${srcAgency}'`,
      SrcId: `'${srcId}'`,
      TgtAgency: `'${tgtAgency}'`,
      TgtId: `'${tgtId}'`,
      ValMapId: valMapId, // Diese ID wird nicht in Anführungszeichen erwartet
      IsConfigured: String(isConfigured)
    });
  }

  /**
   * Löscht ein Value Mapping Schema (Code List Mapping) inklusive aller zugehörigen Einträge.
   *
   * @param {string} mappingId ID des Value Mappings
   * @param {string} version Version des Value Mappings
   * @param {string} srcAgency Source Agency
   * @param {string} srcId Source ID
   * @param {string} tgtAgency Target Agency
   * @param {string} tgtId Target ID
   * @returns {Promise<void>} Promise, der aufgelöst wird, wenn das Schema gelöscht wurde
   *
   * @example
   * await client.deleteValueMappingSchema(
   *   'MyValueMapId', 'active', 'AgencyA', 'ID1', 'AgencyB', 'ID2'
   * );
   */
  async deleteValueMappingSchema(
    mappingId: string, 
    version: string, 
    srcAgency: string, 
    srcId: string, 
    tgtAgency: string, 
    tgtId: string
  ): Promise<void> {
    await this.api.deleteValMaps.deleteValMapsCreate({
      Id: `'${mappingId}'`,
      Version: `'${version}'`,
      SrcAgency: `'${srcAgency}'`,
      SrcId: `'${srcId}'`,
      TgtAgency: `'${tgtAgency}'`,
      TgtId: `'${tgtId}'`
    });
  }

  // --- Script Collection Methods ---

  /**
   * Gibt alle Script Collections für ein bestimmtes Paket zurück.
   * 
   * @param {string} packageId ID des Integrationspakets
   * @returns {Promise<ComSapHciApiScriptCollectionDesigntimeArtifact[]>} Promise mit einer Liste von Script Collections
   * 
   * @example
   * const scripts = await client.getScriptCollections('MyPackageId');
   */
  async getScriptCollections(packageId: string): Promise<ComSapHciApiScriptCollectionDesigntimeArtifact[]> {
    const response = await this.api.integrationPackagesId.scriptCollectionDesigntimeArtifactsList(packageId);
    return this.normalizer.normalizeArrayResponse(response.data, 'getScriptCollections');
  }

  /**
   * Erstellt/lädt eine neue Script Collection hoch.
   *
   * @param {ComSapHciApiScriptCollectionDesigntimeArtifactCreate} scriptData Daten der zu erstellenden Script Collection
   * @returns {Promise<ComSapHciApiScriptCollectionDesigntimeArtifact | undefined>} Promise mit der erstellten Script Collection
   *
   * @example
   * const newScript = await client.createScriptCollection({
   *   Id: 'MyNewScriptCollection',
   *   Name: 'My New Script Collection',
   *   PackageId: 'MyPackageId',
   *   ArtifactContent: 'base64encodedZipContent' // Base64 kodierter ZIP-Inhalt
   * });
   */
  async createScriptCollection(scriptData: ComSapHciApiScriptCollectionDesigntimeArtifactCreate): Promise<ComSapHciApiScriptCollectionDesigntimeArtifact | undefined> {
    const response = await this.api.scriptCollectionDesigntimeArtifacts.scriptCollectionDesigntimeArtifactsCreate(scriptData);
    return response.data?.d;
  }

  /**
   * Gibt eine bestimmte Script Collection anhand ihrer ID und Version zurück.
   *
   * @param {string} scriptId ID der Script Collection
   * @param {string} [version='active'] Version der Script Collection
   * @returns {Promise<ComSapHciApiScriptCollectionDesigntimeArtifact | undefined>} Promise mit der Script Collection
   *
   * @example
   * const script = await client.getScriptCollectionById('MyScriptCollectionId', '1.1.0');
   */
  async getScriptCollectionById(scriptId: string, version = 'active'): Promise<ComSapHciApiScriptCollectionDesigntimeArtifact | undefined> {
    const response = await this.api.scriptCollectionDesigntimeArtifactsIdIdVersionVersion.scriptCollectionDesigntimeArtifactsIdVersionList(
      scriptId,
      version
    );
    return this.normalizer.normalizeEntityResponse(response.data, 'getScriptCollectionById');
  }

  /**
   * Aktualisiert eine vorhandene Script Collection.
   *
   * @param {string} scriptId ID der zu aktualisierenden Script Collection
   * @param {string} version Version der zu aktualisierenden Script Collection
   * @param {ComSapHciApiScriptCollectionDesigntimeArtifactUpdate} scriptData Die zu aktualisierenden Daten
   * @returns {Promise<void>} Promise, der aufgelöst wird, wenn die Script Collection aktualisiert wurde
   *
   * @example
   * await client.updateScriptCollection('MyScriptCollectionId', '1.1.0', {
   *   Name: 'Updated Script Collection Name',
   *   ArtifactContent: 'newBase64encodedZipContent'
   * });
   */
  async updateScriptCollection(scriptId: string, version: string, scriptData: ComSapHciApiScriptCollectionDesigntimeArtifactUpdate): Promise<void> {
    await this.api.scriptCollectionDesigntimeArtifactsIdIdVersionVersion.scriptCollectionDesigntimeArtifactsIdVersionUpdate(
      scriptId,
      version,
      scriptData
    );
  }

  /**
   * Löscht eine Script Collection anhand ihrer ID und Version.
   *
   * @param {string} scriptId ID der zu löschenden Script Collection
   * @param {string} version Version der zu löschenden Script Collection
   * @returns {Promise<void>} Promise, der aufgelöst wird, wenn die Script Collection gelöscht wurde
   *
   * @example
   * await client.deleteScriptCollection('MyScriptCollectionId', '1.1.0');
   */
  async deleteScriptCollection(scriptId: string, version: string): Promise<void> {
    await this.api.scriptCollectionDesigntimeArtifactsIdIdVersionVersion.scriptCollectionDesigntimeArtifactsIdVersionDelete(scriptId, version);
  }

  /**
   * Lädt eine Script Collection als ZIP-Datei herunter.
   *
   * Der Rückgabetyp `File` ist primär für Browser-Umgebungen relevant. In Node.js
   * müsste die Response anders behandelt werden (z.B. als Stream oder Buffer).
   *
   * @param {string} scriptId ID der herunterzuladenden Script Collection
   * @param {string} [version='active'] Version der herunterzuladenden Script Collection
   * @returns {Promise<File>} Promise mit der heruntergeladenen Datei (im Browser-Kontext)
   *
   * @example
   * // Im Browser:
   * try {
   *   const file = await client.downloadScriptCollection('MyScriptCollectionId');
   *   // ... (Code zum Speichern der Datei)
   * } catch (error) {
   *   console.error('Download failed:', error);
   * }
   */
  async downloadScriptCollection(scriptId: string, version = 'active'): Promise<File> {
    const response = await this.api.scriptCollectionDesigntimeArtifactsIdIdVersionVersion.valueList(scriptId, version);
    return response.data as File;
  }

  /**
   * Deployed eine Script Collection.
   *
   * @param {string} scriptId ID der zu deployenden Script Collection
   * @param {string} [version='active'] Version der Script Collection
   * @returns {Promise<void>} Promise, der aufgelöst wird, wenn das Deployment gestartet wurde
   *
   * @example
   * await client.deployScriptCollection('MyScriptCollectionId');
   */
  async deployScriptCollection(scriptId: string, version = 'active'): Promise<void> {
    await this.api.deployScriptCollectionDesigntimeArtifact.deployScriptCollectionDesigntimeArtifactCreate({
      Id: `'${scriptId}'`, // API erwartet ID in einfachen Anführungszeichen
      Version: `'${version}'` // API erwartet Version in einfachen Anführungszeichen
    });
  }

  /**
   * Speichert eine Script Collection unter einer neuen Version.
   *
   * @param {string} scriptId ID der Script Collection
   * @param {string} newVersion Die neue Versionsnummer (z.B. '1.0.1')
   * @returns {Promise<void>} Promise, der aufgelöst wird, wenn die neue Version gespeichert wurde
   *
   * @example
   * await client.saveScriptCollectionAsVersion('MyScriptCollectionId', '1.0.1');
   */
  async saveScriptCollectionAsVersion(scriptId: string, newVersion: string): Promise<void> {
    await this.api.scriptCollectionDesigntimeArtifactSaveAsVersion.scriptCollectionDesigntimeArtifactSaveAsVersionCreate({
      Id: scriptId,
      SaveAsVersion: newVersion
    });
  }

  // --- Script Collection Resource Methods ---

  /**
   * Fügt eine Ressource zu einer Script Collection hinzu.
   * 
   * @param {string} scriptId ID der Script Collection
   * @param {string} version Version der Script Collection
   * @param {ComSapHciApiResourceCreate} resourceData Daten der hinzuzufügenden Ressource (Name, ResourceType, ResourceContent)
   * @returns {Promise<ComSapHciApiResource | undefined>} Promise mit der hinzugefügten Ressource
   * 
   * @example
   * const resource = await client.addScriptCollectionResource('MyScriptId', 'active', {
   *   Name: 'myScript.groovy',
   *   ResourceType: 'groovy',
   *   ResourceContent: 'base64EncodedScriptContent'
   * });
   */
  async addScriptCollectionResource(
    scriptId: string, 
    version: string, 
    resourceData: ComSapHciApiResourceCreate
  ): Promise<ComSapHciApiResource | undefined> {
    // Die API erwartet hier einen spezielleren Typ, wir casten ihn.
    const response = await this.api.scriptCollectionDesigntimeArtifactsIdIdVersionVersion.resourcesCreate(
      scriptId, 
      version, 
      resourceData as ComSapHciApiScriptCollectionDesigntimeArtifactCreate
    );
    return response.data?.d;
  }

  /**
   * Aktualisiert eine Ressource innerhalb einer Script Collection.
   * 
   * @param {string} scriptId ID der Script Collection
   * @param {string} version Version der Script Collection
   * @param {string} resourceName Name der zu aktualisierenden Ressource
   * @param {string} resourceType Typ der zu aktualisierenden Ressource ('groovy', 'jar', 'js')
   * @param {ComSapHciApiResourceUpdate} resourceUpdate Daten für das Update (nur ResourceContent)
   * @returns {Promise<void>} Promise, der aufgelöst wird, wenn die Ressource aktualisiert wurde
   * 
   * @example
   * await client.updateScriptCollectionResource(
   *   'MyScriptId', 'active', 'myScript.groovy', 'groovy', 
   *   { ResourceContent: 'newBase64EncodedScriptContent' }
   * );
   */
  async updateScriptCollectionResource(
    scriptId: string, 
    version: string, 
    resourceName: string, 
    resourceType: 'groovy' | 'jar' | 'js', 
    resourceUpdate: ComSapHciApiResourceUpdate
  ): Promise<void> {
    await this.api.scriptCollectionDesigntimeArtifactsIdIdVersionVersion.linksResourcesNameResourceTypeUpdate(
      scriptId, 
      version, 
      resourceName, 
      [resourceType], // API erwartet Array
      resourceUpdate
    );
  }

  /**
   * Löscht eine Ressource aus einer Script Collection.
   * 
   * @param {string} scriptId ID der Script Collection
   * @param {string} version Version der Script Collection
   * @param {string} resourceName Name der zu löschenden Ressource
   * @param {string} resourceType Typ der zu löschenden Ressource ('groovy', 'jar', 'js')
   * @returns {Promise<void>} Promise, der aufgelöst wird, wenn die Ressource gelöscht wurde
   * 
   * @example
   * await client.deleteScriptCollectionResource('MyScriptId', 'active', 'oldScript.jar', 'jar');
   */
  async deleteScriptCollectionResource(
    scriptId: string, 
    version: string, 
    resourceName: string, 
    resourceType: 'groovy' | 'jar' | 'js'
  ): Promise<void> {
    await this.api.scriptCollectionDesigntimeArtifactsIdIdVersionVersion.linksResourcesNameResourceTypeDelete(
      scriptId, 
      version, 
      resourceName, 
      [resourceType] // API erwartet Array
    );
  }

  // --- Integration Flow Resource Methods ---

  /**
   * Gibt alle Ressourcen für einen bestimmten Integrationsflow und Version zurück.
   * 
   * @param {string} flowId ID des Integrationsflows
   * @param {string} [version='active'] Version des Integrationsflows
   * @param {Object} options Optionale OData-Query-Parameter ($filter, $select, $orderby)
   * @returns {Promise<ComSapHciApiResource[]>} Promise mit einer Liste von Ressourcen
   * 
   * @example
   * const resources = await client.getIntegrationFlowResources('MyFlowId');
   * const wsdlResources = await client.getIntegrationFlowResources('MyFlowId', 'active', {
   *   $filter: "ResourceType eq 'wsdl'"
   * });
   */
  async getIntegrationFlowResources(
    flowId: string, 
    version = 'active', 
    options: { 
      $filter?: string; 
      $select?: ("Name" | "ResourceType" | "ReferencedResourceType")[];
      $orderby?: ( "Name" | "Name desc" | "ResourceType" | "ResourceType desc" | "Name,ResourceType" | "Name desc,ResourceType desc" )[]; 
    } = {}
  ): Promise<ComSapHciApiResource[]> {
    const response = await this.api.integrationDesigntimeArtifactsIdIdVersionVersion.resourcesList(
      flowId, 
      version, 
      options
    );
    return this.normalizer.normalizeArrayResponse(response.data, 'getIntegrationFlowResources');
  }

  /**
   * Fügt eine Ressource zu einem Integrationsflow hinzu.
   * 
   * @param {string} flowId ID des Integrationsflows
   * @param {string} version Version des Integrationsflows
   * @param {ComSapHciApiResourceCreate} resourceData Daten der hinzuzufügenden Ressource
   * @returns {Promise<ComSapHciApiResource | undefined>} Promise mit der hinzugefügten Ressource
   * 
   * @example
   * const newResource = await client.addIntegrationFlowResource('MyFlowId', '1.0.0', {
   *   Name: 'mySchema.xsd',
   *   ResourceType: 'xsd',
   *   ResourceContent: 'base64EncodedSchemaContent'
   * });
   */
  async addIntegrationFlowResource(
    flowId: string, 
    version: string, 
    resourceData: ComSapHciApiResourceCreate
  ): Promise<ComSapHciApiResource | undefined> {
    const response = await this.api.integrationDesigntimeArtifactsIdIdVersionVersion.resourcesCreate(
      flowId, 
      version, 
      resourceData
    );
    return response.data?.d;
  }

  /**
   * Gibt die Anzahl der Ressourcen für einen bestimmten Integrationsflow zurück.
   *
   * @param {string} flowId ID des Integrationsflows
   * @param {string} [version='active'] Version des Integrationsflows
   * @param {string} [filter] Optionaler OData-Filterausdruck
   * @returns {Promise<number>} Promise mit der Anzahl der Ressourcen
   *
   * @example
   * const resourceCount = await client.getIntegrationFlowResourceCount('MyFlowId');
   */
  async getIntegrationFlowResourceCount(flowId: string, version = 'active', filter?: string): Promise<number> {
    const response = await this.api.integrationDesigntimeArtifactsIdIdVersionVersion.resourcesCountList(
      flowId, 
      version, 
      { $filter: filter }
    );
    const countString = response.data as unknown as string;
    return parseInt(countString || '0', 10);
  }

  /**
   * Gibt eine spezifische Ressource eines Integrationsflows zurück.
   * 
   * @param {string} flowId ID des Integrationsflows
   * @param {string} version Version des Integrationsflows
   * @param {string} resourceName Name der Ressource
   * @param {string[]} resourceType Typ der Ressource (als Array, z.B. ['xsd'])
   * @param {'wsdl'[]} [referencedResourceType] Referenzierter Ressourcentyp (nur für XSD -> WSDL)
   * @returns {Promise<ComSapHciApiResource | undefined>} Promise mit der Ressource
   * 
   * @example
   * const resource = await client.getIntegrationFlowResource('MyFlowId', 'active', 'mySchema.xsd', ['xsd']);
   */
  async getIntegrationFlowResource(
    flowId: string, 
    version: string, 
    resourceName: string, 
    resourceType: ("edmx" | "groovy" | "jar" | "js" | "mmap" | "opmap" | "wsdl" | "xsd" | "xslt")[], 
    referencedResourceType?: 'wsdl'[]
  ): Promise<ComSapHciApiResource | undefined> {
    const response = await this.api.integrationDesigntimeArtifactsIdIdVersionVersion.resourcesNameResourceTypeList(
      flowId, 
      version, 
      resourceName, 
      resourceType, 
      { ReferencedResourceType: referencedResourceType }
    );
    return response.data?.d;
  }

  /**
   * Lädt den Inhalt einer spezifischen Ressource eines Integrationsflows herunter.
   * 
   * Der Rückgabetyp ist `void`, da der generierte Client hier `void` zurückgibt. 
   * In der Praxis müsste man die Response (Stream/Buffer) vermutlich anders verarbeiten,
   * um an den Inhalt zu kommen. Ggf. muss der generierte Client angepasst werden.
   * 
   * @param {string} flowId ID des Integrationsflows
   * @param {string} version Version des Integrationsflows
   * @param {string} resourceName Name der Ressource
   * @param {string[]} resourceType Typ der Ressource (als Array)
   * @param {'wsdl'[]} [referencedResourceType] Referenzierter Ressourcentyp
   * @returns {Promise<void>} Promise
   * 
   * @example
   * // ACHTUNG: Rückgabetyp ist void, Inhalt muss ggf. anders extrahiert werden.
   * await client.downloadIntegrationFlowResource('MyFlowId', 'active', 'myScript.groovy', ['groovy']); 
   */
  async downloadIntegrationFlowResource(
    flowId: string, 
    version: string, 
    resourceName: string, 
    resourceType: ("edmx" | "groovy" | "jar" | "js" | "mmap" | "opmap" | "wsdl" | "xsd" | "xslt")[], 
    referencedResourceType?: 'wsdl'[]
  ): Promise<void> { // Beachte: Rückgabetyp ist hier void!
    await this.api.integrationDesigntimeArtifactsIdIdVersionVersion.resourcesNameResourceTypeValueList(
      flowId, 
      version, 
      resourceName, 
      resourceType, 
      { ReferencedResourceType: referencedResourceType }
    );
    // Hier müsste ggf. die Response verarbeitet werden, um den Inhalt zu bekommen.
  }

  /**
   * Aktualisiert den Inhalt einer Ressource innerhalb eines Integrationsflows.
   * 
   * @param {string} flowId ID des Integrationsflows
   * @param {string} version Version des Integrationsflows
   * @param {string} resourceName Name der zu aktualisierenden Ressource
   * @param {string[]} resourceType Typ der zu aktualisierenden Ressource (als Array)
   * @param {ComSapHciApiResourceUpdate} resourceUpdate Daten für das Update (nur ResourceContent)
   * @param {'wsdl'[]} [referencedResourceType] Referenzierter Ressourcentyp
   * @returns {Promise<void>} Promise, der aufgelöst wird, wenn die Ressource aktualisiert wurde
   * 
   * @example
   * await client.updateIntegrationFlowResource(
   *   'MyFlowId', 'active', 'myScript.groovy', ['groovy'], 
   *   { ResourceContent: 'newBase64EncodedScriptContent' }
   * );
   */
  async updateIntegrationFlowResource(
    flowId: string, 
    version: string, 
    resourceName: string, 
    resourceType: ("edmx" | "groovy" | "jar" | "js" | "mmap" | "opmap" | "wsdl" | "xsd" | "xslt")[], 
    resourceUpdate: ComSapHciApiResourceUpdate,
    referencedResourceType?: 'wsdl'[]
  ): Promise<void> {
    await this.api.integrationDesigntimeArtifactsIdIdVersionVersion.linksResourcesNameResourceTypeUpdate(
      flowId, 
      version, 
      resourceName, 
      resourceType, 
      resourceUpdate,
      { ReferencedResourceType: referencedResourceType }
    );
  }

  /**
   * Löscht eine Ressource aus einem Integrationsflow.
   * 
   * @param {string} flowId ID des Integrationsflows
   * @param {string} version Version des Integrationsflows
   * @param {string} resourceName Name der zu löschenden Ressource
   * @param {string[]} resourceType Typ der zu löschenden Ressource (als Array)
   * @param {'wsdl'[]} [referencedResourceType] Referenzierter Ressourcentyp
   * @returns {Promise<void>} Promise, der aufgelöst wird, wenn die Ressource gelöscht wurde
   * 
   * @example
   * await client.deleteIntegrationFlowResource('MyFlowId', 'active', 'oldSchema.xsd', ['xsd']);
   */
  async deleteIntegrationFlowResource(
    flowId: string, 
    version: string, 
    resourceName: string, 
    resourceType: ("edmx" | "groovy" | "jar" | "js" | "mmap" | "opmap" | "wsdl" | "xsd" | "xslt")[],
    referencedResourceType?: 'wsdl'[]
  ): Promise<void> {
    await this.api.integrationDesigntimeArtifactsIdIdVersionVersion.linksResourcesNameResourceTypeDelete(
      flowId, 
      version, 
      resourceName, 
      resourceType,
      { ReferencedResourceType: referencedResourceType }
    );
  }

  // --- Integration Package Copy --- 

  /**
   * Kopiert ein Integrationspaket aus dem 'Discover'-Bereich in den 'Design'-Bereich.
   * 
   * @param {string} packageId ID des zu kopierenden Pakets
   * @param {'CREATE_COPY' | 'OVERWRITE' | 'OVERWRITE_MERGE'} [importMode='CREATE_COPY'] Importmodus
   * @param {string} [suffix] Suffix für Name/ID, falls ImportMode='CREATE_COPY' und Paket existiert
   * @returns {Promise<ComSapHciApiIntegrationPackage | undefined>} Das kopierte oder erstellte Paket
   * 
   * @example
   * // Paket kopieren, überschreiben falls vorhanden
   * const copiedPackage = await client.copyIntegrationPackage('StandardPackageId', 'OVERWRITE');
   *
   * // Kopie mit Suffix erstellen
   * const copiedPackageWithSuffix = await client.copyIntegrationPackage('StandardPackageId', 'CREATE_COPY', 'MySuffix');
   */
  async copyIntegrationPackage(
    packageId: string,
    importMode: "'CREATE_COPY'" | "'OVERWRITE'" | "'OVERWRITE_MERGE'" = "'CREATE_COPY'",
    suffix?: string
  ): Promise<ComSapHciApiIntegrationPackage | undefined> {
    const response = await this.api.copyIntegrationPackage.copyIntegrationPackageCreate({
      Id: `'${packageId}'`, // API erwartet ID in einfachen Anführungszeichen
      ImportMode: [importMode],
      Suffix: suffix ? `'${suffix}'` : undefined // Suffix auch in Anführungszeichen
    });
    return response.data?.d;
  }

  // --- Custom Tag Methods ---

  /**
   * Gibt die Custom Tags für ein bestimmtes Integrationspaket zurück.
   * 
   * @param {string} packageId ID des Integrationspakets
   * @param {Object} options Optionale OData-Query-Parameter ($top, $skip, $orderby)
   * @returns {Promise<any[]>} Promise mit einer Liste von Custom Tags (Typ ist unspezifisch, da API 'void' zurückgibt)
   * 
   * @example
   * const tags = await client.getCustomTagsForPackage('MyPackageId');
   */
  async getCustomTagsForPackage(
    packageId: string, 
    options: { top?: number; skip?: number; orderby?: ("Name" | "Name desc")[] } = {}
  ): Promise<any[]> { // Typ ist hier 'any[]', da API 'void' definiert, aber Daten zurückgibt
    const response = await this.api.integrationPackagesId.customTagsList(packageId, {
      $top: options.top,
      $skip: options.skip,
      $orderby: options.orderby
    });
    // Annahme: Die Daten sind in response.data, obwohl Typ 'void' ist.
    // Ggf. muss der generierte Client angepasst werden oder der Typ hier genauer sein.
    return (response.data as any)?.d?.results || []; 
  }

  /**
   * Aktualisiert den Wert eines Custom Tags für ein Integrationspaket.
   *
   * @param {string} packageId ID des Integrationspakets
   * @param {string} tagName Name des Custom Tags
   * @param {string} value Neuer Wert für das Custom Tag
   * @returns {Promise<void>} Promise, der aufgelöst wird, wenn das Tag aktualisiert wurde
   *
   * @example
   * await client.updateCustomTagForPackage('MyPackageId', 'Author', 'New Author');
   */
  async updateCustomTagForPackage(packageId: string, tagName: string, value: string): Promise<void> {
    const updateData: ComSapHciApiCustomTagsUpdate = { Value: value }; // Explicit type added
    await this.api.integrationPackagesId.linksCustomTagsUpdate(packageId, tagName, updateData);
  }

  /**
   * Gibt die globale Custom Tag Konfiguration zurück.
   *
   * @returns {Promise<ComSapHciApiCustomTagsConfiguration['customTagsConfiguration'] | undefined>} Promise mit der Konfiguration
   *
   * @example
   * const config = await client.getCustomTagsConfiguration();
   * if (config) {
   *   config.forEach(tag => console.log(tag.tagName, tag.isMandatory));
   * }
   */
  async getCustomTagsConfiguration(): Promise<ComSapHciApiCustomTagsConfiguration['customTagsConfiguration'] | undefined> {
    const response = await this.api.customTagConfigurationsCustomTags.valueList();
    // Die API gibt hier ein Array zurück, obwohl der Pfad auf 'CustomTags' endet.
    // Wir nehmen an, dass das erste Element die relevante Konfiguration enthält.
    const configData = response.data?.value?.[0] as ComSapHciApiCustomTagsConfiguration | undefined;
    return configData?.customTagsConfiguration;
  }

  /**
   * Lädt eine neue globale Custom Tag Konfiguration hoch.
   *
   * @param {ComSapHciApiCustomTagsConfigurationCreate} configData Die hochzuladende Konfiguration (Base64-kodierter JSON-String)
   * @returns {Promise<void>} Promise, der aufgelöst wird, wenn die Konfiguration hochgeladen wurde
   *
   * @example
   * const configJson = JSON.stringify({ 
   *   customTagsConfiguration: [ { tagName: 'NewTag', isMandatory: false } ] 
   * });
   * const base64Config = Buffer.from(configJson).toString('base64url'); // Node.js Beispiel
   * await client.uploadCustomTagsConfiguration({ customTagsConfiguration: base64Config });
   */
  async uploadCustomTagsConfiguration(configData: ComSapHciApiCustomTagsConfigurationCreate): Promise<void> {
    await this.api.customTagConfigurations.customTagConfigurationsCreate(configData);
  }

  // --- Design Guideline Methods ---

  /**
   * Führt die Design Guideline Prüfung für einen Integrationsflow aus.
   *
   * @param {string} flowId ID des Integrationsflows
   * @param {string} [version='active'] Version des Integrationsflows
   * @returns {Promise<void>} Promise, der aufgelöst wird, wenn die Ausführung gestartet wurde
   *
   * @example
   * await client.executeDesignGuidelines('MyFlowId');
   */
  async executeDesignGuidelines(flowId: string, version = 'active'): Promise<void> {
    await this.api.executeIntegrationDesigntimeArtifactsGuidelines.executeIntegrationDesigntimeArtifactsGuidelinesCreate({
      Id: flowId,
      Version: version
    });
  }

  /**
   * Gibt die Ausführungsergebnisse der Design Guidelines für einen Integrationsflow zurück.
   *
   * @param {string} flowId ID des Integrationsflows
   * @param {string} [version='active'] Version des Integrationsflows
   * @returns {Promise<ComSapHciApiDesignGuidlineExecutionResult[]>} Promise mit einer Liste von Ausführungsergebnissen // Reverted to use the type with typo
   *
   * @example
   * const results = await client.getDesignGuidelineExecutionResults('MyFlowId');
   * results.forEach(result => console.log(`Execution ${result.ExecutionId}: ${result.ExecutionStatus}`));
   */
  async getDesignGuidelineExecutionResults(
    flowId: string, 
    version = 'active'
  ): Promise<ComSapHciApiDesignGuidlineExecutionResult[]> {
    const response = await this.api.integrationDesigntimeArtifactsIdIdVersionVersion.designGuidelineExecutionResultsList(
      flowId, 
      version
    );
    return response.data?.value || [];
  }

  /**
   * Gibt ein spezifisches Ausführungsergebnis der Design Guidelines zurück.
   * 
   * Hinweis: Der generierte Client hat hier eine doppelte Methode `designGuidelineExecutionResultsList2`.
   *
   * @param {string} flowId ID des Integrationsflows
   * @param {string} version Version des Integrationsflows
   * @param {string} executionId ID der Ausführung
   * @param {boolean} [expandDesignGuidelines=false] Ob die Details der Guidelines mitgeladen werden sollen
   * @returns {Promise<ComSapHciApiDesignGuidlineExecutionResult | undefined>} Promise mit dem Ausführungsergebnis // Reverted to use the type with typo
   *
   * @example
   * const result = await client.getDesignGuidelineExecutionResultById('MyFlowId', 'active', 'exec123', true);
   */
  async getDesignGuidelineExecutionResultById(
    flowId: string, 
    version: string, 
    executionId: string,
    expandDesignGuidelines = false
  ): Promise<ComSapHciApiDesignGuidlineExecutionResult | undefined> {
    const response = await this.api.integrationDesigntimeArtifactsIdIdVersionVersion.designGuidelineExecutionResultsList2(
      flowId, 
      version, 
      executionId,
      { $expand: expandDesignGuidelines ? ["DesignGuidelines"] : undefined }
    );
    // Die API gibt ein Array zurück, wir erwarten aber nur ein Element.
    return response.data?.value?.[0];
  }

  /**
   * Lädt den Report eines Design Guideline Ausführungsergebnisses herunter.
   *
   * Der Rückgabetyp `File` ist primär für Browser-Umgebungen relevant. In Node.js
   * müsste die Response anders behandelt werden (z.B. als Stream oder Buffer).
   *
   * @param {string} flowId ID des Integrationsflows
   * @param {string} version Version des Integrationsflows
   * @param {string} executionId ID der Ausführung
   * @param {string} [reportType] Typ des Reports (z.B. 'pdf')
   * @returns {Promise<File>} Promise mit der heruntergeladenen Datei
   *
   * @example
   * try {
   *   const reportFile = await client.downloadDesignGuidelineExecutionReport('MyFlowId', 'active', 'exec123', 'pdf');
   *   // ... (Code zum Speichern der Datei)
   * } catch (error) {
   *   console.error('Download failed:', error);
   * }
   */
  async downloadDesignGuidelineExecutionReport(
    flowId: string, 
    version: string, 
    executionId: string, 
    reportType?: string
  ): Promise<File> {
    const response = await this.api.integrationDesigntimeArtifactsIdIdVersionVersion.designGuidelineExecutionResultsValueList(
      flowId, 
      version, 
      executionId,
      { type: reportType }
    );
    return response.data as File;
  }

  /**
   * Überspringt eine Design Guideline oder macht das Überspringen rückgängig.
   *
   * @param {string} flowId ID des Integrationsflows
   * @param {string} version Version des Integrationsflows
   * @param {string} executionId ID der Ausführung
   * @param {ComSapHciApiDesignGuidelineExecutionResultsSkip} skipData Daten zum Überspringen/Rückgängigmachen
   * @returns {Promise<void>} Promise, der aufgelöst wird, wenn die Aktion ausgeführt wurde
   *
   * @example
   * // Guideline überspringen
   * await client.skipOrRevertDesignGuideline('MyFlowId', 'active', 'exec123', {
   *   GudelineId: 'Guideline1', // Beachte Typo in API GudelineId
   *   IsGuidelineSkipped: true,
   *   SkipReason: 'Not applicable'
   * });
   *
   * // Überspringen rückgängig machen
   * await client.skipOrRevertDesignGuideline('MyFlowId', 'active', 'exec123', {
   *   GudelineId: 'Guideline1',
   *   IsGuidelineSkipped: false
   * });
   */
  async skipOrRevertDesignGuideline(
    flowId: string, 
    version: string, 
    executionId: string, 
    skipData: ComSapHciApiDesignGuidelineExecutionResultsSkip
  ): Promise<void> {
    await this.api.integrationDesigntimeArtifactsIdIdVersionVersion.linksDesignGuidelineExecutionResultsUpdate(
      flowId, 
      version, 
      executionId, 
      skipData
    );
  }

  // --- Runtime Artifact Count --- 

  /**
   * Gibt die Anzahl aller deployten Integrationsartefakte zurück.
   *
   * @param {string} [filter] Optionaler OData-Filterausdruck
   * @returns {Promise<number>} Promise mit der Anzahl der deployten Artefakte
   *
   * @example
   * const totalDeployed = await client.getDeployedArtifactCount();
   * const errorCount = await client.getDeployedArtifactCount("Status eq 'ERROR'");
   */
  async getDeployedArtifactCount(filter?: string): Promise<number> {
    const response = await this.api.integrationRuntimeArtifacts.countList({ $filter: filter });
    const countString = response.data as unknown as string;
    return parseInt(countString || '0', 10);
  }

  // --- Integration Adapter Methods (Cloud Foundry only) ---

  /**
   * Importiert einen Integrationsadapter (.esa Datei).
   * Nur in Cloud Foundry verfügbar.
   *
   * @param {ComSapHciApiIntegrationAdapterDesigntimeArtifactImport} adapterData Importdaten (PackageId, ArtifactContent)
   * @returns {Promise<ComSapHciApiIntegrationAdapterDesigntimeArtifact | undefined>} Promise mit dem importierten Adapter
   *
   * @example
   * const adapter = await client.importIntegrationAdapter({
   *   PackageId: 'MyAdapterPackage',
   *   ArtifactContent: 'base64EncodedEsaContent'
   * });
   */
  async importIntegrationAdapter(adapterData: ComSapHciApiIntegrationAdapterDesigntimeArtifactImport): Promise<ComSapHciApiIntegrationAdapterDesigntimeArtifact | undefined> {
    const response = await this.api.integrationAdapterDesigntimeArtifacts.integrationAdapterDesigntimeArtifactsCreate(adapterData);
    return response.data?.d;
  }

  /**
   * Deployed einen Integrationsadapter.
   * Nur in Cloud Foundry verfügbar.
   *
   * @param {string} adapterId ID des zu deployenden Adapters
   * @returns {Promise<void>} Promise, der aufgelöst wird, wenn das Deployment gestartet wurde
   *
   * @example
   * await client.deployIntegrationAdapter('MyCustomAdapterId');
   */
  async deployIntegrationAdapter(adapterId: string): Promise<void> {
    await this.api.deployIntegrationAdapterDesigntimeArtifact.deployIntegrationAdapterDesigntimeArtifactCreate({
      Id: `'${adapterId}'` // API erwartet ID in einfachen Anführungszeichen
    });
  }

  /**
   * Löscht einen Integrationsadapter.
   * Nur in Cloud Foundry verfügbar.
   *
   * @param {string} adapterId ID des zu löschenden Adapters
   * @returns {Promise<void>} Promise, der aufgelöst wird, wenn der Adapter gelöscht wurde
   *
   * @example
   * await client.deleteIntegrationAdapter('MyCustomAdapterId');
   */
  async deleteIntegrationAdapter(adapterId: string): Promise<void> {
    await this.api.integrationAdapterDesigntimeArtifactsIdId.integrationAdapterDesigntimeArtifactsIdDelete(adapterId);
  }

  // --- MDI Delta Token Methods ---

  /**
   * Ruft das Delta Token für den MDI Receiver Adapter ab.
   * 
   * @param {string} operation Operation (z.B. 'READ')
   * @param {string} entity Entität (z.B. 'BusinessPartner')
   * @param {string} version Version (z.B. '1.0')
   * @returns {Promise<ComSapHciApiMDIDeltaToken['d'] | undefined>} Promise mit den Delta Token Informationen
   * 
   * @example
   * const tokenInfo = await client.getMdiDeltaToken('READ', 'BusinessPartner', '1.0');
   * if (tokenInfo) {
   *   console.log('Delta Token:', tokenInfo.DeltaToken);
   * }
   */
  async getMdiDeltaToken(operation: string, entity: string, version: string): Promise<ComSapHciApiMDIDeltaToken['d'] | undefined> {
    const response = await this.api.mdiDeltaTokenOperationOperationEntityEntityVersionVersion.mdiDeltaTokenOperationEntityVersionList(
      operation, 
      entity, 
      version
    );
    return response.data?.d?.d; // Double nesting in response
  }

  /**
   * Löscht das Delta Token für den MDI Receiver Adapter.
   * 
   * @param {string} operation Operation (z.B. 'READ')
   * @param {string} entity Entität (z.B. 'BusinessPartner')
   * @param {string} version Version (z.B. '1.0')
   * @returns {Promise<void>} Promise, der aufgelöst wird, wenn das Token gelöscht wurde
   * 
   * @example
   * await client.deleteMdiDeltaToken('READ', 'BusinessPartner', '1.0');
   */
  async deleteMdiDeltaToken(operation: string, entity: string, version: string): Promise<void> {
    await this.api.mdiDeltaTokenOperationOperationEntityEntityVersionVersion.mdiDeltaTokenOperationEntityVersionDelete(
      operation, 
      entity, 
      version
    );
  }
} 