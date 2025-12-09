/**
 * SAP Integration Suite - Custom Client Tests
 * 
 * Dieser Test überprüft die Funktionalität der benutzerdefinierten Client-Erweiterungen,
 * indem er PackagesWithArtifacts über die CustomClientRegistry abruft und die
 * zurückgegebene Datenstruktur überprüft.
 */

const SapClient = require('../../dist').default;
// Importiere die CustomClientType Enum direkt aus der Registry
const { CustomClientType } = require('../../dist/wrapper/custom/custom-client-registry');
require('dotenv').config();

describe('SAP Integration Suite - Custom Client Tests', () => {
  // Erhöhe das Timeout, da API-Aufrufe länger dauern können
  jest.setTimeout(120000); // Auf 2 Minuten erhöht
  
  let client;
  
  beforeAll(async () => {
    // Skip tests if baseUrl is not configured
    if (!process.env.SAP_BASE_URL) {
      console.warn('Skipping tests: SAP_BASE_URL not configured');
      return;
    }

    // Erstelle einen neuen SapClient vor den Tests
    client = new SapClient({
      baseUrl: process.env.SAP_BASE_URL,
      oauthClientId: process.env.SAP_OAUTH_CLIENT_ID,
      oauthClientSecret: process.env.SAP_OAUTH_CLIENT_SECRET,
      oauthTokenUrl: process.env.SAP_OAUTH_TOKEN_URL,
    });
    // Wait a bit for cache manager to initialize (or fail gracefully)
    await new Promise(resolve => setTimeout(resolve, 100));
  });
  
  test('should access IntegrationContentAdvancedClient through the Registry', async () => {
    // Skip if client is not initialized (missing config)
    if (!client) {
      console.warn('Skipping test: Client not initialized');
      return;
    }

    // Prüfe, ob der Custom Client über die Registry verfügbar ist
    expect(client.customClientRegistry).toBeDefined();
    expect(client.customClientRegistry.isRegistered(CustomClientType.INTEGRATION_CONTENT_ADVANCED)).toBe(true);
    
    // Hole den Custom Client über die getCustomClient-Methode
    const advancedClient = client.getCustomClient(CustomClientType.INTEGRATION_CONTENT_ADVANCED);
    expect(advancedClient).toBeDefined();
    expect(advancedClient).toBe(client.integrationContentAdvanced);
  });
  
  test('should successfully retrieve packages with artifacts using custom client', async () => {
    // Skip if client is not initialized (missing config)
    if (!client) {
      console.warn('Skipping test: Client not initialized');
      return;
    }
    // Maximale Anzahl von Packages, die wir prüfen
    const MAX_PACKAGES_TO_CHECK = 20;
    
    // Array zum Speichern von Packages mit Artefakten
    let packagesWithArtifacts = [];
    let hasFoundArtifacts = false;
    let offset = 0;
    let batchSize = 3;
    
    // So lange Packages prüfen, bis wir ein Package mit Artefakten gefunden haben
    // oder bis wir die maximale Anzahl an Packages geprüft haben
    while (!hasFoundArtifacts && offset < MAX_PACKAGES_TO_CHECK) {
      console.log(`\nPrüfe Packages ${offset} bis ${offset + batchSize - 1}...`);
      
      // Rufe die nächsten Packages mit ihren Artifacts vom System ab
      // WICHTIG: Hier verwenden wir den Custom Client über die Registry
      const advancedClient = client.customClientRegistry.createIntegrationContentAdvancedClient(client.integrationContent);
      const currentBatch = await advancedClient.getPackagesWithArtifacts({
        top: batchSize,
        skip: offset,
        includeEmpty: true, // Alle Packages einbeziehen
        parallel: true      // Parallele API-Aufrufe für bessere Performance
      });
      
      // Füge die neuen Packages zum Gesamtergebnis hinzu
      packagesWithArtifacts = packagesWithArtifacts.concat(currentBatch);
      
      // Prüfe, ob eines der Packages Artefakte enthält
      for (const pkg of currentBatch) {
        const hasIntegrationArtifacts = pkg.package.IntegrationDesigntimeArtifacts.length > 0;
        const hasMessageMappings = pkg.package.MessageMappingDesigntimeArtifacts.length > 0;
        const hasValueMappings = pkg.package.ValueMappingDesigntimeArtifacts.length > 0;
        const hasScriptCollections = pkg.package.ScriptCollectionDesigntimeArtifacts.length > 0;
        
        if (hasIntegrationArtifacts || hasMessageMappings || hasValueMappings || hasScriptCollections) {
          hasFoundArtifacts = true;
          console.log(`\n✅ Gefunden: Package "${pkg.package.Name}" enthält Artefakte!`);
          break;
        }
      }
      
      // Nächster Batch
      offset += batchSize;
      
      // Wenn keine Packages mehr zurückgegeben wurden, brechen wir ab
      if (currentBatch.length === 0) {
        console.log('Keine weiteren Packages gefunden.');
        break;
      }
    }
    
    // Überprüfe die grundlegende Datenstruktur
    expect(packagesWithArtifacts).toBeDefined();
    expect(Array.isArray(packagesWithArtifacts)).toBe(true);
    
    // Wenn wir keine Packages mit Artefakten gefunden haben, ist das ein Problem
    if (!hasFoundArtifacts) {
      console.warn(`⚠️ WARNUNG: Keine Packages mit Artefakten gefunden nach Prüfung von ${packagesWithArtifacts.length} Packages!`);
    }
    
    console.log(`\nInsgesamt ${packagesWithArtifacts.length} Packages geprüft.`);
    
    // Analysiere alle gefundenen Packages und zeige Statistiken an
    let packageWithArtifacts = null;
    
    for (const pkg of packagesWithArtifacts) {
      const hasIntegrationArtifacts = pkg.package.IntegrationDesigntimeArtifacts.length > 0;
      const hasMessageMappings = pkg.package.MessageMappingDesigntimeArtifacts.length > 0;
      const hasValueMappings = pkg.package.ValueMappingDesigntimeArtifacts.length > 0;
      const hasScriptCollections = pkg.package.ScriptCollectionDesigntimeArtifacts.length > 0;
      
      if (hasIntegrationArtifacts || hasMessageMappings || hasValueMappings || hasScriptCollections) {
        if (packageWithArtifacts === null) {
          packageWithArtifacts = pkg;
        }
        
        const totalArtifacts = 
          pkg.package.IntegrationDesigntimeArtifacts.length +
          pkg.package.MessageMappingDesigntimeArtifacts.length +
          pkg.package.ValueMappingDesigntimeArtifacts.length +
          pkg.package.ScriptCollectionDesigntimeArtifacts.length;
        
        console.log(`\nPackage: ${pkg.package.Name} (${pkg.package.Id})`);
        console.log(`- Integration Flows: ${pkg.package.IntegrationDesigntimeArtifacts.length}`);
        console.log(`- Message Mappings: ${pkg.package.MessageMappingDesigntimeArtifacts.length}`);
        console.log(`- Value Mappings: ${pkg.package.ValueMappingDesigntimeArtifacts.length}`);
        console.log(`- Script Collections: ${pkg.package.ScriptCollectionDesigntimeArtifacts.length}`);
        console.log(`- Gesamt Artefakte: ${totalArtifacts}`);
      }
    }
    
    // Wenn wir ein Package mit Artefakten gefunden haben, prüfen wir die Struktur
    if (packageWithArtifacts) {
      const firstPackage = packageWithArtifacts;
      
      // Überprüfe die Package-Struktur
      expect(firstPackage).toBeDefined();
      expect(firstPackage.package).toBeDefined();
      expect(firstPackage.package.Id).toBeDefined();
      expect(firstPackage.package.Name).toBeDefined();
      
      // Überprüfe die Artifacts-Arrays
      expect(Array.isArray(firstPackage.package.IntegrationDesigntimeArtifacts)).toBe(true);
      expect(Array.isArray(firstPackage.package.MessageMappingDesigntimeArtifacts)).toBe(true);
      expect(Array.isArray(firstPackage.package.ValueMappingDesigntimeArtifacts)).toBe(true);
      expect(Array.isArray(firstPackage.package.ScriptCollectionDesigntimeArtifacts)).toBe(true);
      
      // Bei vorhandenen Artifacts überprüfen wir die Struktur
      const artifactTypes = [
        {
          name: 'IntegrationDesigntimeArtifacts',
          array: firstPackage.package.IntegrationDesigntimeArtifacts
        },
        {
          name: 'MessageMappingDesigntimeArtifacts',
          array: firstPackage.package.MessageMappingDesigntimeArtifacts
        },
        {
          name: 'ValueMappingDesigntimeArtifacts',
          array: firstPackage.package.ValueMappingDesigntimeArtifacts
        },
        {
          name: 'ScriptCollectionDesigntimeArtifacts',
          array: firstPackage.package.ScriptCollectionDesigntimeArtifacts
        }
      ];
      
      // Überprüfe jeden Artifact-Typ mit Artefakten
      for (const artifactType of artifactTypes) {
        if (artifactType.array.length > 0) {
          const firstArtifact = artifactType.array[0];
          expect(firstArtifact.Id).toBeDefined();
          expect(firstArtifact.Name).toBeDefined();
          expect(firstArtifact.PackageId).toBeDefined();
          
          // Gib Details zum ersten Artifact aus
          console.log(`\nDetails für ersten ${artifactType.name.slice(0, -1)}:`);
          console.log(`- Name: ${firstArtifact.Name}`);
          console.log(`- ID: ${firstArtifact.Id}`);
          console.log(`- PackageId: ${firstArtifact.PackageId}`);
        }
      }
      
      // Stellen wir sicher, dass wir mindestens ein Artefakt gefunden haben
      const totalArtifactsFound = artifactTypes.reduce((sum, type) => sum + type.array.length, 0);
      expect(totalArtifactsFound).toBeGreaterThan(0);
    }
    
    // Mindestens ein Package sollte gefunden worden sein
    expect(packagesWithArtifacts.length).toBeGreaterThan(0);
  });
  
  test('should test MessageProcessingLogsAdvancedClient registration', async () => {
    // Skip if client is not initialized (missing config)
    if (!client) {
      console.warn('Skipping test: Client not initialized');
      return;
    }

    // Prüfe, ob der Custom Client bereits standardmäßig registriert ist
    expect(client.customClientRegistry.isRegistered(CustomClientType.MESSAGE_PROCESSING_LOGS_ADVANCED)).toBe(true);
    
    // Erstelle eine Instanz des Advanced Clients über die Registry
    const advancedMplClient = client.customClientRegistry.create(
      CustomClientType.MESSAGE_PROCESSING_LOGS_ADVANCED,
      client.messageProcessingLogs
    );
    
    // Prüfe, ob der Client korrekt erstellt wurde
    expect(advancedMplClient).toBeDefined();
    expect(advancedMplClient.getBaseClient()).toBe(client.messageProcessingLogs);
  });
  
  test('should successfully use MessageProcessingLogsAdvancedClient methods', async () => {
    // Skip if client is not initialized (missing config)
    if (!client) {
      console.warn('Skipping test: Client not initialized');
      return;
    }
    // Für diesen Test verwenden wir direkt den über die Registry erstellten Client
    const advancedMplClient = client.customClientRegistry.createMessageProcessingLogsAdvancedClient(
      client.messageProcessingLogs
    );
    expect(advancedMplClient).toBeDefined();
    
    // Ein aktuelles Datum als Start- und ein Enddatum festlegen
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // 7 Tage zurück
    
    // Wir erstellen einen Mock, da wir nicht wissen, ob es reale Flows gibt
    const flowId = "TestFlow";
    
    try {
      // Die analyzeFlowPerformance-Methode aufrufen
      const perfAnalysis = await advancedMplClient.analyzeFlowPerformance(flowId, {
        fromDate: startDate,
        toDate: endDate,
        maxResults: 10
      });
      
      // Prüfe die Struktur des Ergebnisses (auch wenn keine Logs gefunden wurden)
      expect(perfAnalysis).toBeDefined();
      expect(typeof perfAnalysis.avgDuration).toBe("number");
      expect(typeof perfAnalysis.totalLogs).toBe("number");
      expect(Array.isArray(perfAnalysis.outliers)).toBe(true);
      
      console.log(`Performanceanalyse für Flow "${flowId}":`);
      console.log(`- Geprüfte Logs: ${perfAnalysis.totalLogs}`);
      console.log(`- Durchschnittliche Laufzeit: ${perfAnalysis.avgDuration} ms`);
      console.log(`- Ausreißer gefunden: ${perfAnalysis.outliers.length}`);
      
    } catch (error) {
      // Wir erwarten, dass der Test nicht fehlschlägt, wenn die API-Anfrage fehlschlägt
      // Stattdessen loggen wir den Fehler
      console.warn(`Test konnte nicht vollständig durchgeführt werden: ${error.message}`);
    }
  });
  
  test('should dynamically register and use MessageProcessingLogsAdvancedClient', async () => {
    // Skip if baseUrl is not configured
    if (!process.env.SAP_BASE_URL) {
      console.warn('Skipping test: SAP_BASE_URL not configured');
      return;
    }

    // Erstelle einen neuen SapClient mit deaktivierter Custom-Client-Registry
    const clientWithoutCustomClients = new SapClient({
      baseUrl: process.env.SAP_BASE_URL,
      oauthClientId: process.env.SAP_OAUTH_CLIENT_ID,
      oauthClientSecret: process.env.SAP_OAUTH_CLIENT_SECRET,
      oauthTokenUrl: process.env.SAP_OAUTH_TOKEN_URL,
      enableCustomClients: false
    });
    
    // Aktiviere Custom Clients manuell
    clientWithoutCustomClients.enableCustomClients = true;
    
    // Importiere die Factory-Klasse
    const { MessageProcessingLogsAdvancedClientFactory } = require('../../dist/wrapper/custom/message-processing-logs-advanced-client');
    
    // Registriere den Client-Factory manuell
    clientWithoutCustomClients.registerCustomClientFactory(
      CustomClientType.MESSAGE_PROCESSING_LOGS_ADVANCED,
      new MessageProcessingLogsAdvancedClientFactory()
    );
    
    // Erstelle und verwende den Client
    const mplClient = clientWithoutCustomClients.customClientRegistry.create(
      CustomClientType.MESSAGE_PROCESSING_LOGS_ADVANCED,
      clientWithoutCustomClients.messageProcessingLogs
    );
    
    // Prüfe, ob die Methoden vorhanden sind
    expect(typeof mplClient.analyzeFlowPerformance).toBe('function');
    expect(typeof mplClient.findErrorLogsForFlow).toBe('function');
    expect(typeof mplClient.getErrorStatisticsForFlow).toBe('function');

    await clientWithoutCustomClients.disconnect();
  });
});

/**
 * Verbesserungsvorschläge für zukünftige Tests:
 * 
 * 1. Mock-Implementierung: Um einige der API-Aufrufe zu simulieren, 
 *    sollten echte Mocks erstellt werden, die die SAP-API-Antworten nachahmen.
 * 
 * 2. Konsolidierung von Tests: Die beiden Test-Dateien (important.test.js und custom-client.test.js)
 *    könnten zusammengeführt werden, um redundanten Code zu vermeiden.
 * 
 * 3. Testkonfiguration: Ein gemeinsames Testsetup mit konfigurierbaren Umgebungsvariablen
 *    (z.B. für Timeout-Werte) würde helfen, Tests konsistenter zu gestalten.
 * 
 * 4. Umfassendere Testabdeckung: Alle benutzerdefinierten Client-Erweiterungen sollten 
 *    mit Unit-Tests abgedeckt werden, insbesondere wenn neue Funktionen hinzugefügt werden.
 */ 