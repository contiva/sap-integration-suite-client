/**
 * E2E Test: Redis-Verbindung und grundlegende Operationen
 * 
 * Prüft, ob Redis-Verbindung funktioniert und grundlegende Cache-Operationen möglich sind.
 * KEINE Fallbacks - Test schlägt fehl, wenn Redis nicht verfügbar ist.
 */

const { checkAllForCacheTests } = require('../utils/pre-flight-checks');
const { createCacheManager, generateTestKey, cleanupTestKeys } = require('../utils/test-helpers');

describe('Redis-Verbindung E2E Tests', () => {
  let cacheManager;

  beforeAll(async () => {
    // Pre-Flight Check: Prüft alle Voraussetzungen (Umgebungsvariablen, Redis, SAP)
    // Wirft Fehler wenn etwas fehlt - KEIN Fallback!
    await checkAllForCacheTests();

    // Erstelle CacheManager
    cacheManager = createCacheManager();
  });

  afterAll(async () => {
    // Cleanup: Schließe Redis-Verbindung
    if (cacheManager) {
      // Räume Test-Keys auf
      await cleanupTestKeys(cacheManager);
      await cacheManager.close();
    }
  });

  test('Redis-Verbindung muss erfolgreich sein', async () => {
    // Verbindung herstellen
    await cacheManager.connect();

    // Prüfe, ob Verbindung erfolgreich ist
    expect(cacheManager.isReady()).toBe(true);
  }, 60000);

  test('CacheManager.isReady() muss true zurückgeben nach Verbindung', async () => {
    // Verbindung sollte bereits in beforeAll hergestellt sein
    // Falls nicht, versuche erneut zu verbinden
    if (!cacheManager.isReady()) {
      await cacheManager.connect();
    }

    expect(cacheManager.isReady()).toBe(true);
  }, 60000);

  test('CacheManager.set() muss funktionieren', async () => {
    if (!cacheManager.isReady()) {
      await cacheManager.connect();
    }

    const testKey = generateTestKey('redis-connection-set');
    const testData = {
      test: 'set-operation',
      timestamp: Date.now(),
      data: { value: 123 }
    };

    // Setze Daten im Cache
    await cacheManager.set(testKey, testData, {
      ttl: 60, // 60 Sekunden TTL
      revalidateAfter: 30 // Nach 30 Sekunden revalidieren
    });

    // Prüfe, ob Daten gesetzt wurden
    const cached = await cacheManager.get(testKey);
    expect(cached).not.toBeNull();
    expect(cached.data).toEqual(testData);
    expect(cached.cachedAt).toBeGreaterThan(0);
    expect(cached.expiresAt).toBeGreaterThan(cached.cachedAt);
    expect(cached.revalidateAfter).toBeGreaterThan(cached.cachedAt);

    // Cleanup
    await cacheManager.delete(testKey);
  }, 60000);

  test('CacheManager.get() muss funktionieren', async () => {
    if (!cacheManager.isReady()) {
      await cacheManager.connect();
    }

    const testKey = generateTestKey('redis-connection-get');
    const testData = {
      test: 'get-operation',
      timestamp: Date.now()
    };

    // Setze Daten
    await cacheManager.set(testKey, testData, {
      ttl: 60,
      revalidateAfter: 30
    });

    // Hole Daten
    const cached = await cacheManager.get(testKey);
    expect(cached).not.toBeNull();
    expect(cached.data).toEqual(testData);

    // Cleanup
    await cacheManager.delete(testKey);
  }, 60000);

  test('CacheManager.delete() muss funktionieren', async () => {
    if (!cacheManager.isReady()) {
      await cacheManager.connect();
    }

    const testKey = generateTestKey('redis-connection-delete');
    const testData = { test: 'delete-operation' };

    // Setze Daten
    await cacheManager.set(testKey, testData, {
      ttl: 60,
      revalidateAfter: 30
    });

    // Prüfe, dass Daten existieren
    const beforeDelete = await cacheManager.get(testKey);
    expect(beforeDelete).not.toBeNull();

    // Lösche Daten
    const deleted = await cacheManager.delete(testKey);
    expect(deleted).toBe(true);

    // Prüfe, dass Daten nicht mehr existieren
    const afterDelete = await cacheManager.get(testKey);
    expect(afterDelete).toBeNull();
  }, 60000);

  test('CacheManager.close() muss erfolgreich sein', async () => {
    if (!cacheManager.isReady()) {
      await cacheManager.connect();
    }

    // Schließe Verbindung
    await cacheManager.close();

    // Prüfe, dass Verbindung geschlossen ist
    expect(cacheManager.isReady()).toBe(false);
  }, 60000);
});





