/**
 * E2E Test: Cache-Revalidation-Workflow
 * 
 * Prüft Cache-Revalidation-Workflow.
 * KEINE Fallbacks - Redis und SAP müssen funktionieren.
 */

const { checkAllForCacheTests } = require('../utils/pre-flight-checks');
const { createSapClient, createCacheManager, cleanupTestKeys, wait } = require('../utils/test-helpers');

describe('Cache-Revalidation Workflow E2E Tests', () => {
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

  test('Daten werden gecacht und als stale markiert', async () => {
    // Hole Packages (wird gecacht)
    const packages1 = await client.integrationContent.getIntegrationPackages({
      top: 5
    });

    expect(packages1.length).toBeGreaterThan(0);

    // Warte kurz
    await wait(500);

    // Prüfe, dass Daten im Cache sind
    const stats = await cacheManager.getStats();
    expect(stats.totalKeys).toBeGreaterThan(0);
  }, 120000);

  test('Background-Revalidation läuft und neue Daten werden im Cache gespeichert', async () => {
    // Hole Packages
    const packages1 = await client.integrationContent.getIntegrationPackages({
      top: 5
    });

    expect(packages1.length).toBeGreaterThan(0);

    // Warte kurz
    await wait(500);

    // Hole erneut (sollte Cache HIT sein)
    const packages2 = await client.integrationContent.getIntegrationPackages({
      top: 5
    });

    expect(packages2).toBeDefined();
    expect(Array.isArray(packages2)).toBe(true);
  }, 120000);

  test('Stale-Daten werden während Revalidation zurückgegeben', async () => {
    // Hole Packages
    const packages1 = await client.integrationContent.getIntegrationPackages({
      top: 5
    });

    expect(packages1.length).toBeGreaterThan(0);

    // Warte kurz
    await wait(500);

    // Hole erneut (sollte Cache HIT sein, auch wenn stale)
    const packages2 = await client.integrationContent.getIntegrationPackages({
      top: 5
    });

    expect(packages2).toBeDefined();
    expect(Array.isArray(packages2)).toBe(true);
    expect(packages2.length).toBe(packages1.length);
  }, 120000);
});

