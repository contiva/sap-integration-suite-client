/**
 * Jest Setup-Datei für E2E-Tests
 * 
 * Diese Datei wird vor jedem Test ausgeführt und prüft die grundlegenden Voraussetzungen.
 * Sie wird in jest.e2e.config.js als setupFilesAfterEnv konfiguriert.
 */

const { checkRequiredEnvVars } = require('./utils/pre-flight-checks');

// Prüfe grundlegende Umgebungsvariablen beim Start
// Detaillierte Checks (SAP, Redis) werden in den einzelnen Tests durchgeführt
try {
  checkRequiredEnvVars();
} catch (error) {
  console.error('\n❌ E2E-Test Setup fehlgeschlagen:');
  console.error(error.message);
  console.error('\nBitte stellen Sie sicher, dass .env.e2e existiert und alle erforderlichen Variablen enthält.\n');
  process.exit(1);
}





