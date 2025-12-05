/**
 * E2E Test: Erweiterte Cache-Statistiken
 * 
 * Prüft die erweiterten Cache-Statistik-Funktionen: getStatsByPattern, getCacheHealth, getStatsByEndpoint
 * KEINE Fallbacks - Sowohl SAP als auch Redis müssen funktionieren.
 */

const { checkAllForCacheTests } = require('../utils/pre-flight-checks');
const { createSapClient, createCacheManager, cleanupTestKeys, generateTestKey } = require('../utils/test-helpers');

describe('Extended Cache Statistics E2E Tests', () => {
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

  test('E2E: Statistiken nach Pattern', async () => {
    // Setup: Cache mit verschiedenen Keys füllen
    const hostname = client.integrationContent.hostname;
    
    // Hole einige Daten, um Cache zu füllen
    await client.integrationContent.getDeployedArtifacts();
    await client.integrationContent.getIntegrationPackages({ top: 5 });

    // Warte kurz, damit Cache-Operation abgeschlossen ist
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Action: Statistiken für Pattern abrufen
    const pattern = `sap:${hostname}:GET:/IntegrationRuntimeArtifacts*`;
    const stats = await cacheManager.getStatsByPattern(pattern);

    // Assert: Statistiken sind korrekt
    expect(stats).toBeDefined();
    expect(stats.totalKeys).toBeGreaterThanOrEqual(0);
    expect(stats.totalSize).toBeGreaterThanOrEqual(0);
    expect(typeof stats.totalKeys).toBe('number');
    expect(typeof stats.totalSize).toBe('number');
  }, 120000);

  test('E2E: Cache-Health-Check', async () => {
    // Setup: Cache verbinden (bereits in beforeAll gemacht)
    
    // Action: Health-Check durchführen
    const health = await cacheManager.getCacheHealth();

    // Assert: Cache ist gesund
    expect(health).toBeDefined();
    expect(health).toHaveProperty('isHealthy');
    expect(health).toHaveProperty('connectionStatus');
    expect(health).toHaveProperty('totalKeys');
    expect(health).toHaveProperty('uptime');
    expect(['connected', 'disconnected', 'error']).toContain(health.connectionStatus);
    expect(typeof health.isHealthy).toBe('boolean');
    expect(typeof health.totalKeys).toBe('number');
    expect(typeof health.uptime).toBe('number');
    
    // Wenn verbunden, sollte Cache gesund sein
    if (health.connectionStatus === 'connected') {
      expect(health.isHealthy).toBe(true);
      expect(health.uptime).toBeGreaterThanOrEqual(0);
    }
  }, 120000);

  test('E2E: Statistiken nach Endpoint', async () => {
    // Setup: Cache mit verschiedenen Endpoints füllen
    await client.integrationContent.getDeployedArtifacts();
    await client.integrationContent.getIntegrationPackages({ top: 5 });

    // Warte kurz, damit Cache-Operation abgeschlossen ist
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Action: Statistiken pro Endpoint abrufen
    const artifactsStats = await cacheManager.getStatsByEndpoint('/IntegrationRuntimeArtifacts');
    const packagesStats = await cacheManager.getStatsByEndpoint('/IntegrationPackages');

    // Assert: Gruppierung ist korrekt
    expect(artifactsStats).toBeDefined();
    expect(artifactsStats.endpoint).toBe('/IntegrationRuntimeArtifacts');
    expect(typeof artifactsStats.keys).toBe('number');
    expect(typeof artifactsStats.totalSize).toBe('number');
    expect(artifactsStats.keys).toBeGreaterThanOrEqual(0);
    expect(artifactsStats.totalSize).toBeGreaterThanOrEqual(0);

    expect(packagesStats).toBeDefined();
    expect(packagesStats.endpoint).toBe('/IntegrationPackages');
    expect(typeof packagesStats.keys).toBe('number');
    expect(typeof packagesStats.totalSize).toBe('number');
    expect(packagesStats.keys).toBeGreaterThanOrEqual(0);
    expect(packagesStats.totalSize).toBeGreaterThanOrEqual(0);
  }, 120000);

  test('E2E: Statistiken nach Pattern ohne Treffer', async () => {
    // Action: Statistiken für nicht existierendes Pattern abrufen
    const pattern = 'sap:non-existent-host:GET:/NonExistentEndpoint*';
    const stats = await cacheManager.getStatsByPattern(pattern);

    // Assert: Leere Statistiken zurückgegeben
    expect(stats).toBeDefined();
    expect(stats.totalKeys).toBe(0);
    expect(stats.totalSize).toBe(0);
  }, 120000);

  test('E2E: Statistiken nach Endpoint ohne Treffer', async () => {
    // Action: Statistiken für nicht existierenden Endpoint abrufen
    const stats = await cacheManager.getStatsByEndpoint('/NonExistentEndpoint');

    // Assert: Leere Statistiken zurückgegeben
    expect(stats).toBeDefined();
    expect(stats.endpoint).toBe('/NonExistentEndpoint');
    expect(stats.keys).toBe(0);
    expect(stats.totalSize).toBe(0);
  }, 120000);
});



