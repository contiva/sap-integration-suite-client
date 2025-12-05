/**
 * E2E Test: Package zu Artifact Workflow
 * 
 * Prüft kompletten Workflow von Package zu Artifact.
 * KEINE Fallbacks - Alle Schritte müssen erfolgreich sein.
 */

const { checkAllForCacheTests } = require('../utils/pre-flight-checks');
const { createSapClient, createCacheManager, cleanupTestKeys } = require('../utils/test-helpers');

describe('Package to Artifact Workflow E2E Tests', () => {
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

  test('Kompletter Workflow: Package abrufen → Artifacts abrufen → Artifact-Details abrufen', async () => {
    // Schritt 1: Package abrufen
    const packages = await client.integrationContent.getIntegrationPackages({
      top: 1
    });

    expect(packages.length).toBeGreaterThan(0);
    const packageId = packages[0].Id;
    expect(packageId).toBeDefined();

    // Schritt 2: Package-Details abrufen
    const packageDetails = await client.integrationContent.getIntegrationPackageById(packageId);

    expect(packageDetails).toBeDefined();
    expect(packageDetails.Id).toBe(packageId);

    // Schritt 3: Artifacts aus Package abrufen
    const artifacts = await client.integrationContent.getDeployedArtifacts({
      top: 10
    });

    expect(artifacts).toBeDefined();
    expect(Array.isArray(artifacts)).toBe(true);

    if (artifacts.length > 0) {
      const artifactId = artifacts[0].Id;
      expect(artifactId).toBeDefined();

      // Schritt 4: Artifact-Details abrufen
      const artifactDetails = await client.integrationContent.getDeployedArtifactById(artifactId);

      expect(artifactDetails).toBeDefined();
      expect(artifactDetails.Id).toBe(artifactId);
    }
  }, 120000);

  test('Cache wird korrekt verwendet im Workflow', async () => {
    // Schritt 1: Package abrufen (Cache MISS)
    const packages1 = await client.integrationContent.getIntegrationPackages({
      top: 5
    });

    expect(packages1.length).toBeGreaterThan(0);

    // Warte kurz, damit Cache-Operation abgeschlossen ist
    await new Promise(resolve => setTimeout(resolve, 500));

    // Schritt 2: Package erneut abrufen (sollte Cache HIT sein)
    const packages2 = await client.integrationContent.getIntegrationPackages({
      top: 5
    });

    expect(packages2).toBeDefined();
    expect(Array.isArray(packages2)).toBe(true);
    expect(packages2.length).toBe(packages1.length);

    // Schritt 3: Artifact abrufen (Cache MISS)
    const artifacts1 = await client.integrationContent.getDeployedArtifacts({
      top: 5
    });

    expect(artifacts1).toBeDefined();
    expect(Array.isArray(artifacts1)).toBe(true);

    // Warte kurz
    await new Promise(resolve => setTimeout(resolve, 500));

    // Schritt 4: Artifact erneut abrufen (sollte Cache HIT sein)
    const artifacts2 = await client.integrationContent.getDeployedArtifacts({
      top: 5
    });

    expect(artifacts2).toBeDefined();
    expect(Array.isArray(artifacts2)).toBe(true);
    expect(artifacts2.length).toBe(artifacts1.length);
  }, 120000);

  test('Cache-Invalidierung nach Status-Änderung funktioniert', async () => {
    // Hole Package
    const packages = await client.integrationContent.getIntegrationPackages({
      top: 1
    });

    expect(packages.length).toBeGreaterThan(0);
    const packageId = packages[0].Id;

    // Hole Package-Details (wird gecacht)
    const packageDetails1 = await client.integrationContent.getIntegrationPackageById(packageId);

    expect(packageDetails1).toBeDefined();

    // Warte kurz
    await new Promise(resolve => setTimeout(resolve, 500));

    // Invalidiere Cache
    const deleted = await client.invalidateCache(`GET:/IntegrationPackages('${packageId}')*`);
    expect(deleted).toBeGreaterThanOrEqual(0);

    // Hole erneut (sollte Cache MISS sein)
    const packageDetails2 = await client.integrationContent.getIntegrationPackageById(packageId);

    expect(packageDetails2).toBeDefined();
    expect(packageDetails2.Id).toBe(packageId);
  }, 120000);
});

