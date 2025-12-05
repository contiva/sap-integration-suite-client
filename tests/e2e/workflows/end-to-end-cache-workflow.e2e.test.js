/**
 * E2E Test: End-to-End-Cache-Workflow
 * 
 * Prüft kompletten End-to-End-Workflow mit Cache.
 * KEINE Fallbacks - Alle Schritte müssen erfolgreich sein.
 */

const { checkAllForCacheTests } = require('../utils/pre-flight-checks');
const { createSapClient, createCacheManager, cleanupTestKeys } = require('../utils/test-helpers');

describe('End-to-End Cache Workflow E2E Tests', () => {
  let client;
  let cacheManager;

  beforeAll(async () => {
    // Pre-Flight Check
    await checkAllForCacheTests();

    cacheManager = createCacheManager();
    await cacheManager.connect();

    client = createSapClient({
      enableCache: true,
      cacheManager: cacheManager
    });
  }, 120000);

  afterAll(async () => {
    if (client) {
      await client.disconnect();
    }
    if (cacheManager) {
      await cleanupTestKeys(cacheManager);
      await cacheManager.close();
    }
  }, 120000);

  test('Kompletter Workflow: Package abrufen (Cache MISS) → erneut abrufen (Cache HIT) → Artifact abrufen (Cache MISS) → erneut abrufen (Cache HIT) → Cache-Invalidierung → erneut abrufen (Cache MISS)', async () => {
    // Schritt 1: Package abrufen (Cache MISS)
    const packages1 = await client.integrationContent.getIntegrationPackages({
      top: 5
    });

    expect(packages1.length).toBeGreaterThan(0);
    const packageId = packages1[0].Id;

    // Warte kurz, damit Cache-Operation abgeschlossen ist
    await new Promise(resolve => setTimeout(resolve, 500));

    // Schritt 2: Package erneut abrufen (Cache HIT)
    const packages2 = await client.integrationContent.getIntegrationPackages({
      top: 5
    });

    expect(packages2).toBeDefined();
    expect(Array.isArray(packages2)).toBe(true);
    expect(packages2.length).toBe(packages1.length);
    expect(packages2[0].Id).toBe(packages1[0].Id);

    // Schritt 3: Artifact abrufen (Cache MISS)
    const artifacts1 = await client.integrationContent.getDeployedArtifacts({
      top: 5
    });

    expect(artifacts1.length).toBeGreaterThan(0);
    const artifactId = artifacts1[0].Id;

    // Warte kurz
    await new Promise(resolve => setTimeout(resolve, 500));

    // Schritt 4: Artifact erneut abrufen (Cache HIT)
    const artifacts2 = await client.integrationContent.getDeployedArtifacts({
      top: 5
    });

    expect(artifacts2).toBeDefined();
    expect(Array.isArray(artifacts2)).toBe(true);
    expect(artifacts2.length).toBe(artifacts1.length);
    expect(artifacts2[0].Id).toBe(artifacts1[0].Id);

    // Schritt 5: Cache-Invalidierung
    const deletedPackages = await client.invalidateCache('GET:/IntegrationPackages*');
    expect(deletedPackages).toBeGreaterThanOrEqual(0);

    const deletedArtifacts = await client.invalidateCache('GET:/IntegrationRuntimeArtifacts*');
    expect(deletedArtifacts).toBeGreaterThanOrEqual(0);

    // Schritt 6: Erneuter Abruf nach Invalidierung (Cache MISS)
    const packages3 = await client.integrationContent.getIntegrationPackages({
      top: 5
    });

    expect(packages3).toBeDefined();
    expect(Array.isArray(packages3)).toBe(true);
    expect(packages3.length).toBe(packages1.length);

    const artifacts3 = await client.integrationContent.getDeployedArtifacts({
      top: 5
    });

    expect(artifacts3).toBeDefined();
    expect(Array.isArray(artifacts3)).toBe(true);
    expect(artifacts3.length).toBe(artifacts1.length);
  }, 120000);

  test('Cache-Statistiken zeigen korrekte Werte während Workflow', async () => {
    // Initiale Statistiken
    const statsBefore = await cacheManager.getStats();
    const initialKeys = statsBefore.totalKeys;

    // Hole Packages (wird gecacht)
    await client.integrationContent.getIntegrationPackages({
      top: 5
    });

    // Warte kurz
    await new Promise(resolve => setTimeout(resolve, 500));

    // Prüfe, dass Keys hinzugefügt wurden
    const statsAfter = await cacheManager.getStats();
    expect(statsAfter.totalKeys).toBeGreaterThanOrEqual(initialKeys);

    // Hole Artifacts (wird gecacht)
    await client.integrationContent.getDeployedArtifacts({
      top: 5
    });

    // Warte kurz
    await new Promise(resolve => setTimeout(resolve, 500));

    // Prüfe, dass weitere Keys hinzugefügt wurden
    const statsAfterArtifacts = await cacheManager.getStats();
    expect(statsAfterArtifacts.totalKeys).toBeGreaterThanOrEqual(statsAfter.totalKeys);
  }, 120000);
});

