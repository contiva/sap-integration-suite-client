# End-to-End Tests

Dieses Verzeichnis enthält End-to-End-Tests, die mit echten SAP-Systemen und echten Daten arbeiten. Diese Tests sind explizit getrennt von den normalen Unit- und Integration-Tests.

## Übersicht

E2E-Tests unterscheiden sich von normalen Tests:

- **Normale Tests** (`tests/units/`, `tests/integration/`): Schnell, unabhängig, können Mock-Daten verwenden, werden bei `npm run test` ausgeführt
- **E2E-Tests** (`tests/e2e/`): Arbeiten mit echten SAP-Systemen, benötigen echte Credentials, werden nur explizit über `npm run test:e2e` ausgeführt

## Einrichtung

### 1. Umgebungsvariablen konfigurieren

Kopieren Sie die Beispiel-Datei und füllen Sie sie mit Ihren echten SAP-Credentials:

```bash
cp .env.e2e.example .env.e2e
```

Bearbeiten Sie `.env.e2e` und tragen Sie Ihre SAP-Integration-Suite-Credentials ein:

```env
SAP_BASE_URL=https://your-tenant.integrationsuitetrial-api.eu10.hana.ondemand.com/api/v1
SAP_OAUTH_CLIENT_ID=your-client-id
SAP_OAUTH_CLIENT_SECRET=your-client-secret
SAP_OAUTH_TOKEN_URL=https://your-tenant.authentication.eu10.hana.ondemand.com/oauth/token
REDIS_CONNECTION_STRING=redis://localhost:6379
REDIS_ENABLED=true
```

**Wichtig**: Die `.env.e2e` Datei wird nicht ins Repository committed (siehe `.gitignore`).

### 2. Redis einrichten (optional)

Falls Sie Cache-Tests durchführen möchten, benötigen Sie eine laufende Redis-Instanz:

```bash
# Mit Docker
docker run -d -p 6379:6379 redis:latest

# Oder lokal installieren und starten
redis-server
```

Setzen Sie `REDIS_ENABLED=false` in `.env.e2e`, wenn Sie Redis nicht verwenden möchten.

## Ausführung

### Alle E2E-Tests ausführen

```bash
npm run test:e2e
```

Dieses Script:
1. Baut das Projekt (`npm run build`)
2. Lädt Umgebungsvariablen aus `.env.e2e`
3. Führt alle Tests aus `tests/e2e/` aus

### Watch-Mode für Entwicklung

```bash
npm run test:e2e:watch
```

Führt E2E-Tests im Watch-Mode aus, sodass Tests automatisch neu ausgeführt werden, wenn Dateien geändert werden.

### Verbose-Mode für detailliertes Logging

```bash
npm run test:e2e:verbose
```

Führt E2E-Tests mit detailliertem Logging aus.

## Test-Organisation

E2E-Tests können in Unterverzeichnissen organisiert werden:

- `tests/e2e/cache/` - Tests für Cache-Funktionalität mit echten Daten
- `tests/e2e/integration/` - Tests für Integration-Funktionalität mit echten SAP-Systemen
- `tests/e2e/workflows/` - Tests für komplette Workflows mit echten Daten

## Test-Naming-Konvention

E2E-Tests sollten eine der folgenden Naming-Konventionen verwenden:

- `*.test.js` - Standard Jest-Test-Datei
- `*.e2e.test.js` - Explizit als E2E-Test markiert

Beispiel: `cache-behavior.e2e.test.js`

## Best Practices

### 1. Daten-Isolation

E2E-Tests sollten so geschrieben sein, dass sie:

- **Keine Daten im SAP-System verändern** (nur lesen), oder
- **Daten in einem isolierten Test-Bereich verwenden**, oder
- **Daten nach dem Test wiederherstellen**

### 2. Pre-Flight Checks

Fügen Sie Pre-Flight Checks in Ihren Tests hinzu, um sicherzustellen, dass:

- Alle notwendigen Umgebungsvariablen gesetzt sind
- Die SAP-System-Verbindung funktioniert
- Die Redis-Verbindung funktioniert (falls benötigt)

Beispiel:

```javascript
beforeAll(async () => {
  // Pre-flight checks
  if (!process.env.SAP_BASE_URL) {
    throw new Error('SAP_BASE_URL is not set in .env.e2e');
  }
  // ... weitere Checks
});
```

### 3. Timeouts

E2E-Tests haben längere Timeouts (60 Sekunden) als normale Tests, da sie echte API-Aufrufe durchführen. Wenn ein Test länger dauert, können Sie das Timeout pro Test erhöhen:

```javascript
test('long running test', async () => {
  // ...
}, 120000); // 2 Minuten Timeout
```

### 4. Fehlerbehandlung

E2E-Tests sollten robuste Fehlerbehandlung haben, da externe Systeme nicht immer verfügbar sind:

```javascript
test('api call with retry', async () => {
  let retries = 3;
  while (retries > 0) {
    try {
      const result = await client.someMethod();
      expect(result).toBeDefined();
      break;
    } catch (error) {
      retries--;
      if (retries === 0) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
});
```

### 5. Test-Daten-Dokumentation

Dokumentieren Sie, welche Test-Daten benötigt werden:

```javascript
/**
 * E2E Test für Cache-Verhalten
 * 
 * Benötigte Test-Daten:
 * - Test-Package-ID: Muss in SAP-System existieren
 * - Test-Artifact-ID: Muss in Test-Package existieren
 * 
 * Diese IDs können in .env.e2e konfiguriert werden:
 * - TEST_PACKAGE_ID
 * - TEST_ARTIFACT_ID
 */
```

## Troubleshooting

### Problem: Tests finden keine Umgebungsvariablen

**Lösung**: Stellen Sie sicher, dass:
1. Die `.env.e2e` Datei im Projekt-Root existiert
2. Die Datei die korrekten Variablennamen enthält
3. Die Datei nicht leer ist

### Problem: Verbindungsfehler zu SAP-System

**Lösung**: Überprüfen Sie:
1. `SAP_BASE_URL` ist korrekt
2. `SAP_OAUTH_CLIENT_ID` und `SAP_OAUTH_CLIENT_SECRET` sind gültig
3. `SAP_OAUTH_TOKEN_URL` ist korrekt
4. Das SAP-System ist erreichbar (Netzwerk, Firewall)

### Problem: Redis-Verbindungsfehler

**Lösung**: 
1. Stellen Sie sicher, dass Redis läuft: `redis-cli ping` sollte `PONG` zurückgeben
2. Überprüfen Sie `REDIS_CONNECTION_STRING` in `.env.e2e`
3. Setzen Sie `REDIS_ENABLED=false`, wenn Sie Redis nicht benötigen

### Problem: Tests laufen zu langsam

**Lösung**:
- E2E-Tests sind per Definition langsamer als normale Tests
- Timeouts sind auf 60 Sekunden erhöht
- Für sehr langsame Tests können Sie das Timeout pro Test erhöhen

### Problem: Tests werden bei `npm run test` ausgeführt

**Lösung**: Dies sollte nicht passieren, da E2E-Tests in `jest.config.js` ausgeschlossen sind. Falls doch:
1. Überprüfen Sie, ob die Tests im `tests/e2e/` Verzeichnis sind
2. Überprüfen Sie `jest.config.js` auf `testPathIgnorePatterns: ['/tests/e2e/']`

## CI/CD Integration

E2E-Tests werden standardmäßig **nicht** in CI/CD-Pipelines ausgeführt. Um E2E-Tests in CI/CD zu aktivieren:

1. Fügen Sie die notwendigen Secrets für E2E-Tests hinzu
2. Erstellen Sie einen separaten CI/CD-Job für E2E-Tests
3. Aktivieren Sie den Job nur bei expliziter Anforderung oder in bestimmten Branches

Beispiel für GitHub Actions:

```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests
on:
  workflow_dispatch: # Nur bei manueller Ausführung
jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test:e2e
        env:
          SAP_BASE_URL: ${{ secrets.SAP_BASE_URL }}
          SAP_OAUTH_CLIENT_ID: ${{ secrets.SAP_OAUTH_CLIENT_ID }}
          # ... weitere Secrets
```

## Weitere Informationen

- Siehe [E2E_TEST_PLAN.md](../../E2E_TEST_PLAN.md) für den vollständigen Plan
- Siehe Haupt-[README.md](../../README.md) für allgemeine Projekt-Informationen





