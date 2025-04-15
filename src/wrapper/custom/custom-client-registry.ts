/**
 * Registry für benutzerdefinierte Client-Erweiterungen
 * 
 * Diese Datei bietet eine zentrale Registry für alle verfügbaren 
 * benutzerdefinierten Client-Erweiterungen. Sie erleichtert das
 * dynamische Laden und Instanziieren von erweiterten Clients.
 * 
 * @module sap-integration-suite-client/custom-registry
 */

import { BaseCustomClient, CustomClientFactory } from './base-custom-client';
import { 
  IntegrationContentAdvancedClient, 
  IntegrationContentAdvancedClientFactory 
} from './integration-content-advanced-client';
import {
  MessageProcessingLogsAdvancedClient,
  MessageProcessingLogsAdvancedClientFactory
} from './message-processing-logs-advanced-client';
import { IntegrationContentClient } from '../integration-content-client';
import { MessageProcessingLogsClient } from '../message-processing-logs-client';

/**
 * Typen von benutzerdefinierten Clients, die in der Registry registriert sind
 */
export enum CustomClientType {
  /**
   * Erweiterter Integration Content Client
   */
  INTEGRATION_CONTENT_ADVANCED = 'integration-content-advanced',
  
  /**
   * Erweiterter Message Processing Logs Client
   */
  MESSAGE_PROCESSING_LOGS_ADVANCED = 'message-processing-logs-advanced',
  
  // In Zukunft weitere Custom Client Typen hier hinzufügen
}

/**
 * Registry für benutzerdefinierte Client-Factories
 * 
 * Diese Klasse verwaltet alle verfügbaren benutzerdefinierten Client-Erweiterungen
 * und ermöglicht den einheitlichen Zugriff darauf.
 */
export class CustomClientRegistry {
  /**
   * Singleton-Instanz der Registry
   */
  private static instance: CustomClientRegistry;
  
  /**
   * Map der registrierten Factory-Instanzen
   */
  private factories: Map<string, CustomClientFactory<any, any>> = new Map();
  
  /**
   * Privater Konstruktor für Singleton-Pattern
   */
  private constructor() {
    // Registriere Standard-Factories
    this.registerDefaults();
  }
  
  /**
   * Gibt die Singleton-Instanz der Registry zurück
   * 
   * @returns Die CustomClientRegistry-Instanz
   */
  public static getInstance(): CustomClientRegistry {
    if (!CustomClientRegistry.instance) {
      CustomClientRegistry.instance = new CustomClientRegistry();
    }
    return CustomClientRegistry.instance;
  }
  
  /**
   * Registriert die Standard-Factories
   */
  private registerDefaults(): void {
    this.register(
      CustomClientType.INTEGRATION_CONTENT_ADVANCED, 
      new IntegrationContentAdvancedClientFactory()
    );
    
    this.register(
      CustomClientType.MESSAGE_PROCESSING_LOGS_ADVANCED,
      new MessageProcessingLogsAdvancedClientFactory()
    );
    
    // In Zukunft weitere Standard-Factories hier registrieren
  }
  
  /**
   * Registriert eine benutzerdefinierte Client-Factory
   * 
   * @param type - Der Typ des benutzerdefinierten Clients
   * @param factory - Die Factory für die Erstellung des Clients
   */
  public register<T, C extends BaseCustomClient<T>>(
    type: string,
    factory: CustomClientFactory<T, C>
  ): void {
    this.factories.set(type, factory);
  }
  
  /**
   * Erstellt einen benutzerdefinierten Client mit dem angegebenen Typ
   * 
   * @param type - Der Typ des zu erstellenden benutzerdefinierten Clients
   * @param baseClient - Der zugrundeliegende Standard-Client
   * @returns Eine Instanz des benutzerdefinierten Clients
   * @throws Error, wenn kein passender Factory für den angegebenen Typ gefunden wurde
   */
  public create<T, C extends BaseCustomClient<T>>(
    type: string,
    baseClient: T
  ): C {
    const factory = this.factories.get(type) as CustomClientFactory<T, C>;
    
    if (!factory) {
      throw new Error(`Kein Factory für den Typ '${type}' registriert.`);
    }
    
    return factory.create(baseClient);
  }
  
  /**
   * Erstellt einen IntegrationContentAdvancedClient
   * 
   * @param baseClient - Der zugrundeliegende IntegrationContentClient
   * @returns Eine Instanz des IntegrationContentAdvancedClient
   */
  public createIntegrationContentAdvancedClient(
    baseClient: IntegrationContentClient
  ): IntegrationContentAdvancedClient {
    return this.create<IntegrationContentClient, IntegrationContentAdvancedClient>(
      CustomClientType.INTEGRATION_CONTENT_ADVANCED,
      baseClient
    );
  }
  
  /**
   * Erstellt einen MessageProcessingLogsAdvancedClient
   * 
   * @param baseClient - Der zugrundeliegende MessageProcessingLogsClient
   * @returns Eine Instanz des MessageProcessingLogsAdvancedClient
   */
  public createMessageProcessingLogsAdvancedClient(
    baseClient: MessageProcessingLogsClient
  ): MessageProcessingLogsAdvancedClient {
    return this.create<MessageProcessingLogsClient, MessageProcessingLogsAdvancedClient>(
      CustomClientType.MESSAGE_PROCESSING_LOGS_ADVANCED,
      baseClient
    );
  }
  
  /**
   * Prüft, ob ein bestimmter benutzerdefinierter Client-Typ registriert ist
   * 
   * @param type - Der zu prüfende Typ
   * @returns true, wenn der Typ registriert ist, sonst false
   */
  public isRegistered(type: string): boolean {
    return this.factories.has(type);
  }
  
  /**
   * Gibt alle registrierten benutzerdefinierten Client-Typen zurück
   * 
   * @returns Ein Array der registrierten Typen
   */
  public getRegisteredTypes(): string[] {
    return Array.from(this.factories.keys());
  }
} 