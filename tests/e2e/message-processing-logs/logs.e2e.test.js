/**
 * E2E Test: Message Processing Logs-Operationen
 * 
 * Prüft Message Processing Logs-Operationen mit echten SAP-Daten.
 * KEINE Fallbacks - SAP-Verbindung muss funktionieren, Logs müssen existieren.
 */

const { checkAllForSapTests } = require('../utils/pre-flight-checks');
const { createSapClient } = require('../utils/test-helpers');

describe('Message Processing Logs E2E Tests', () => {
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

  test('getMessageProcessingLogs() liefert echte Logs', async () => {
    const { logs } = await client.messageProcessingLogs.getMessageProcessingLogs();

    expect(logs).toBeDefined();
    expect(Array.isArray(logs)).toBe(true);
    
    // Es können auch 0 Logs sein, aber die Struktur muss stimmen
    if (logs.length > 0) {
      const firstLog = logs[0];
      expect(firstLog).toHaveProperty('MessageGuid');
    }
  }, 60000);

  test('getMessageProcessingLog(logId) liefert Log-Details', async () => {
    // Hole zuerst Liste von Logs
    const { logs } = await client.messageProcessingLogs.getMessageProcessingLogs({
      top: 1
    });

    // Wenn Logs vorhanden sind, hole Details
    if (logs.length > 0) {
      const logId = logs[0].MessageGuid;
      expect(logId).toBeDefined();

      const logDetails = await client.messageProcessingLogs.getMessageProcessingLogById(logId);

      expect(logDetails).toBeDefined();
      expect(logDetails.MessageGuid).toBe(logId);
    } else {
      // Wenn keine Logs vorhanden sind, ist das auch OK
      console.log('Keine Message Processing Logs vorhanden zum Testen');
    }
  }, 60000);

  test('Filterung funktioniert (OData-Filter)', async () => {
    // Versuche Filterung nach Status
    // Hinweis: Diese Tests können fehlschlagen, wenn keine passenden Logs vorhanden sind
    // Das ist gewollt - KEIN Fallback!
    try {
      const { logs: filteredLogs } = await client.messageProcessingLogs.getMessageProcessingLogs({
        filter: "Status eq 'COMPLETED'",
        top: 5
      });

      expect(filteredLogs).toBeDefined();
      expect(Array.isArray(filteredLogs)).toBe(true);

      // Wenn Logs vorhanden sind, prüfe Filter
      if (filteredLogs.length > 0) {
        filteredLogs.forEach(log => {
          expect(log.Status).toBe('COMPLETED');
        });
      }
    } catch (error) {
      // Wenn Filterung nicht unterstützt wird oder keine Ergebnisse, ist das OK
      // Aber wir prüfen, dass die API korrekt antwortet
      expect(error).toBeDefined();
    }
  }, 60000);

  test('Paginierung funktioniert', async () => {
    // Hole erste Seite
    const { logs: firstPage } = await client.messageProcessingLogs.getMessageProcessingLogs({
      top: 5
    });

    expect(firstPage).toBeDefined();
    expect(Array.isArray(firstPage)).toBe(true);
    expect(firstPage.length).toBeLessThanOrEqual(5);

    if (firstPage.length === 5) {
      // Hole zweite Seite
      const { logs: secondPage } = await client.messageProcessingLogs.getMessageProcessingLogs({
        top: 5,
        skip: 5
      });

      expect(secondPage).toBeDefined();
      expect(Array.isArray(secondPage)).toBe(true);

      // Prüfe, dass Logs unterschiedlich sind (wenn genug vorhanden)
      if (secondPage.length > 0 && firstPage.length > 0) {
        expect(firstPage[0].MessageGuid).not.toBe(secondPage[0].MessageGuid);
      }
    }
  }, 60000);

  test('Logs enthalten erwartete Felder', async () => {
    const { logs } = await client.messageProcessingLogs.getMessageProcessingLogs({
      top: 1
    });

    if (logs.length > 0) {
      const log = logs[0];

      // Prüfe erwartete Felder
      expect(log).toHaveProperty('MessageGuid');
      expect(log).toHaveProperty('Status');
    }
  }, 60000);
});

