/**
 * E2E Test: TTL-Management
 * 
 * Prüft TTL-Management-Funktionen mit echten Daten.
 * KEINE Fallbacks - Alle Operationen müssen erfolgreich sein.
 */

const { checkAllForCacheTests } = require('../utils/pre-flight-checks');
const { createCacheManager, generateTestKey, cleanupTestKeys } = require('../utils/test-helpers');

describe('TTL-Management E2E Tests', () => {
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

  test('E2E: TTL-Änderung', async () => {
    const testKey = generateTestKey('ttl-update');
    const testData = { test: 'ttl-update' };

    // Setze Daten mit initialer TTL
    await cacheManager.set(testKey, testData, {
      ttl: 120, // 2 Minuten
      revalidateAfter: 60
    });

    // Prüfe initiale TTL
    const initialInfo = await cacheManager.getKeyInfo(testKey);
    expect(initialInfo).not.toBeNull();
    expect(initialInfo.ttl).toBeGreaterThan(100); // Mindestens 100 Sekunden

    // Ändere TTL auf 3600 Sekunden (1 Stunde)
    const updateSuccess = await cacheManager.updateTTL(testKey, 3600);
    expect(updateSuccess).toBe(true);

    // Prüfe neue TTL
    const updatedInfo = await cacheManager.getKeyInfo(testKey);
    expect(updatedInfo).not.toBeNull();
    expect(updatedInfo.ttl).toBeGreaterThan(3500); // Mindestens 3500 Sekunden
    expect(updatedInfo.ttl).toBeLessThanOrEqual(3600); // Maximal 3600 Sekunden

    await cacheManager.delete(testKey);
  }, 60000);

  test('E2E: TTL-Verlängerung', async () => {
    const testKey = generateTestKey('ttl-extend');
    const testData = { test: 'ttl-extend' };

    // Setze Daten mit initialer TTL
    await cacheManager.set(testKey, testData, {
      ttl: 300, // 5 Minuten
      revalidateAfter: 150
    });

    // Warte kurz, damit TTL etwas abläuft
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Prüfe initiale TTL
    const initialInfo = await cacheManager.getKeyInfo(testKey);
    expect(initialInfo).not.toBeNull();
    const initialTTL = initialInfo.ttl;
    expect(initialTTL).toBeGreaterThan(0);
    expect(initialTTL).toBeLessThan(300);

    // Verlängere TTL um 1800 Sekunden (30 Minuten)
    const extendSuccess = await cacheManager.extendTTL(testKey, 1800);
    expect(extendSuccess).toBe(true);

    // Prüfe neue TTL
    const extendedInfo = await cacheManager.getKeyInfo(testKey);
    expect(extendedInfo).not.toBeNull();
    const extendedTTL = extendedInfo.ttl;
    
    // Neue TTL sollte etwa initialTTL + 1800 sein (mit Toleranz für Verzögerung)
    expect(extendedTTL).toBeGreaterThan(initialTTL + 1700); // Mindestens 1700 Sekunden mehr
    expect(extendedTTL).toBeLessThan(initialTTL + 1900); // Maximal 1900 Sekunden mehr

    await cacheManager.delete(testKey);
  }, 60000);

  test('E2E: Batch-TTL-Update', async () => {
    const testKeys = [];
    const testData = { test: 'batch-ttl-update' };

    // Erstelle 10 Test-Keys
    for (let i = 0; i < 10; i++) {
      const testKey = generateTestKey(`batch-ttl-${i}`);
      testKeys.push(testKey);
      
      await cacheManager.set(testKey, { ...testData, index: i }, {
        ttl: 300, // 5 Minuten
        revalidateAfter: 150
      });
    }

    // Prüfe initiale TTLs
    for (const key of testKeys) {
      const info = await cacheManager.getKeyInfo(key);
      expect(info).not.toBeNull();
      expect(info.ttl).toBeGreaterThan(0);
    }

    // Batch-Update: Setze alle TTLs auf 3600 Sekunden
    const updates = testKeys.map(key => ({ key, ttl: 3600 }));
    const startTime = Date.now();
    const result = await cacheManager.batchUpdateTTL(updates);
    const duration = Date.now() - startTime;

    // Prüfe Ergebnisse
    expect(result.success).toBe(10);
    expect(result.failed).toBe(0);
    expect(duration).toBeLessThan(1000); // Sollte unter 1 Sekunde sein

    // Prüfe neue TTLs
    for (const key of testKeys) {
      const info = await cacheManager.getKeyInfo(key);
      expect(info).not.toBeNull();
      expect(info.ttl).toBeGreaterThan(3500); // Mindestens 3500 Sekunden
      expect(info.ttl).toBeLessThanOrEqual(3600); // Maximal 3600 Sekunden
    }

    // Cleanup
    for (const key of testKeys) {
      await cacheManager.delete(key);
    }
  }, 60000);

  test('E2E: TTL-Update für nicht existierenden Key', async () => {
    const nonExistentKey = generateTestKey('non-existent-ttl');

    // Versuche TTL zu ändern
    const result = await cacheManager.updateTTL(nonExistentKey, 3600);
    expect(result).toBe(false);
  }, 60000);

  test('E2E: TTL-Verlängerung für abgelaufenen Eintrag', async () => {
    const testKey = generateTestKey('ttl-extend-expired');
    const testData = { test: 'ttl-extend-expired' };

    // Setze Daten mit sehr kurzer TTL
    await cacheManager.set(testKey, testData, {
      ttl: 1, // 1 Sekunde
      revalidateAfter: 0
    });

    // Warte bis TTL abgelaufen ist
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Versuche TTL zu verlängern (sollte fehlschlagen, da abgelaufen)
    const extendSuccess = await cacheManager.extendTTL(testKey, 1800);
    expect(extendSuccess).toBe(false);

    // Prüfe, dass Key nicht mehr existiert oder abgelaufen ist
    const info = await cacheManager.getKeyInfo(testKey);
    if (info) {
      expect(info.ttl).toBeLessThanOrEqual(0);
    }

    await cacheManager.delete(testKey);
  }, 60000);
});





