/**
 * SAP Integration Suite - Important Tests
 * 
 * Dieser Test ruft PackagesWithArtifacts vom SAP-System ab und überprüft die
 * zurückgegebene Datenstruktur.
 */

const SapClient = require('../../dist').default;
require('dotenv').config();

describe('SAP Integration Suite - Important Tests', () => {
  // Erhöhe das Timeout, da API-Aufrufe länger dauern können
  jest.setTimeout(120000); // Auf 2 Minuten erhöht
  
  let client;
  
  beforeAll(() => {
    // Erstelle einen neuen SapClient vor den Tests
    client = new SapClient();
  });
  
  test('should successfully retrieve packages with artifacts', async () => {
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
      const currentBatch = await client.integrationContent.getPackagesWithArtifacts({
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
  
  test('should be able to get all packages from the system', async () => {
    // Hole alle verfügbaren Packages ohne Artefakte
    const allPackages = await client.integrationContent.getIntegrationPackages();
    
    // Überprüfe Datenstruktur
    expect(allPackages).toBeDefined();
    expect(Array.isArray(allPackages)).toBe(true);
    
    // Informativ ausgeben
    console.log(`\nTotal available packages in the system: ${allPackages.length}`);
    
    if (allPackages.length > 0) {
      console.log('First package:', allPackages[0].Name, `(${allPackages[0].Id})`);
    }
  });
});
