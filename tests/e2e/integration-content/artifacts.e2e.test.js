/**
 * E2E Test: Integration Artifact-Operationen
 * 
 * Prüft Integration Artifact-Operationen mit echten SAP-Daten.
 * KEINE Fallbacks - SAP-Verbindung muss funktionieren, Artifacts müssen existieren.
 */

const { checkAllForSapTests, checkTestData } = require('../utils/pre-flight-checks');
const { createSapClient } = require('../utils/test-helpers');

describe('Integration Artifacts E2E Tests', () => {
  let client;

  beforeAll(async () => {
    // Pre-Flight Check
    await checkAllForSapTests();

    client = createSapClient({ enableCache: false });
  });

  afterAll(async () => {
    if (client) {
      await client.disconnect();
    }
  });

  test('getIntegrationRuntimeArtifacts() liefert echte Artifacts', async () => {
    const artifacts = await client.integrationContent.getDeployedArtifacts();

    expect(artifacts).toBeDefined();
    expect(Array.isArray(artifacts)).toBe(true);
    expect(artifacts.length).toBeGreaterThan(0);

    // Prüfe Struktur
    const firstArtifact = artifacts[0];
    expect(firstArtifact).toHaveProperty('Id');
    expect(firstArtifact).toHaveProperty('Name');
  }, 60000);

  test('getIntegrationRuntimeArtifact(artifactId) liefert Artifact-Details', async () => {
    // Hole zuerst Liste von Artifacts
    const artifacts = await client.integrationContent.getDeployedArtifacts({
      top: 1
    });

    expect(artifacts.length).toBeGreaterThan(0);

    const artifactId = artifacts[0].Id;
    expect(artifactId).toBeDefined();

    // Hole Artifact-Details
    const artifactDetails = await client.integrationContent.getDeployedArtifactById(artifactId);

    expect(artifactDetails).toBeDefined();
    expect(artifactDetails.Id).toBe(artifactId);
    expect(artifactDetails).toHaveProperty('Name');
  }, 60000);

  test('getIntegrationDesigntimeArtifacts(packageId) liefert Design-Time Artifacts', async () => {
    // Hole zuerst ein Package
    const packages = await client.integrationContent.getIntegrationPackages({
      top: 1
    });

    expect(packages.length).toBeGreaterThan(0);

    const packageId = packages[0].Id;
    expect(packageId).toBeDefined();

    // Hole Design-Time Artifacts für dieses Package
    const designtimeArtifacts = await client.integrationContent.getIntegrationFlows(packageId);

    expect(designtimeArtifacts).toBeDefined();
    expect(Array.isArray(designtimeArtifacts)).toBe(true);

    // Es können auch 0 Artifacts sein, aber die Struktur muss stimmen
    if (designtimeArtifacts.length > 0) {
      const firstArtifact = designtimeArtifacts[0];
      expect(firstArtifact).toHaveProperty('Id');
    }
  }, 60000);

  test('getIntegrationDesigntimeArtifact(packageId, artifactId) liefert Artifact-Details', async () => {
    // Hole zuerst ein Package
    const packages = await client.integrationContent.getIntegrationPackages({
      top: 1
    });

    expect(packages.length).toBeGreaterThan(0);

    const packageId = packages[0].Id;

    // Hole Design-Time Artifacts
    const designtimeArtifacts = await client.integrationContent.getIntegrationFlows(packageId);

    // Wenn Artifacts vorhanden sind, hole Details
    if (designtimeArtifacts.length > 0) {
      const artifactId = designtimeArtifacts[0].Id;
      expect(artifactId).toBeDefined();

      const artifactDetails = await client.integrationContent.getIntegrationFlowById(artifactId);

      expect(artifactDetails).toBeDefined();
      expect(artifactDetails.Id).toBe(artifactId);
    } else {
      // Wenn keine Artifacts vorhanden sind, ist das auch OK
      // Aber wir dokumentieren es
      console.log(`Package ${packageId} hat keine Design-Time Artifacts`);
    }
  }, 60000);

  test('Runtime Artifacts enthalten erwartete Felder', async () => {
    const artifacts = await client.integrationContent.getDeployedArtifacts({
      top: 1
    });

    expect(artifacts.length).toBeGreaterThan(0);

    const artifact = artifacts[0];

    // Prüfe erwartete Felder
    expect(artifact).toHaveProperty('Id');
    expect(artifact).toHaveProperty('Name');
  }, 60000);

  test('Design-Time Artifacts enthalten erwartete Felder', async () => {
    // Hole Package
    const packages = await client.integrationContent.getIntegrationPackages({
      top: 1
    });

    expect(packages.length).toBeGreaterThan(0);

    const packageId = packages[0].Id;
    const designtimeArtifacts = await client.integrationContent.getIntegrationFlows(packageId);

    expect(designtimeArtifacts).toBeDefined();
    expect(Array.isArray(designtimeArtifacts)).toBe(true);

    if (designtimeArtifacts.length > 0) {
      const artifact = designtimeArtifacts[0];
      expect(artifact).toHaveProperty('Id');
    }
  }, 60000);
});

