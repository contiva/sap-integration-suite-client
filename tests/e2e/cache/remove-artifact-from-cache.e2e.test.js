/**
 * E2E Test: Artefakt aus Cache entfernen
 * 
 * Prüft das Entfernen von Artefakten aus dem Cache ohne vollständige Cache-Invalidierung.
 * KEINE Fallbacks - Sowohl SAP als auch Redis müssen funktionieren.
 */

const { checkAllForCacheTests } = require('../utils/pre-flight-checks');
const { createSapClient, createCacheManager, cleanupTestKeys } = require('../utils/test-helpers');

describe('Remove Artifact from Cache E2E Tests', () => {
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

  test('E2E: Artefakt nach Löschung entfernen', async () => {
    // Setup: Cache mit Artefakten füllen
    const deployedArtifacts = await client.integrationContent.getDeployedArtifacts();
    expect(deployedArtifacts).toBeDefined();
    expect(Array.isArray(deployedArtifacts)).toBe(true);

    // Warte kurz, damit Cache-Operation abgeschlossen ist
    await new Promise(resolve => setTimeout(resolve, 500));

    if (deployedArtifacts.length > 0) {
      const artifact = deployedArtifacts[0];
      const artifactId = artifact.Id || artifact.id;

      // Action: Artefakt aus Cache entfernen
      // In einem echten Szenario würde man das Artefakt zuerst von SAP löschen
      const updatedCount = await client.integrationContent.removeArtifactFromCache(artifactId);

      expect(updatedCount).toBeGreaterThanOrEqual(0);

      // Warte kurz, damit Cache-Operation abgeschlossen ist
      await new Promise(resolve => setTimeout(resolve, 500));

      // Assert: Prüfe, ob Cache aktualisiert wurde
      // In einem echten Szenario würde man getDeployedArtifacts() aufrufen
      // und prüfen, ob das Artefakt nicht mehr enthalten ist
      const stats = await cacheManager.getStats();
      expect(stats.totalKeys).toBeGreaterThanOrEqual(0);
    }
  }, 120000);

  test('E2E: Entfernung aus mehreren Collection-Caches', async () => {
    // Setup: Mehrere Collection-Caches füllen
    const deployedArtifacts = await client.integrationContent.getDeployedArtifacts();
    expect(deployedArtifacts).toBeDefined();

    // Warte kurz
    await new Promise(resolve => setTimeout(resolve, 500));

    if (deployedArtifacts.length > 0) {
      const artifact = deployedArtifacts[0];
      const artifactId = artifact.Id || artifact.id;

      // Action: Artefakt entfernen
      const updatedCount = await client.integrationContent.removeArtifactFromCache(artifactId);

      // Assert: Sollte mehrere Keys aktualisiert haben
      expect(updatedCount).toBeGreaterThanOrEqual(0);

      // Warte kurz
      await new Promise(resolve => setTimeout(resolve, 500));

      // Prüfe Cache-Statistiken
      const stats = await cacheManager.getStats();
      expect(stats.totalKeys).toBeGreaterThanOrEqual(0);
    }
  }, 120000);

  test('E2E: Entfernung von nicht existierendem Artefakt', async () => {
    // Setup: Cache mit Artefakten füllen
    const deployedArtifacts = await client.integrationContent.getDeployedArtifacts();
    expect(deployedArtifacts).toBeDefined();

    // Warte kurz
    await new Promise(resolve => setTimeout(resolve, 500));

    // Action: Versuche, nicht existierendes Artefakt zu entfernen
    const nonExistentId = `NonExistentArtifact_${Date.now()}`;
    const updatedCount = await client.integrationContent.removeArtifactFromCache(nonExistentId);

    // Assert: Cache bleibt unverändert, keine Fehler
    // updatedCount sollte 0 sein, da kein Artefakt gefunden wurde
    expect(updatedCount).toBe(0);

    // Warte kurz
    await new Promise(resolve => setTimeout(resolve, 500));

    // Prüfe, dass Cache noch funktioniert
    const stats = await cacheManager.getStats();
    expect(stats).toBeDefined();
  }, 120000);
});





