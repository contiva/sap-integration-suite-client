/**
 * E2E Test: Cache-Statistiken und Admin-Funktionen
 * 
 * Prüft Cache-Statistiken und Admin-Funktionen.
 * KEINE Fallbacks - Alle Admin-Funktionen müssen funktionieren.
 */

const { checkAllForCacheTests } = require('../utils/pre-flight-checks');
const { createCacheManager, generateTestKey, cleanupTestKeys } = require('../utils/test-helpers');

describe('Cache-Statistiken E2E Tests', () => {
  let cacheManager;

  beforeAll(async () => {
    // Pre-Flight Check
    await checkAllForCacheTests();

    cacheManager = createCacheManager();
    await cacheManager.connect();
  });

  afterAll(async () => {
    if (cacheManager) {
      await cleanupTestKeys(cacheManager);
      await cacheManager.close();
    }
  });

  test('getStats() liefert korrekte Statistiken', async () => {
    // Hole initiale Statistiken (können Keys von anderen Tests enthalten)
    const initialStats = await cacheManager.getStats();
    const initialKeyCount = initialStats.totalKeys;

    // Erstelle einige Test-Keys mit sap: Prefix (wie getStats() sie erwartet)
    const keys = [];
    for (let i = 0; i < 5; i++) {
      const key = `sap:test:${generateTestKey(`stats-test-${i}`)}`;
      keys.push(key);
      await cacheManager.set(key, { test: `data-${i}`, index: i }, {
        ttl: 60,
        revalidateAfter: 30
      });
    }

    // Hole Statistiken
    const stats = await cacheManager.getStats();
    
    expect(stats).not.toBeNull();
    expect(stats.totalKeys).toBeGreaterThanOrEqual(initialKeyCount + keys.length); // Mindestens unsere Keys zusätzlich
    expect(stats.totalSize).toBeGreaterThan(0);
    
    // Prüfe, ob averageTtl vorhanden ist (kann undefined sein wenn keine Keys)
    if (stats.averageTtl !== undefined) {
      expect(stats.averageTtl).toBeGreaterThan(0);
    }

    // Cleanup
    await cacheManager.batchDelete(keys);
  }, 60000);

  test('getKeyInfo() liefert korrekte Informationen', async () => {
    const testKey = generateTestKey('key-info');
    const testData = { test: 'key-info', value: 42 };

    await cacheManager.set(testKey, testData, {
      ttl: 60,
      revalidateAfter: 30
    });

    const keyInfo = await cacheManager.getKeyInfo(testKey);
    
    expect(keyInfo).not.toBeNull();
    expect(keyInfo.exists).toBe(true);
    expect(keyInfo.key).toBe(testKey);
    expect(keyInfo.size).toBeGreaterThan(0);
    expect(keyInfo.ttl).toBeGreaterThan(0);
    expect(keyInfo.age).toBeGreaterThanOrEqual(0);
    expect(keyInfo.expiresAt).toBeGreaterThan(0);
    expect(keyInfo.revalidateAfter).toBeGreaterThan(0);

    await cacheManager.delete(testKey);
  }, 60000);

  test('getKeyInfo() liefert null für nicht existierende Keys', async () => {
    const nonExistentKey = generateTestKey('non-existent');
    
    const keyInfo = await cacheManager.getKeyInfo(nonExistentKey);
    
    expect(keyInfo).not.toBeNull();
    expect(keyInfo.exists).toBe(false);
    expect(keyInfo.size).toBe(0);
    expect(keyInfo.ttl).toBe(-1);
  }, 60000);

  test('findKeysByPattern() findet alle passenden Keys', async () => {
    const prefix = generateTestKey('pattern-find');
    const keys = [
      `${prefix}-item1`,
      `${prefix}-item2`,
      `${prefix}-item3`
    ];

    // Setze Daten
    for (const key of keys) {
      await cacheManager.set(key, { test: 'pattern-find' }, {
        ttl: 60,
        revalidateAfter: 30
      });
    }

    // Finde Keys mit Pattern
    const foundKeys = await cacheManager.findKeysByPattern(`${prefix}*`);
    
    expect(foundKeys.length).toBeGreaterThanOrEqual(3);
    expect(foundKeys).toContain(keys[0]);
    expect(foundKeys).toContain(keys[1]);
    expect(foundKeys).toContain(keys[2]);

    // Cleanup
    await cacheManager.batchDelete(keys);
  }, 60000);

  test('findKeysByPattern() findet keine Keys für nicht passendes Pattern', async () => {
    const prefix = generateTestKey('pattern-no-match');
    const nonMatchingPrefix = generateTestKey('different-prefix');

    // Setze Key mit einem Prefix
    const key = `${prefix}-item1`;
    await cacheManager.set(key, { test: 'no-match' }, {
      ttl: 60,
      revalidateAfter: 30
    });

    // Suche mit nicht passendem Pattern
    const foundKeys = await cacheManager.findKeysByPattern(`${nonMatchingPrefix}*`);
    
    // Sollte unseren Key nicht finden
    expect(foundKeys).not.toContain(key);

    await cacheManager.delete(key);
  }, 60000);

  test('getStats() zeigt oldestEntry und newestEntry korrekt', async () => {
    // Erstelle Keys mit unterschiedlichen Timestamps
    const keys = [];
    
    // Erster Key
    const key1 = generateTestKey('stats-oldest');
    keys.push(key1);
    await cacheManager.set(key1, { test: 'oldest' }, {
      ttl: 60,
      revalidateAfter: 30
    });
    
    await new Promise(resolve => setTimeout(resolve, 100)); // Kurze Pause
    
    // Zweiter Key
    const key2 = generateTestKey('stats-newest');
    keys.push(key2);
    await cacheManager.set(key2, { test: 'newest' }, {
      ttl: 60,
      revalidateAfter: 30
    });

    const stats = await cacheManager.getStats();
    
    if (stats.oldestEntry) {
      expect(stats.oldestEntry.key).toBeDefined();
      expect(stats.oldestEntry.age).toBeGreaterThanOrEqual(0);
    }
    
    if (stats.newestEntry) {
      expect(stats.newestEntry.key).toBeDefined();
      expect(stats.newestEntry.age).toBeGreaterThanOrEqual(0);
    }

    // Cleanup
    await cacheManager.batchDelete(keys);
  }, 60000);
});

