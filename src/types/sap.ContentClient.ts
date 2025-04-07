/**
 * SAP Integration Content Client - Typdefinitionen
 * 
 * Diese Datei enthält benutzerdefinierte Typen und Interfaces, die vom
 * Integration Content Client verwendet werden.
 */

import { 
  ComSapHciApiIntegrationPackage, 
  ComSapHciApiIntegrationDesigntimeArtifact,
  ComSapHciApiMessageMappingDesigntimeArtifact,
  ComSapHciApiValueMappingDesigntimeArtifact,
  ComSapHciApiScriptCollectionDesigntimeArtifact,
  ComSapHciApiRuntimeArtifactErrorInformation
} from './sap.IntegrationContent';

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
 * Erweiterte Fehlerinformationen für Integrationsartefakte
 * Enthält zusätzliche Felder für detaillierte Fehlerinformationen, die vom $value-Endpunkt abgerufen wurden
 */
export interface DetailedErrorInformation extends ComSapHciApiRuntimeArtifactErrorInformation {
  /** Die Fehlernachricht */
  message?: {
    /** Subsystem, in dem der Fehler aufgetreten ist */
    subsystemName?: string;
    /** Teil des Subsystems, in dem der Fehler aufgetreten ist */
    subsytemPartName?: string;
    /** Fehler-ID/Code */
    messageId?: string;
    /** Fehlertext */
    messageText?: string;
  };
  /** Fehlerparameter (oft ein JSON-String) */
  parameter?: string[];
}

/**
 * Geparste Fehlerparameter-Details
 */
export interface ParsedErrorDetails {
  /** Fehlernachricht */
  message?: string;
  /** Fehlerparameter */
  parameters?: string[];
  /** Untergeordnete Fehlerinstanzen (Ursachen) */
  childMessageInstances?: Array<{
    /** Fehlernachricht der Ursache */
    message?: string;
    /** Parameter der Ursache */
    parameters?: string[];
  }>;
} 