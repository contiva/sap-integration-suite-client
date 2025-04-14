require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { SapClient } = require('../dist');

async function testGetPackagesWithArtifacts() {
  console.log('Starting test for getPackagesWithArtifacts...');
  
  // OAuth Konfiguration aus .env-Datei lesen
  const baseUrl = process.env.SAP_BASE_URL;
  const clientId = process.env.SAP_OAUTH_CLIENT_ID;
  const clientSecret = process.env.SAP_OAUTH_CLIENT_SECRET;
  const tokenUrl = process.env.SAP_OAUTH_TOKEN_URL;
  
  if (!baseUrl || !clientId || !clientSecret || !tokenUrl) {
    console.error('OAuth Konfiguration fehlt. Bitte SAP_BASE_URL, SAP_OAUTH_CLIENT_ID, SAP_OAUTH_CLIENT_SECRET und SAP_OAUTH_TOKEN_URL in der .env-Datei definieren.');
    process.exit(1);
  }

  try {
    // SAP Integration Client initialisieren mit OAuth
    const client = new SapClient({
      host: baseUrl,
      auth: {
        oauth: {
          clientId,
          clientSecret,
          tokenUrl
        }
      }
    });

    console.log('Client initialisiert. Starte Abruf der Pakete mit Artefakten...');
    
    // Startzeit messen
    const startTime = Date.now();
    
    // Alle Pakete mit Artefakten abrufen (mit parallel=true für schnellere Abfrage)
    const packagesWithArtifacts = await client.integrationContent.getPackagesWithArtifacts({
      parallel: true
    });
    
    // Endzeit messen und Dauer berechnen
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000; // Dauer in Sekunden
    
    // Statistiken berechnen
    const totalPackages = packagesWithArtifacts.length;
    let totalIntegrationFlows = 0;
    let totalMessageMappings = 0;
    let totalValueMappings = 0;
    let totalScriptCollections = 0;
    
    packagesWithArtifacts.forEach(pkg => {
      totalIntegrationFlows += pkg.package.IntegrationDesigntimeArtifacts.length;
      totalMessageMappings += pkg.package.MessageMappingDesigntimeArtifacts.length;
      totalValueMappings += pkg.package.ValueMappingDesigntimeArtifacts.length;
      totalScriptCollections += pkg.package.ScriptCollectionDesigntimeArtifacts.length;
    });
    
    const totalArtifacts = totalIntegrationFlows + totalMessageMappings + totalValueMappings + totalScriptCollections;
    
    // Ergebnisse in Datei schreiben
    fs.writeFileSync(
      path.join(__dirname, 'test.json'),
      JSON.stringify(packagesWithArtifacts, null, 2)
    );
    
    // Statistiken ausgeben
    console.log(`\n===== STATISTIK =====`);
    console.log(`Ausführungszeit: ${duration.toFixed(2)} Sekunden`);
    console.log(`Anzahl Pakete: ${totalPackages}`);
    console.log(`Anzahl Artefakte insgesamt: ${totalArtifacts}`);
    console.log(`  - Integration Flows: ${totalIntegrationFlows}`);
    console.log(`  - Message Mappings: ${totalMessageMappings}`);
    console.log(`  - Value Mappings: ${totalValueMappings}`);
    console.log(`  - Script Collections: ${totalScriptCollections}`);
    console.log(`\nDetaillierte Ergebnisse wurden in tests/test.json gespeichert.`);
    
  } catch (error) {
    console.error('Fehler beim Ausführen des Tests:', error);
  }
}

// Test ausführen
testGetPackagesWithArtifacts();
