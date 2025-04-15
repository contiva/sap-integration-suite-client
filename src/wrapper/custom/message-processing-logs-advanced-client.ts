/**
 * SAP Message Processing Logs Advanced Client
 * 
 * Diese Datei enthält erweiterte Methoden für die Message Processing Logs APIs von SAP Cloud Integration.
 * Diese Methoden sind Erweiterungen der grundlegenden API-Funktionen und bieten zusammengesetzte Operationen.
 * 
 * @module sap-integration-suite-client/message-processing-logs-advanced
 */

import { ComSapHciApiMessageProcessingLog, ComSapHciApiMessageProcessingLogErrorInformation } from '../../types/sap.MessageProcessingLogs';
import { MessageProcessingLogsClient } from '../message-processing-logs-client';
import { BaseCustomClient, CustomClientFactory } from './base-custom-client';
import { EnhancedMessageProcessingLog } from '../../types/enhanced-logs';

/**
 * Erweiterter MessageProcessingLogs-Client
 * 
 * Diese Klasse erweitert den Basis-MessageProcessingLogsClient mit zusätzlichen
 * Funktionen für erweiterte Abfragen und Analysen.
 */
export class MessageProcessingLogsAdvancedClient extends BaseCustomClient<MessageProcessingLogsClient> {
  /**
   * Erstellt einen neuen MessageProcessingLogsAdvancedClient
   * 
   * @param client - Die zugrundeliegende MessageProcessingLogsClient-Instanz
   */
  constructor(client: MessageProcessingLogsClient) {
    super(client);
  }

  /**
   * Findet Fehler-Logs für einen bestimmten Integrationsflow
   * 
   * Diese Methode sucht alle fehlgeschlagenen Logs für einen bestimmten
   * Integrationsflow innerhalb eines angegebenen Zeitfensters.
   * 
   * @param flowId - Die ID des Integrationsflows
   * @param options - Optionale Parameter für die Anfrage
   * @returns Promise mit den gefundenen Fehler-Logs
   * 
   * @example
   * const errorLogs = await client.findErrorLogsForFlow('MyFlowId', {
   *   fromDate: new Date('2023-01-01'),
   *   toDate: new Date(),
   *   maxResults: 100
   * });
   */
  async findErrorLogsForFlow(flowId: string, options: {
    fromDate?: Date;
    toDate?: Date;
    maxResults?: number;
  } = {}): Promise<EnhancedMessageProcessingLog[]> {
    // Standard-Werte für Optionen
    const fromDate = options.fromDate || new Date(Date.now() - 24 * 60 * 60 * 1000); // 24h zurück
    const toDate = options.toDate || new Date();
    const maxResults = options.maxResults || 50;

    // Filterbedingungen erstellen
    const filterConditions = [
      `MessageGuid ne null`,
      `Status eq 'FAILED'`,
      `IntegrationFlowName eq '${flowId}'`,
      `LogStart ge datetime'${fromDate.toISOString()}'`,
      `LogStart le datetime'${toDate.toISOString()}'`
    ];

    // OData-Filter zusammenbauen
    const filter = filterConditions.join(' and ');

    // Logs abrufen
    const result = await this.client.getMessageProcessingLogs({
      filter: filter,
      top: maxResults,
      orderby: ['LogEnd desc']
    });

    return result.logs;
  }

  /**
   * Gibt eine Zusammenfassung der Fehlertypen für einen bestimmten Integrationsflow zurück
   * 
   * @param flowId - Die ID des Integrationsflows
   * @param options - Optionale Parameter für die Anfrage
   * @returns Promise mit der Fehlerstatistik
   * 
   * @example
   * const errorStats = await client.getErrorStatisticsForFlow('MyFlowId');
   * console.log(`Häufigster Fehler: ${errorStats[0].errorType} (${errorStats[0].count} Mal)`);
   */
  async getErrorStatisticsForFlow(flowId: string, options: {
    fromDate?: Date;
    toDate?: Date;
    maxResults?: number;
  } = {}): Promise<{errorType: string; count: number; percentage: number}[]> {
    // Fehler-Logs für den Flow abrufen
    const errorLogs = await this.findErrorLogsForFlow(flowId, options);
    
    // Keine Logs gefunden? Leeres Array zurückgeben
    if (errorLogs.length === 0) {
      return [];
    }

    // Fehlertypen zählen
    const errorCounts: Record<string, number> = {};
    
    for (const log of errorLogs) {
      // Fehlertyp extrahieren (dies könnte je nach API-Struktur angepasst werden)
      const errorType = log.ErrorInformation?.Type || 'Unknown Error';
      
      // Zähler erhöhen oder initialisieren
      errorCounts[errorType] = (errorCounts[errorType] || 0) + 1;
    }

    // Gesamtzahl der Fehler berechnen
    const totalErrors = errorLogs.length;
    
    // Statistik erstellen und nach Häufigkeit sortieren
    const statistics = Object.entries(errorCounts).map(([errorType, count]) => ({
      errorType,
      count,
      percentage: Math.round((count / totalErrors) * 100)
    }));
    
    // Nach Anzahl absteigend sortieren
    return statistics.sort((a, b) => b.count - a.count);
  }
  
  /**
   * Prüft die Durchlaufzeiten eines Integrationsflows und identifiziert Ausreißer
   * 
   * @param flowId - Die ID des Integrationsflows
   * @param options - Optionale Parameter für die Anfrage
   * @returns Promise mit der Performance-Analyse
   * 
   * @example
   * const perfAnalysis = await client.analyzeFlowPerformance('MyFlowId');
   * console.log(`Durchschnittliche Laufzeit: ${perfAnalysis.avgDuration}ms`);
   * console.log(`Ausreißer: ${perfAnalysis.outliers.length}`);
   */
  async analyzeFlowPerformance(flowId: string, options: {
    fromDate?: Date;
    toDate?: Date;
    maxResults?: number;
    outlierThreshold?: number; // In Standardabweichungen
  } = {}): Promise<{
    avgDuration: number;
    minDuration: number;
    maxDuration: number;
    medianDuration: number;
    stdDevDuration: number;
    outliers: EnhancedMessageProcessingLog[];
    totalLogs: number;
  }> {
    // Standard-Werte für Optionen
    const fromDate = options.fromDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 Tage zurück
    const toDate = options.toDate || new Date();
    const maxResults = options.maxResults || 100;
    const outlierThreshold = options.outlierThreshold || 2.0; // 2 Standardabweichungen

    // Filterbedingungen erstellen
    const filterConditions = [
      `MessageGuid ne null`,
      `IntegrationFlowName eq '${flowId}'`,
      `LogStart ge datetime'${fromDate.toISOString()}'`,
      `LogStart le datetime'${toDate.toISOString()}'`
    ];

    // OData-Filter zusammenbauen
    const filter = filterConditions.join(' and ');

    // Logs abrufen
    const result = await this.client.getMessageProcessingLogs({
      filter: filter,
      top: maxResults,
      orderby: ['LogStart desc']
    });

    const logs = result.logs;

    // Keine Logs gefunden? Default-Werte zurückgeben
    if (logs.length === 0) {
      return {
        avgDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        medianDuration: 0,
        stdDevDuration: 0,
        outliers: [],
        totalLogs: 0
      };
    }

    // Laufzeiten extrahieren
    const durations = logs.map(log => {
      // LogStart und LogEnd in Millisekunden umwandeln
      const start = log.LogStart ? log.LogStart.getTime() : 0;
      const end = log.LogEnd ? log.LogEnd.getTime() : 0;
      return end - start;
    });

    // Statistiken berechnen
    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);
    
    // Median berechnen
    const sortedDurations = [...durations].sort((a, b) => a - b);
    const medianDuration = sortedDurations.length % 2 === 0
      ? (sortedDurations[sortedDurations.length / 2 - 1] + sortedDurations[sortedDurations.length / 2]) / 2
      : sortedDurations[Math.floor(sortedDurations.length / 2)];
    
    // Standardabweichung berechnen
    const squaredDiffs = durations.map(d => Math.pow(d - avgDuration, 2));
    const variance = squaredDiffs.reduce((sum, sq) => sum + sq, 0) / durations.length;
    const stdDevDuration = Math.sqrt(variance);
    
    // Ausreißer identifizieren (Werte außerhalb des Threshold * Standardabweichung)
    const threshold = outlierThreshold * stdDevDuration;
    const outlierIndices = durations
      .map((d, i) => Math.abs(d - avgDuration) > threshold ? i : -1)
      .filter(i => i !== -1);
    
    const outliers = outlierIndices.map(i => logs[i]);
    
    return {
      avgDuration,
      minDuration,
      maxDuration,
      medianDuration,
      stdDevDuration,
      outliers,
      totalLogs: logs.length
    };
  }
}

/**
 * Factory für die Erstellung von MessageProcessingLogsAdvancedClient-Instanzen
 */
export class MessageProcessingLogsAdvancedClientFactory 
  implements CustomClientFactory<MessageProcessingLogsClient, MessageProcessingLogsAdvancedClient> {
  
  /**
   * Erstellt eine neue MessageProcessingLogsAdvancedClient-Instanz
   * 
   * @param baseClient - Der zugrundeliegende MessageProcessingLogsClient
   * @returns Ein MessageProcessingLogsAdvancedClient
   */
  create(baseClient: MessageProcessingLogsClient): MessageProcessingLogsAdvancedClient {
    return new MessageProcessingLogsAdvancedClient(baseClient);
  }
} 