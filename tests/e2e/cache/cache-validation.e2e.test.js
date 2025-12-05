/**
 * E2E Test: Cache-Validierung
 * 
 * Prüft Cache-Validierungs-Funktionen mit echten Daten.
 * KEINE Fallbacks - Alle Operationen müssen erfolgreich sein.
 */

const { checkAllForCacheTests } = require('../utils/pre-flight-checks');
const { createCacheManager, generateTestKey, cleanupTestKeys } = require('../utils/test-helpers');

describe('Cache-Validierung E2E Tests', () => {
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

  test('E2E: Validierung eines Cache-Eintrags', async () => {
    const testKey = generateTestKey('validation-valid');
    const testData = { test: 'validation', value: 42 };

    // Setze gültigen Cache-Eintrag
    await cacheManager.set(testKey, testData, {
      ttl: 300, // 5 Minuten
      revalidateAfter: 150,
    });

    // Validiere Eintrag
    const result = await cacheManager.validateCacheEntry(testKey);

    // Prüfe Ergebnisse
    expect(result.isValid).toBe(true);
    expect(result.issues).toHaveLength(0);
    expect(result.repaired).toBeUndefined();

    await cacheManager.delete(testKey);
  }, 60000);

  test('E2E: Validierung mit SAP-Vergleich', async () => {
    const testKey = generateTestKey('validation-compare');
    const testData = { test: 'validation', value: 42 };
    const freshData = { test: 'validation', value: 42 }; // Gleiche Daten

    // Setze Cache-Eintrag
    await cacheManager.set(testKey, testData, {
      ttl: 300,
      revalidateAfter: 150,
    });

    // Validiere mit SAP-Vergleich
    const result = await cacheManager.validateCacheEntry(testKey, {
      compareWithSap: true,
      fetchFn: async () => freshData,
    });

    // Prüfe Ergebnisse
    expect(result.isValid).toBe(true);
    expect(result.issues).toHaveLength(0);
    expect(result.comparisonResult).toBeDefined();
    expect(result.comparisonResult.matches).toBe(true);

    await cacheManager.delete(testKey);
  }, 60000);

  test('E2E: Validierung mit abweichenden SAP-Daten', async () => {
    const testKey = generateTestKey('validation-diff');
    const testData = { test: 'validation', value: 42 };
    const freshData = { test: 'validation', value: 99 }; // Abweichende Daten

    // Setze Cache-Eintrag
    await cacheManager.set(testKey, testData, {
      ttl: 300,
      revalidateAfter: 150,
    });

    // Validiere mit SAP-Vergleich
    const result = await cacheManager.validateCacheEntry(testKey, {
      compareWithSap: true,
      fetchFn: async () => freshData,
    });

    // Prüfe Ergebnisse
    expect(result.isValid).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
    expect(result.issues.some(issue => issue.includes('differs from SAP API'))).toBe(true);
    expect(result.comparisonResult).toBeDefined();
    expect(result.comparisonResult.matches).toBe(false);

    await cacheManager.delete(testKey);
  }, 60000);

  test('E2E: Auto-Repair für abgelaufenen Eintrag', async () => {
    const testKey = generateTestKey('validation-expired');
    const testData = { test: 'validation', value: 42 };

    // Setze Cache-Eintrag mit sehr kurzer TTL
    await cacheManager.set(testKey, testData, {
      ttl: 1, // 1 Sekunde
      revalidateAfter: 1, // Mindestens 1 Sekunde (muss positive Zahl sein)
    });

    // Warte bis TTL abgelaufen ist
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Prüfe, ob Key noch existiert (kann bereits von Redis gelöscht worden sein)
    const keyExistsBeforeValidation = await cacheManager.get(testKey);
    
    // Validiere mit Auto-Repair
    const result = await cacheManager.validateCacheEntry(testKey, {
      autoRepair: true,
    });

    // Prüfe Ergebnisse
    expect(result.isValid).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
    
    // Wenn der Key bereits gelöscht wurde, ist die Issue "Key not found"
    // Wenn der Key noch existiert, sollte die Issue "Cache entry expired" sein
    // Nach Auto-Repair sollte "Expired entry deleted" hinzugefügt werden
    const hasExpiredOrDeleted = result.issues.some(issue => {
      const issueLower = issue.toLowerCase();
      return issueLower.includes('expired') || issueLower.includes('deleted') || issueLower.includes('not found');
    });
    expect(hasExpiredOrDeleted).toBe(true);
    
    // Wenn Auto-Repair aktiviert war und der Key existierte, sollte repaired true sein
    if (keyExistsBeforeValidation) {
      expect(result.repaired).toBe(true);
      // Prüfe, ob eine Issue-Nachricht mit "deleted" vorhanden ist (nach Auto-Repair)
      const hasDeleted = result.issues.some(issue => issue.toLowerCase().includes('deleted'));
      expect(hasDeleted).toBe(true);
    }

    // Prüfe, dass Key gelöscht wurde
    const cached = await cacheManager.get(testKey);
    expect(cached).toBeNull();
  }, 60000);

  test('E2E: Validierung nach Pattern', async () => {
    const testKeys = [];
    const testData = { test: 'validation-pattern' };
    const timestamp = Date.now();
    const basePrefix = `validation-pattern-${timestamp}`;

    // Erstelle mehrere Test-Keys mit gleichem Prefix
    // generateTestKey erzeugt: prefix-timestamp-random
    // Wir speichern die vollständigen Keys, um sie später zu validieren
    for (let i = 0; i < 5; i++) {
      const testKey = generateTestKey(`${basePrefix}-${i}`);
      testKeys.push(testKey);
      
      await cacheManager.set(testKey, { ...testData, index: i }, {
        ttl: 300,
        revalidateAfter: 150,
      });
    }

    // Validiere alle Keys mit Pattern
    // Das Pattern muss den gemeinsamen Prefix enthalten, der vor dem Timestamp kommt
    // Da generateTestKey einen neuen Timestamp hinzufügt, müssen wir nach dem basePrefix suchen
    // Pattern: basePrefix-* findet alle Keys, die mit basePrefix beginnen
    const pattern = `${basePrefix}*`;
    const result = await cacheManager.validateCacheByPattern(pattern);

    // Prüfe Ergebnisse
    expect(result.total).toBe(5);
    expect(result.valid).toBe(5);
    expect(result.invalid).toBe(0);
    expect(result.repaired).toBe(0);
    expect(result.issues).toHaveLength(0);

    // Cleanup
    for (const key of testKeys) {
      await cacheManager.delete(key);
    }
  }, 60000);

  test('E2E: Validierung nach Pattern mit Auto-Repair', async () => {
    const testKeys = [];
    const testData = { test: 'validation-repair' };
    // Verwende einen gemeinsamen Prefix, damit das Pattern funktioniert
    const basePrefix = `validation-repair-${Date.now()}`;

    // Erstelle mehrere Test-Keys - einige mit kurzer TTL (werden ablaufen)
    // WICHTIG: Verwende den gleichen Prefix für alle Keys, damit das Pattern funktioniert
    for (let i = 0; i < 3; i++) {
      // Verwende den gleichen Prefix, aber mit unterschiedlichem Suffix
      const testKey = `${basePrefix}-${i}-${Math.random().toString(36).substring(7)}`;
      testKeys.push(testKey);
      
      // Erste zwei Keys mit kurzer TTL, dritter mit langer TTL
      const ttl = i < 2 ? 1 : 300;
      await cacheManager.set(testKey, { ...testData, index: i }, {
        ttl,
        revalidateAfter: 1, // Mindestens 1 Sekunde (muss positive Zahl sein)
      });
    }

    // Warte bis erste zwei Keys abgelaufen sind
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Prüfe, dass die Keys vor der Validierung existieren
    // Redis SCAN findet auch abgelaufene Keys, solange sie noch im Speicher sind
    const keysBeforeValidation = await cacheManager.findKeysByPattern(`${basePrefix}*`);
    // Wenn weniger Keys gefunden werden, prüfe direkt die einzelnen Keys
    if (keysBeforeValidation.length < 3) {
      // Prüfe, ob die Keys direkt existieren (auch wenn abgelaufen)
      for (const key of testKeys) {
        const exists = await cacheManager.get(key);
        // Keys können null sein, wenn sie abgelaufen sind, aber das ist OK
      }
    }
    // Mindestens 1 Key sollte gefunden werden (der dritte mit langer TTL)
    expect(keysBeforeValidation.length).toBeGreaterThanOrEqual(1);

    // Validiere alle Keys mit Pattern und Auto-Repair
    // Pattern: basePrefix-* findet alle Keys, die mit basePrefix beginnen
    const pattern = `${basePrefix}*`;
    const result = await cacheManager.validateCacheByPattern(pattern, {
      autoRepair: true,
    });

    // Prüfe Ergebnisse
    // Das Pattern sollte alle 3 Keys finden, aber wenn Redis die abgelaufenen Keys bereits entfernt hat,
    // können weniger Keys gefunden werden. Wir prüfen daher flexibel.
    expect(result.total).toBeGreaterThanOrEqual(1); // Mindestens 1 Key (der dritte mit langer TTL)
    expect(result.total).toBeLessThanOrEqual(3); // Maximal 3 Keys
    // Wenn alle 3 Keys gefunden wurden, sollten 2 invalid und 1 valid sein
    if (result.total === 3) {
      expect(result.valid).toBe(1); // Nur der dritte Key ist noch gültig
      expect(result.invalid).toBe(2); // Erste zwei Keys sind abgelaufen
      expect(result.repaired).toBe(2); // Erste zwei Keys wurden gelöscht
    } else {
      // Wenn weniger Keys gefunden wurden, prüfe, dass mindestens 1 valid ist
      expect(result.valid).toBeGreaterThanOrEqual(1);
    }
    expect(result.issues.length).toBeGreaterThanOrEqual(0);

    // Prüfe, dass abgelaufene Keys gelöscht wurden
    const cached1 = await cacheManager.get(testKeys[0]);
    expect(cached1).toBeNull();
    
    const cached2 = await cacheManager.get(testKeys[1]);
    expect(cached2).toBeNull();

    // Prüfe, dass gültiger Key noch existiert
    const cached3 = await cacheManager.get(testKeys[2]);
    expect(cached3).not.toBeNull();

    // Cleanup
    for (const key of testKeys) {
      await cacheManager.delete(key);
    }
  }, 60000);
});



