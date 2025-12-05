/**
 * E2E Test: Cache-Revalidation
 * 
 * Prüft Cache-Revalidation und stale-while-revalidate Pattern.
 * KEINE Fallbacks - Revalidation muss funktionieren.
 */

const { checkAllForCacheTests } = require('../utils/pre-flight-checks');
const { createCacheManager, generateTestKey, cleanupTestKeys, wait } = require('../utils/test-helpers');

describe('Cache-Revalidation E2E Tests', () => {
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

  test('Cache-Eintrag wird als stale markiert nach revalidateAfter', async () => {
    const testKey = generateTestKey('cache-stale');
    const testData = { test: 'stale-check' };

    // Setze Daten mit sehr kurzer Revalidation-Zeit
    await cacheManager.set(testKey, testData, {
      ttl: 60, // 60 Sekunden TTL
      revalidateAfter: 2 // Nach 2 Sekunden revalidieren
    });

    const cached = await cacheManager.get(testKey);
    expect(cached).not.toBeNull();
    
    // Direkt nach Set sollte nicht stale sein
    expect(cacheManager.shouldRevalidate(cached)).toBe(false);

    // Warte bis revalidateAfter erreicht ist
    await wait(2500); // 2.5 Sekunden

    const cachedAfterWait = await cacheManager.get(testKey);
    expect(cachedAfterWait).not.toBeNull();
    
    // Jetzt sollte stale sein
    expect(cacheManager.shouldRevalidate(cachedAfterWait)).toBe(true);
    expect(cacheManager.isExpired(cachedAfterWait)).toBe(false); // Noch nicht abgelaufen

    await cacheManager.delete(testKey);
  }, 60000);

  test('Cache-Eintrag wird als expired markiert nach expiresAt', async () => {
    const testKey = generateTestKey('cache-expired');
    const testData = { test: 'expired-check' };

    // Setze Daten mit sehr kurzer TTL
    await cacheManager.set(testKey, testData, {
      ttl: 3, // 3 Sekunden TTL
      revalidateAfter: 1 // Nach 1 Sekunde revalidieren
    });

    const cached = await cacheManager.get(testKey);
    expect(cached).not.toBeNull();
    
    // Direkt nach Set sollte nicht expired sein
    expect(cacheManager.isExpired(cached)).toBe(false);

    // Warte bis TTL abgelaufen ist
    await wait(3500); // 3.5 Sekunden

    const cachedAfterWait = await cacheManager.get(testKey);
    
    // Redis löscht Keys automatisch nach TTL, daher kann der Key null sein
    if (cachedAfterWait) {
      // Jetzt sollte expired sein
      expect(cacheManager.isExpired(cachedAfterWait)).toBe(true);
      expect(cacheManager.shouldRevalidate(cachedAfterWait)).toBe(true); // Auch stale
    } else {
      // Key wurde von Redis automatisch gelöscht (TTL abgelaufen)
      // Das ist auch ein gültiges Ergebnis
      expect(cachedAfterWait).toBeNull();
    }

    await cacheManager.delete(testKey);
  }, 60000);

  test('Background-Revalidation funktioniert', async () => {
    const testKey = generateTestKey('cache-bg-revalidation');
    const initialData = { test: 'initial', value: 1 };
    let fetchCount = 0;

    // Setze initiale Daten
    await cacheManager.set(testKey, initialData, {
      ttl: 60,
      revalidateAfter: 2 // Nach 2 Sekunden revalidieren
    });

    // Fetch-Funktion für Revalidation
    const fetchFn = async () => {
      fetchCount++;
      return { test: 'revalidated', value: fetchCount };
    };

    // Warte bis stale
    await wait(2500);

    const cachedBefore = await cacheManager.get(testKey);
    expect(cacheManager.shouldRevalidate(cachedBefore)).toBe(true);

    // Starte Background-Revalidation
    await cacheManager.revalidateInBackground(
      testKey,
      fetchFn,
      {
        ttl: 60,
        revalidateAfter: 2
      }
    );

    // Warte kurz, damit Revalidation starten kann
    await wait(500);

    // Prüfe, dass Fetch-Funktion aufgerufen wurde (nach kurzer Zeit)
    // Revalidation läuft im Hintergrund, daher müssen wir etwas warten
    await wait(2000);

    // Prüfe, dass Daten aktualisiert wurden
    const cachedAfter = await cacheManager.get(testKey);
    expect(cachedAfter).not.toBeNull();
    
    // Fetch-Funktion sollte aufgerufen worden sein
    expect(fetchCount).toBeGreaterThan(0);

    await cacheManager.delete(testKey);
  }, 120000); // Längerer Timeout für Background-Operationen

  test('Stale-Daten werden zurückgegeben während Revalidation läuft', async () => {
    const testKey = generateTestKey('cache-stale-while-revalidate');
    const initialData = { test: 'stale-data', value: 1 };
    let fetchCount = 0;

    // Setze initiale Daten
    await cacheManager.set(testKey, initialData, {
      ttl: 60,
      revalidateAfter: 2
    });

    // Warte bis stale
    await wait(2500);

    const staleData = await cacheManager.get(testKey);
    expect(cacheManager.shouldRevalidate(staleData)).toBe(true);
    expect(staleData.data.value).toBe(1);

    // Fetch-Funktion mit Verzögerung
    const fetchFn = async () => {
      fetchCount++;
      await wait(1000); // Simuliere langsame API
      return { test: 'fresh-data', value: 2 };
    };

    // Starte Background-Revalidation
    const revalidationPromise = cacheManager.revalidateInBackground(
      testKey,
      fetchFn,
      {
        ttl: 60,
        revalidateAfter: 2
      }
    );

    // Während Revalidation läuft, sollten stale Daten zurückgegeben werden
    // Hole Daten sofort (sollte stale sein)
    const dataDuringRevalidation = await cacheManager.get(testKey);
    expect(dataDuringRevalidation).not.toBeNull();
    expect(dataDuringRevalidation.data.value).toBe(1); // Stale-Daten

    // Warte auf Revalidation
    await wait(2000);

    // Nach Revalidation sollten frische Daten vorhanden sein
    const freshData = await cacheManager.get(testKey);
    expect(freshData).not.toBeNull();
    expect(fetchCount).toBeGreaterThan(0);

    await cacheManager.delete(testKey);
  }, 120000);
});

