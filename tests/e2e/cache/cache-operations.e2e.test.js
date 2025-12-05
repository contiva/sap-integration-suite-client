/**
 * E2E Test: Cache-Operationen
 * 
 * Prüft alle Cache-Operationen mit echten Daten.
 * KEINE Fallbacks - Alle Operationen müssen erfolgreich sein.
 */

const { checkAllForCacheTests } = require('../utils/pre-flight-checks');
const { createCacheManager, generateTestKey, cleanupTestKeys } = require('../utils/test-helpers');

describe('Cache-Operationen E2E Tests', () => {
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

  test('Cache-Set mit TTL muss funktionieren', async () => {
    const testKey = generateTestKey('cache-set-ttl');
    const testData = {
      operation: 'set-with-ttl',
      value: 42,
      nested: { data: 'test' }
    };

    await cacheManager.set(testKey, testData, {
      ttl: 120, // 2 Minuten
      revalidateAfter: 60 // 1 Minute
    });

    const cached = await cacheManager.get(testKey);
    expect(cached).not.toBeNull();
    expect(cached.data).toEqual(testData);
    
    // Prüfe TTL
    const now = Date.now();
    expect(cached.expiresAt).toBeGreaterThan(now + 100000); // Mindestens 100 Sekunden
    expect(cached.revalidateAfter).toBeGreaterThan(now + 50000); // Mindestens 50 Sekunden

    await cacheManager.delete(testKey);
  }, 60000);

  test('Cache-Get mit Ablaufprüfung muss funktionieren', async () => {
    const testKey = generateTestKey('cache-get-expiry');
    const testData = { test: 'expiry-check' };

    // Setze Daten mit kurzer TTL
    await cacheManager.set(testKey, testData, {
      ttl: 10, // 10 Sekunden
      revalidateAfter: 5 // 5 Sekunden
    });

    const cached = await cacheManager.get(testKey);
    expect(cached).not.toBeNull();
    
    // Prüfe, dass Daten nicht abgelaufen sind
    expect(cacheManager.isExpired(cached)).toBe(false);
    expect(cacheManager.shouldRevalidate(cached)).toBe(false);

    await cacheManager.delete(testKey);
  }, 60000);

  test('Cache-Delete muss funktionieren', async () => {
    const testKey = generateTestKey('cache-delete');
    const testData = { test: 'delete' };

    await cacheManager.set(testKey, testData, { ttl: 60, revalidateAfter: 30 });
    
    const beforeDelete = await cacheManager.get(testKey);
    expect(beforeDelete).not.toBeNull();

    const deleted = await cacheManager.delete(testKey);
    expect(deleted).toBe(true);

    const afterDelete = await cacheManager.get(testKey);
    expect(afterDelete).toBeNull();
  }, 60000);

  test('Cache-Update: updateField muss funktionieren', async () => {
    const testKey = generateTestKey('cache-update-field');
    const initialData = {
      status: 'INITIAL',
      value: 100,
      nested: { field: 'old' }
    };

    await cacheManager.set(testKey, initialData, { ttl: 60, revalidateAfter: 30 });

    // Update einzelnes Feld
    const updated = await cacheManager.updateField(testKey, 'data.status', 'UPDATED');
    expect(updated).toBe(true);

    const cached = await cacheManager.get(testKey);
    expect(cached.data.status).toBe('UPDATED');
    expect(cached.data.value).toBe(100); // Andere Felder unverändert

    // Update verschachteltes Feld
    await cacheManager.updateField(testKey, 'data.nested.field', 'new');
    const cached2 = await cacheManager.get(testKey);
    expect(cached2.data.nested.field).toBe('new');

    await cacheManager.delete(testKey);
  }, 60000);

  test('Cache-Update: updateFields muss funktionieren', async () => {
    const testKey = generateTestKey('cache-update-fields');
    const initialData = {
      status: 'INITIAL',
      value: 100,
      timestamp: 0
    };

    await cacheManager.set(testKey, initialData, { ttl: 60, revalidateAfter: 30 });

    // Update mehrere Felder
    const updated = await cacheManager.updateFields(testKey, {
      'data.status': 'UPDATED',
      'data.value': 200,
      'data.timestamp': Date.now()
    });
    expect(updated).toBe(true);

    const cached = await cacheManager.get(testKey);
    expect(cached.data.status).toBe('UPDATED');
    expect(cached.data.value).toBe(200);
    expect(cached.data.timestamp).toBeGreaterThan(0);

    await cacheManager.delete(testKey);
  }, 60000);

  test('Cache-Update: updateInArray muss funktionieren', async () => {
    const testKey = generateTestKey('cache-update-array');
    const initialData = {
      items: [
        { Id: 'item1', status: 'PENDING', value: 10 },
        { Id: 'item2', status: 'PENDING', value: 20 },
        { Id: 'item3', status: 'PENDING', value: 30 }
      ]
    };

    await cacheManager.set(testKey, initialData, { ttl: 60, revalidateAfter: 30 });

    // Update Item in Array
    const updated = await cacheManager.updateInArray(
      testKey,
      'data.items',
      'item2',
      {
        status: 'COMPLETED',
        value: 25
      }
    );
    expect(updated).toBe(true);

    const cached = await cacheManager.get(testKey);
    const item2 = cached.data.items.find(item => item.Id === 'item2');
    expect(item2).not.toBeUndefined();
    expect(item2.status).toBe('COMPLETED');
    expect(item2.value).toBe(25);
    
    // Andere Items unverändert
    const item1 = cached.data.items.find(item => item.Id === 'item1');
    expect(item1.status).toBe('PENDING');
    expect(item1.value).toBe(10);

    await cacheManager.delete(testKey);
  }, 60000);

  test('Batch-Operationen: batchUpdate muss funktionieren', async () => {
    const keys = [
      generateTestKey('batch-update-1'),
      generateTestKey('batch-update-2'),
      generateTestKey('batch-update-3')
    ];

    // Setze initiale Daten
    for (const key of keys) {
      await cacheManager.set(key, { status: 'INITIAL', value: 0 }, {
        ttl: 60,
        revalidateAfter: 30
      });
    }

    // Batch-Update
    const updates = keys.map((key, index) => ({
      key,
      updates: {
        'data.status': 'UPDATED',
        'data.value': (index + 1) * 10
      }
    }));

    const result = await cacheManager.batchUpdate(updates);
    expect(result.success).toBe(3);
    expect(result.failed).toBe(0);

    // Prüfe Ergebnisse
    for (let i = 0; i < keys.length; i++) {
      const cached = await cacheManager.get(keys[i]);
      expect(cached.data.status).toBe('UPDATED');
      expect(cached.data.value).toBe((i + 1) * 10);
    }

    // Cleanup
    await cacheManager.batchDelete(keys);
  }, 60000);

  test('Batch-Operationen: batchDelete muss funktionieren', async () => {
    const keys = [
      generateTestKey('batch-delete-1'),
      generateTestKey('batch-delete-2'),
      generateTestKey('batch-delete-3')
    ];

    // Setze Daten
    for (const key of keys) {
      await cacheManager.set(key, { test: 'batch-delete' }, {
        ttl: 60,
        revalidateAfter: 30
      });
    }

    // Prüfe, dass alle Keys existieren
    for (const key of keys) {
      const cached = await cacheManager.get(key);
      expect(cached).not.toBeNull();
    }

    // Batch-Delete
    const deleted = await cacheManager.batchDelete(keys);
    expect(deleted).toBe(3);

    // Prüfe, dass alle Keys gelöscht sind
    for (const key of keys) {
      const cached = await cacheManager.get(key);
      expect(cached).toBeNull();
    }
  }, 60000);

  test('Pattern-basierte Löschung: deleteByPattern muss funktionieren', async () => {
    const prefix = generateTestKey('pattern-delete');
    const keys = [
      `${prefix}-item1`,
      `${prefix}-item2`,
      `${prefix}-item3`
    ];

    // Setze Daten
    for (const key of keys) {
      await cacheManager.set(key, { test: 'pattern-delete' }, {
        ttl: 60,
        revalidateAfter: 30
      });
    }

    // Prüfe, dass alle Keys existieren
    for (const key of keys) {
      const cached = await cacheManager.get(key);
      expect(cached).not.toBeNull();
    }

    // Lösche mit Pattern
    const deleted = await cacheManager.deleteByPattern(`${prefix}*`);
    expect(deleted).toBe(3);

    // Prüfe, dass alle Keys gelöscht sind
    for (const key of keys) {
      const cached = await cacheManager.get(key);
      expect(cached).toBeNull();
    }
  }, 60000);
});





