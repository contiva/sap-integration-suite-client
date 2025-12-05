/**
 * E2E Test: Cache-Warming
 * 
 * Prüft Cache-Warming-Funktionen mit echten Daten.
 * KEINE Fallbacks - Alle Operationen müssen erfolgreich sein.
 */

const { checkAllForCacheTests } = require('../utils/pre-flight-checks');
const { createCacheManager, generateTestKey, cleanupTestKeys } = require('../utils/test-helpers');

describe('Cache-Warming E2E Tests', () => {
  let cacheManager;

  beforeAll(async () => {
    // Pre-Flight Check: Prüft alle Voraussetzungen
    await checkAllForCacheTests();

    // Erstelle CacheManager
    cacheManager = createCacheManager();
    await cacheManager.connect();
  });

  afterAll(async () => {
    // Cleanup
    if (cacheManager) {
      await cleanupTestKeys(cacheManager);
      await cacheManager.close();
    }
  });

  test('E2E: Cache-Warming beim Startup', async () => {
    const testKeys = [
      generateTestKey('warming-1'),
      generateTestKey('warming-2'),
      generateTestKey('warming-3'),
    ];

    // Definiere Endpoints zum Warmen
    const endpoints = testKeys.map((key, index) => ({
      key,
      fetchFn: async () => {
        // Simuliere API-Call
        return {
          data: `test-data-${index}`,
          timestamp: Date.now(),
        };
      },
      options: {
        ttl: 300, // 5 Minuten
        revalidateAfter: 150,
      },
    }));

    // Führe Cache-Warming durch
    const startTime = Date.now();
    const result = await cacheManager.warmCache(endpoints);
    const duration = Date.now() - startTime;

    // Prüfe Ergebnisse
    expect(result.success).toBe(3);
    expect(result.failed).toBe(0);
    expect(duration).toBeLessThan(10000); // Sollte unter 10 Sekunden sein

    // Prüfe, dass alle Keys im Cache sind
    for (const key of testKeys) {
      const cached = await cacheManager.get(key);
      expect(cached).not.toBeNull();
      expect(cached.data).toBeDefined();
    }

    // Cleanup
    for (const key of testKeys) {
      await cacheManager.delete(key);
    }
  }, 60000);

  test('E2E: Cache-Warming mit Fehlern', async () => {
    const testKeys = [
      generateTestKey('warming-error-1'),
      generateTestKey('warming-error-2'),
    ];

    // Definiere Endpoints - einer wird fehlschlagen
    const endpoints = [
      {
        key: testKeys[0],
        fetchFn: async () => {
          // Erfolgreicher Call
          return { data: 'success' };
        },
        options: {
          ttl: 300,
          revalidateAfter: 150,
        },
      },
      {
        key: testKeys[1],
        fetchFn: async () => {
          // Fehlgeschlagener Call
          throw new Error('Simulated API error');
        },
        options: {
          ttl: 300,
          revalidateAfter: 150,
        },
      },
    ];

    // Führe Cache-Warming durch
    const result = await cacheManager.warmCache(endpoints);

    // Prüfe Ergebnisse
    expect(result.success).toBe(1);
    expect(result.failed).toBe(1);
    expect(result.errors).toBeDefined();
    expect(result.errors.length).toBe(1);
    expect(result.errors[0].key).toBe(testKeys[1]);
    expect(result.errors[0].error).toContain('Simulated API error');

    // Prüfe, dass erfolgreicher Key im Cache ist
    const cached = await cacheManager.get(testKeys[0]);
    expect(cached).not.toBeNull();

    // Prüfe, dass fehlgeschlagener Key nicht im Cache ist
    const failedCached = await cacheManager.get(testKeys[1]);
    expect(failedCached).toBeNull();

    // Cleanup
    for (const key of testKeys) {
      await cacheManager.delete(key);
    }
  }, 60000);

  test('E2E: Cache-Warming mit Timeout', async () => {
    const testKey = generateTestKey('warming-timeout');

    // Definiere Endpoint mit langsamem Call
    const endpoints = [
      {
        key: testKey,
        fetchFn: async () => {
          // Simuliere langsame API (länger als Timeout)
          await new Promise(resolve => setTimeout(resolve, 5000));
          return { data: 'slow-data' };
        },
        options: {
          ttl: 300,
          revalidateAfter: 150,
        },
      },
    ];

    // Führe Cache-Warming mit kurzem Timeout durch
    const startTime = Date.now();
    const result = await cacheManager.warmCache(endpoints, {
      timeout: 1000, // 1 Sekunde Timeout
      parallel: true,
    });
    const duration = Date.now() - startTime;

    // Prüfe Ergebnisse
    expect(result.success).toBe(0);
    expect(result.failed).toBe(1);
    expect(result.errors).toBeDefined();
    expect(result.errors.length).toBe(1);
    expect(result.errors[0].error).toContain('Timeout');
    expect(duration).toBeLessThan(2000); // Sollte unter 2 Sekunden sein (wegen Timeout)

    // Prüfe, dass Key nicht im Cache ist
    const cached = await cacheManager.get(testKey);
    expect(cached).toBeNull();

    // Cleanup
    await cacheManager.delete(testKey);
  }, 60000);

  test('E2E: Cache-Warming mit paralleler Ausführung', async () => {
    const testKeys = Array.from({ length: 5 }, (_, i) => generateTestKey(`warming-parallel-${i}`));

    // Definiere Endpoints
    const endpoints = testKeys.map((key, index) => ({
      key,
      fetchFn: async () => {
        // Simuliere API-Call mit kleiner Verzögerung
        await new Promise(resolve => setTimeout(resolve, 100));
        return {
          data: `parallel-data-${index}`,
          timestamp: Date.now(),
        };
      },
      options: {
        ttl: 300,
        revalidateAfter: 150,
      },
    }));

    // Führe Cache-Warming mit paralleler Ausführung durch
    const startTime = Date.now();
    const result = await cacheManager.warmCache(endpoints, {
      parallel: true,
    });
    const duration = Date.now() - startTime;

    // Prüfe Ergebnisse
    expect(result.success).toBe(5);
    expect(result.failed).toBe(0);
    // Parallele Ausführung sollte schneller sein als sequenzielle (5 * 100ms = 500ms sequenziell)
    expect(duration).toBeLessThan(1000); // Sollte unter 1 Sekunde sein

    // Prüfe, dass alle Keys im Cache sind
    for (const key of testKeys) {
      const cached = await cacheManager.get(key);
      expect(cached).not.toBeNull();
    }

    // Cleanup
    for (const key of testKeys) {
      await cacheManager.delete(key);
    }
  }, 60000);
});





