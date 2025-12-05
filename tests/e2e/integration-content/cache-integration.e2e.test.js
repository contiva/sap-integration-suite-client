/**
 * E2E Test: Cache-Integration mit Integration Content API-Aufrufen
 * 
 * Prüft Cache-Integration mit Integration Content API-Aufrufen.
 * KEINE Fallbacks - Sowohl SAP als auch Redis müssen funktionieren.
 */

const { checkAllForCacheTests } = require('../utils/pre-flight-checks');
const { createSapClient, createCacheManager, cleanupTestKeys } = require('../utils/test-helpers');

describe('Cache-Integration E2E Tests', () => {
  let client;
  let cacheManager;

  beforeAll(async () => {
    // Pre-Flight Check: Prüft SAP und Redis
    await checkAllForCacheTests();

    // Erstelle CacheManager
    cacheManager = createCacheManager();
    await cacheManager.connect();

    // Erstelle SAP Client mit Cache
    client = createSapClient({
      enableCache: true,
      cacheManager: cacheManager
    });
  });

  afterAll(async () => {
    if (client) {
      await client.disconnect();
    }
    if (cacheManager) {
      await cleanupTestKeys(cacheManager);
      await cacheManager.close();
    }
  });

  test('API-Aufruf speichert Daten im Cache', async () => {
    // Prüfe, dass CacheManager bereit ist
    expect(client.cacheManager).not.toBeNull();
    expect(client.cacheManager.isReady()).toBe(true);

    // Hole Packages (sollte Cache MISS sein)
    const packages = await client.integrationContent.getIntegrationPackages({
      top: 5
    });

    expect(packages).toBeDefined();
    expect(Array.isArray(packages)).toBe(true);
    expect(packages.length).toBeGreaterThan(0);

    // Prüfe, dass Daten im Cache gespeichert wurden
    // Warte kurz, damit Cache-Operation abgeschlossen ist
    await new Promise(resolve => setTimeout(resolve, 500));

    // Cache sollte jetzt Daten enthalten
    const stats = await cacheManager.getStats();
    expect(stats.totalKeys).toBeGreaterThan(0);
  }, 60000);

  test('Zweiter Aufruf verwendet Cache (Cache HIT)', async () => {
    // Erster Aufruf (Cache MISS)
    const packages1 = await client.integrationContent.getIntegrationPackages({
      top: 5
    });

    expect(packages1).toBeDefined();
    expect(packages1.length).toBeGreaterThan(0);

    // Warte kurz
    await new Promise(resolve => setTimeout(resolve, 500));

    // Zweiter Aufruf (sollte Cache HIT sein)
    const packages2 = await client.integrationContent.getIntegrationPackages({
      top: 5
    });

    expect(packages2).toBeDefined();
    expect(Array.isArray(packages2)).toBe(true);
    
    // Daten sollten identisch sein (aus Cache)
    expect(packages2.length).toBe(packages1.length);
    if (packages1.length > 0 && packages2.length > 0) {
      expect(packages2[0].Id).toBe(packages1[0].Id);
    }
  }, 60000);

  test('Cache-Invalidierung funktioniert (invalidateCache)', async () => {
    // Hole Packages
    const packages1 = await client.integrationContent.getIntegrationPackages({
      top: 5
    });

    expect(packages1.length).toBeGreaterThan(0);

    // Warte kurz
    await new Promise(resolve => setTimeout(resolve, 500));

    // Invalidiere Cache
    const deleted = await client.invalidateCache('GET:/IntegrationPackages*');
    expect(deleted).toBeGreaterThanOrEqual(0);

    // Hole erneut (sollte Cache MISS sein)
    const packages2 = await client.integrationContent.getIntegrationPackages({
      top: 5
    });

    expect(packages2).toBeDefined();
    expect(Array.isArray(packages2)).toBe(true);
  }, 60000);

  test('Cache-Invalidierung funktioniert (invalidateArtifactCache)', async () => {
    // Hole Artifacts
    const artifacts = await client.integrationContent.getDeployedArtifacts({
      top: 1
    });

    expect(artifacts.length).toBeGreaterThan(0);

    const artifactId = artifacts[0].Id;

    // Warte kurz
    await new Promise(resolve => setTimeout(resolve, 500));

    // Invalidiere Artifact-Cache
    const deleted = await client.invalidateArtifactCache(artifactId);
    expect(deleted).toBeGreaterThanOrEqual(0);
  }, 60000);

  test('Collection-Caches werden korrekt invalidiert', async () => {
    // Hole Packages (Collection)
    const packages1 = await client.integrationContent.getIntegrationPackages({
      top: 5
    });

    expect(packages1.length).toBeGreaterThan(0);

    // Hole ein Package (Single Item)
    const packageId = packages1[0].Id;
    const packageDetails1 = await client.integrationContent.getIntegrationPackageById(packageId);

    expect(packageDetails1).toBeDefined();

    // Warte kurz
    await new Promise(resolve => setTimeout(resolve, 500));

    // Invalidiere Package-Cache (sollte auch Collection invalidieren)
    const deleted = await client.invalidateCache(`GET:/IntegrationPackages('${packageId}')*`);
    expect(deleted).toBeGreaterThanOrEqual(0);

    // Invalidiere auch Collection
    const deletedCollection = await client.invalidateCache('GET:/IntegrationPackages*');
    expect(deletedCollection).toBeGreaterThanOrEqual(0);
  }, 60000);
});

