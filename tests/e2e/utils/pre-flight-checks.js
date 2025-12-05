/**
 * Pre-Flight Checks für E2E-Tests
 * 
 * Diese Funktionen prüfen, ob alle notwendigen Voraussetzungen für E2E-Tests erfüllt sind.
 * Sie werfen Fehler, wenn etwas fehlt - KEINE Fallbacks!
 */

const SapClient = require('../../../dist/clients/sap-client').default;
const { CacheManager } = require('../../../dist/core/cache-manager');

/**
 * Prüft alle erforderlichen Umgebungsvariablen
 * Wirft einen Fehler, wenn eine Variable fehlt
 * 
 * @throws {Error} Wenn eine erforderliche Umgebungsvariable fehlt
 */
function checkRequiredEnvVars() {
  const requiredVars = [
    'SAP_BASE_URL',
    'SAP_OAUTH_CLIENT_ID',
    'SAP_OAUTH_CLIENT_SECRET',
    'SAP_OAUTH_TOKEN_URL'
  ];

  const missing = [];

  for (const varName of requiredVars) {
    if (!process.env[varName] || process.env[varName].trim() === '') {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Fehlende erforderliche Umgebungsvariablen: ${missing.join(', ')}\n` +
      `Bitte stellen Sie sicher, dass .env.e2e existiert und alle Variablen enthält.`
    );
  }
}

/**
 * Prüft Redis-Verbindung
 * Wirft einen Fehler, wenn Redis nicht verfügbar ist
 * 
 * @throws {Error} Wenn Redis nicht verfügbar ist oder Verbindung fehlschlägt
 */
async function checkRedisConnection() {
  const redisConnectionString = process.env.REDIS_CONNECTION_STRING;
  const redisEnabled = process.env.REDIS_ENABLED === 'true';

  if (!redisEnabled) {
    throw new Error(
      'REDIS_ENABLED ist nicht auf "true" gesetzt.\n' +
      'E2E-Tests erfordern eine funktionierende Redis-Verbindung.'
    );
  }

  if (!redisConnectionString || redisConnectionString.trim() === '') {
    throw new Error(
      'REDIS_CONNECTION_STRING ist nicht gesetzt oder leer.\n' +
      'Bitte stellen Sie sicher, dass .env.e2e eine gültige Redis-Verbindungszeichenkette enthält.'
    );
  }

  // Versuche Verbindung herzustellen
  const cacheManager = new CacheManager(redisConnectionString, true);
  
  try {
    await cacheManager.connect();
    
    if (!cacheManager.isReady()) {
      await cacheManager.close();
      throw new Error('Redis-Verbindung konnte nicht hergestellt werden. isReady() gibt false zurück.');
    }

    // Teste eine einfache Operation
    const testKey = 'e2e-test-connection-check';
    const testData = { test: true, timestamp: Date.now() };
    
    await cacheManager.set(testKey, testData, { ttl: 10, revalidateAfter: 5 });
    const retrieved = await cacheManager.get(testKey);
    
    if (!retrieved || !retrieved.data || retrieved.data.test !== true) {
      await cacheManager.close();
      throw new Error('Redis-Verbindung funktioniert nicht korrekt. Get/Set-Operation fehlgeschlagen.');
    }

    // Aufräumen
    await cacheManager.delete(testKey);
    await cacheManager.close();
  } catch (error) {
    try {
      await cacheManager.close();
    } catch (closeError) {
      // Ignorieren
    }
    
    if (error.message.includes('Redis') || error.message.includes('connection')) {
      throw error;
    }
    
    throw new Error(
      `Redis-Verbindung fehlgeschlagen: ${error.message}\n` +
      `Bitte überprüfen Sie REDIS_CONNECTION_STRING und stellen Sie sicher, dass Redis läuft.`
    );
  }
}

/**
 * Prüft SAP-Verbindung
 * Wirft einen Fehler, wenn SAP nicht verfügbar ist
 * 
 * @throws {Error} Wenn SAP-Verbindung fehlschlägt oder OAuth-Token nicht abgerufen werden kann
 */
async function checkSapConnection() {
  checkRequiredEnvVars();

  const client = new SapClient({
    baseUrl: process.env.SAP_BASE_URL,
    oauthClientId: process.env.SAP_OAUTH_CLIENT_ID,
    oauthClientSecret: process.env.SAP_OAUTH_CLIENT_SECRET,
    oauthTokenUrl: process.env.SAP_OAUTH_TOKEN_URL,
    noCache: true // Kein Cache für Verbindungsprüfung
  });

  try {
    // Versuche ein einfaches API-Call, um die Verbindung zu prüfen
    // Wir verwenden getIntegrationPackages, da dies eine einfache GET-Anfrage ist
    await client.integrationContent.getIntegrationPackages({
      top: 1
    });
    
    await client.disconnect();
  } catch (error) {
    try {
      await client.disconnect();
    } catch (disconnectError) {
      // Ignorieren
    }
    
    throw new Error(
      `SAP-Verbindung fehlgeschlagen: ${error.message}\n` +
      `Bitte überprüfen Sie:\n` +
      `- SAP_BASE_URL ist korrekt\n` +
      `- SAP_OAUTH_CLIENT_ID und SAP_OAUTH_CLIENT_SECRET sind gültig\n` +
      `- SAP_OAUTH_TOKEN_URL ist korrekt\n` +
      `- Das SAP-System ist erreichbar`
    );
  }
}

/**
 * Prüft alle Voraussetzungen für Cache-Tests
 * Kombiniert Umgebungsvariablen, Redis und SAP Checks
 * 
 * @throws {Error} Wenn eine Voraussetzung nicht erfüllt ist
 */
async function checkAllForCacheTests() {
  checkRequiredEnvVars();
  await checkRedisConnection();
  await checkSapConnection();
}

/**
 * Prüft alle Voraussetzungen für SAP-Tests (ohne Redis)
 * 
 * @throws {Error} Wenn eine Voraussetzung nicht erfüllt ist
 */
async function checkAllForSapTests() {
  checkRequiredEnvVars();
  await checkSapConnection();
}

/**
 * Prüft, ob Test-Daten verfügbar sind
 * 
 * @param {string[]} requiredTestData - Array von erforderlichen Test-Daten-Keys
 * @throws {Error} Wenn Test-Daten fehlen
 */
function checkTestData(requiredTestData = []) {
  const missing = [];

  for (const key of requiredTestData) {
    if (!process.env[key] || process.env[key].trim() === '') {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Fehlende Test-Daten in .env.e2e: ${missing.join(', ')}\n` +
      `Bitte stellen Sie sicher, dass alle erforderlichen Test-Daten in .env.e2e konfiguriert sind.`
    );
  }
}

module.exports = {
  checkRequiredEnvVars,
  checkRedisConnection,
  checkSapConnection,
  checkAllForCacheTests,
  checkAllForSapTests,
  checkTestData
};

