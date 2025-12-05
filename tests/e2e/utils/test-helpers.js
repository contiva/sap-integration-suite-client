/**
 * Test-Helper-Funktionen für E2E-Tests
 * 
 * Wiederverwendbare Funktionen für E2E-Tests
 */

const SapClient = require('../../../dist/clients/sap-client').default;
const { CacheManager } = require('../../../dist/core/cache-manager');

/**
 * Erstellt einen neuen SapClient mit Konfiguration aus Umgebungsvariablen
 * 
 * @param {Object} options - Optionale Konfiguration
 * @param {boolean} options.enableCache - Cache aktivieren (Standard: true)
 * @param {CacheManager} options.cacheManager - Externer CacheManager (optional)
 * @returns {SapClient} Konfigurierter SapClient
 */
function createSapClient(options = {}) {
  const {
    enableCache = true,
    cacheManager = null
  } = options;

  const config = {
    baseUrl: process.env.SAP_BASE_URL,
    oauthClientId: process.env.SAP_OAUTH_CLIENT_ID,
    oauthClientSecret: process.env.SAP_OAUTH_CLIENT_SECRET,
    oauthTokenUrl: process.env.SAP_OAUTH_TOKEN_URL,
    redisConnectionString: process.env.REDIS_CONNECTION_STRING,
    redisEnabled: enableCache && process.env.REDIS_ENABLED === 'true',
    noCache: !enableCache,
    cacheManager: cacheManager
  };

  return new SapClient(config);
}

/**
 * Erstellt einen neuen CacheManager mit Konfiguration aus Umgebungsvariablen
 * 
 * @returns {CacheManager} Konfigurierter CacheManager
 */
function createCacheManager() {
  const redisConnectionString = process.env.REDIS_CONNECTION_STRING;
  const redisEnabled = process.env.REDIS_ENABLED === 'true';

  if (!redisEnabled || !redisConnectionString) {
    throw new Error('Redis ist nicht konfiguriert. REDIS_ENABLED muss "true" sein und REDIS_CONNECTION_STRING muss gesetzt sein.');
  }

  return new CacheManager(redisConnectionString, true, process.env.SAP_OAUTH_CLIENT_SECRET);
}

/**
 * Wartet eine bestimmte Zeit (für Revalidation-Tests)
 * 
 * @param {number} ms - Millisekunden zu warten
 * @returns {Promise<void>}
 */
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generiert einen eindeutigen Test-Key
 * 
 * @param {string} prefix - Präfix für den Key
 * @returns {string} Eindeutiger Test-Key
 */
function generateTestKey(prefix = 'e2e-test') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

/**
 * Räumt alle Test-Keys aus dem Cache auf
 * 
 * @param {CacheManager} cacheManager - CacheManager-Instanz
 * @param {string} pattern - Pattern für zu löschende Keys (Standard: 'e2e-test-*')
 * @returns {Promise<number>} Anzahl gelöschter Keys
 */
async function cleanupTestKeys(cacheManager, pattern = 'e2e-test-*') {
  if (!cacheManager || !cacheManager.isReady()) {
    return 0;
  }

  try {
    // Finde alle Test-Keys
    const keys = await cacheManager.findKeysByPattern(pattern);
    
    if (keys.length === 0) {
      return 0;
    }

    // Lösche alle Test-Keys
    return await cacheManager.batchDelete(keys);
  } catch (error) {
    console.warn(`Fehler beim Aufräumen von Test-Keys: ${error.message}`);
    return 0;
  }
}

/**
 * Prüft, ob ein Objekt die erwarteten Eigenschaften hat
 * 
 * @param {Object} obj - Zu prüfendes Objekt
 * @param {string[]} requiredProps - Array von erforderlichen Eigenschaften
 * @returns {boolean} true wenn alle Eigenschaften vorhanden sind
 */
function hasRequiredProperties(obj, requiredProps) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  return requiredProps.every(prop => {
    const keys = prop.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current === null || current === undefined || !(key in current)) {
        return false;
      }
      current = current[key];
    }
    
    return current !== null && current !== undefined;
  });
}

module.exports = {
  createSapClient,
  createCacheManager,
  wait,
  generateTestKey,
  cleanupTestKeys,
  hasRequiredProperties
};





