/**
 * Abstrakte Basisklasse für benutzerdefinierte Client-Erweiterungen
 * 
 * Diese Klasse dient als Grundlage für alle erweiterten Client-Implementierungen,
 * die zusätzliche Funktionalität zu den Standard-API-Clients hinzufügen.
 * 
 * @module sap-integration-suite-client/custom
 */

/**
 * BaseCustomClient abstrakte Klasse
 * 
 * T: Der Typ des zugrundeliegenden Standard-Clients, der erweitert wird
 */
export abstract class BaseCustomClient<T> {
  /**
   * Der zugrundeliegende Standard-Client
   */
  protected client: T;

  /**
   * Erstellt eine neue Instanz eines benutzerdefinierten Clients
   * 
   * @param client - Der zugrundeliegende Standard-Client
   */
  constructor(client: T) {
    this.client = client;
  }

  /**
   * Gibt den zugrundeliegenden Standard-Client zurück
   * 
   * @returns Der Basis-Client
   */
  getBaseClient(): T {
    return this.client;
  }
}

/**
 * Factory-Interface für die Erstellung von benutzerdefinierten Clients
 */
export interface CustomClientFactory<T, C extends BaseCustomClient<T>> {
  /**
   * Erstellt eine neue Instanz eines benutzerdefinierten Clients
   * 
   * @param baseClient - Der zugrundeliegende Standard-Client
   * @returns Ein benutzerdefinierter Client, der den Standard-Client erweitert
   */
  create(baseClient: T): C;
} 