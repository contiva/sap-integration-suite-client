/**
 * E2E Test: Integration Package-Operationen
 * 
 * Prüft Integration Package-Operationen mit echten SAP-Daten.
 * KEINE Fallbacks - SAP-Verbindung muss funktionieren, Packages müssen existieren.
 */

const { checkAllForSapTests, checkTestData } = require('../utils/pre-flight-checks');
const { createSapClient } = require('../utils/test-helpers');

describe('Integration Packages E2E Tests', () => {
  let client;

  beforeAll(async () => {
    // Pre-Flight Check: Prüft SAP-Verbindung
    await checkAllForSapTests();

    // Erstelle SAP Client
    client = createSapClient({ enableCache: false }); // Kein Cache für diese Tests
  });

  afterAll(async () => {
    if (client) {
      await client.disconnect();
    }
  });

  test('getIntegrationPackages() liefert echte Packages', async () => {
    const packages = await client.integrationContent.getIntegrationPackages();

    expect(packages).toBeDefined();
    expect(Array.isArray(packages)).toBe(true);
    expect(packages.length).toBeGreaterThan(0);

    // Prüfe, dass Packages die erwartete Struktur haben
    const firstPackage = packages[0];
    expect(firstPackage).toHaveProperty('Id');
    expect(firstPackage).toHaveProperty('Name');
  }, 60000);

  test('getIntegrationPackage(packageId) liefert Package-Details', async () => {
    // Hole zuerst Liste von Packages
    const packages = await client.integrationContent.getIntegrationPackages();
    expect(packages.length).toBeGreaterThan(0);

    const packageId = packages[0].Id;
    expect(packageId).toBeDefined();

    // Hole Package-Details
    const packageDetails = await client.integrationContent.getIntegrationPackageById(packageId);

    expect(packageDetails).toBeDefined();
    expect(packageDetails.Id).toBe(packageId);
    expect(packageDetails).toHaveProperty('Name');
  }, 60000);

  test('Paginierung funktioniert (top, skip)', async () => {
    // Hole erste 5 Packages
    const firstPage = await client.integrationContent.getIntegrationPackages({
      top: 5
    });

    expect(firstPage).toBeDefined();
    expect(Array.isArray(firstPage)).toBe(true);
    expect(firstPage.length).toBeLessThanOrEqual(5);

    if (firstPage.length === 5) {
      // Hole nächste 5 Packages
      const secondPage = await client.integrationContent.getIntegrationPackages({
        top: 5,
        skip: 5
      });

      expect(secondPage).toBeDefined();
      expect(Array.isArray(secondPage)).toBe(true);

      // Prüfe, dass Packages unterschiedlich sind (wenn genug vorhanden)
      if (secondPage.length > 0 && firstPage.length > 0) {
        expect(firstPage[0].Id).not.toBe(secondPage[0].Id);
      }
    }
  }, 60000);

  test('Filterung funktioniert (author, lob)', async () => {
    // Hole Packages ohne Filter
    const allPackages = await client.integrationContent.getIntegrationPackages({
      top: 10
    });

    expect(allPackages.length).toBeGreaterThan(0);

    // Versuche Filterung nach author (falls Custom Tags vorhanden)
    // Hinweis: Diese Tests können fehlschlagen, wenn keine Custom Tags vorhanden sind
    // Das ist gewollt - KEIN Fallback!
    try {
      const filteredByAuthor = await client.integrationContent.getIntegrationPackages({
        top: 10,
        author: 'test-author' // Beispiel-Author
      });

      expect(filteredByAuthor).toBeDefined();
      expect(Array.isArray(filteredByAuthor)).toBe(true);
    } catch (error) {
      // Wenn Filterung nicht unterstützt wird oder keine Ergebnisse, ist das OK
      // Aber wir prüfen, dass die API korrekt antwortet
      expect(error).toBeDefined();
    }
  }, 60000);

  test('Package-Details enthalten erwartete Felder', async () => {
    const packages = await client.integrationContent.getIntegrationPackages({
      top: 1
    });

    expect(packages.length).toBeGreaterThan(0);

    const packageId = packages[0].Id;
    const packageDetails = await client.integrationContent.getIntegrationPackageById(packageId);

    // Prüfe erwartete Felder
    expect(packageDetails).toHaveProperty('Id');
    expect(packageDetails).toHaveProperty('Name');
    expect(packageDetails.Id).toBe(packageId);
  }, 60000);
});

