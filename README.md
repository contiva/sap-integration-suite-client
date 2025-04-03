# SAP Middleware API

Eine Node.js Express Middleware für SAP Cloud Integration APIs mit OAuth-Authentifizierung.

## Features

- Vereinheitlichter Client für SAP Cloud Integration APIs mit OAuth-Authentifizierung
- Typsichere Schnittstellen mit TypeScript
- RESTful API-Endpunkte für:
  - Integration Content Management
  - Message Processing Logs
  - Log Files
- Fehlerbehandlung und Logging
- Rate Limiting und Sicherheits-Middleware

## Voraussetzungen

- Node.js (v16 oder höher)
- SAP Cloud Integration Tenant mit API-Zugriff
- OAuth-Zugangsdaten (Client ID, Client Secret und Token URL)

## Installation

1. Repository klonen
2. Abhängigkeiten installieren:

```bash
npm install
```

3. Eine `.env`-Datei mit Ihrer SAP-Konfiguration erstellen:

```
PORT=3000
NODE_ENV=development

# SAP API Connection (OAuth)
SAP_BASE_URL=https://contiva-cis-dev.it-cpi024.cfapps.eu10-002.hana.ondemand.com/api/v1
SAP_OAUTH_CLIENT_ID=sb-a2b6f591-f015-49b5-824c-f1fc3013766d!b368029|it!b182722
SAP_OAUTH_CLIENT_SECRET=47173692-fa52-4f7e-a2a8-e9bb4e477f73$fUHp-UmQOlejKWOMYH336TXoD64G5zn3LlHoScFk16o=
SAP_OAUTH_TOKEN_URL=https://contiva-cis-dev.authentication.eu10.hana.ondemand.com/oauth/token

# Optional: Logging
LOG_LEVEL=info
```

4. Projekt bauen:

```bash
npm run build
```

## Verwendung

### Entwicklungsmodus

```bash
npm run dev
```

### Produktionsmodus

```bash
npm start
```

## API-Endpunkte

### Integration Content API

- `GET /api/integration-content/packages` - Alle Integrationspakete abrufen
- `GET /api/integration-content/packages/:id` - Integrationspaket nach ID abrufen
- `GET /api/integration-content/packages/:id/flows` - Integrationsflows für ein Paket abrufen
- `GET /api/integration-content/flows/:id/versions/:version` - Integrationsflow nach ID und Version abrufen
- `POST /api/integration-content/flows/:id/versions/:version/deploy` - Integrationsflow deployen
- `GET /api/integration-content/endpoints` - Service-Endpunkte abrufen

### Message Processing Logs API

- `GET /api/message-processing-logs` - Alle Message Processing Logs abrufen
- `GET /api/message-processing-logs/:messageGuid` - Message Processing Log nach Message GUID abrufen
- `GET /api/message-processing-logs/:messageGuid/adapter-attributes` - Adapter-Attribute für ein Message Processing Log abrufen
- `GET /api/message-processing-logs/:messageGuid/attachments` - Anhänge für ein Message Processing Log abrufen
- `GET /api/message-processing-logs/:messageGuid/error-information` - Fehlerinformationen für ein Message Processing Log abrufen
- `GET /api/message-processing-logs/:messageGuid/error-details` - Fehlerdetails-Text für ein Message Processing Log abrufen

### Log Files API

- `GET /api/log-files/archives` - Alle Log-Datei-Archive abrufen
- `GET /api/log-files/archives/:scope/:logFileType` - Log-Datei-Archiv nach Scope und Typ abrufen
- `GET /api/log-files/archives/:scope/:logFileType/download` - Log-Datei-Archiv herunterladen
- `GET /api/log-files/files` - Alle Log-Dateien abrufen
- `GET /api/log-files/files/:name/:application` - Log-Datei nach Name und Anwendung abrufen
- `GET /api/log-files/files/:name/:application/download` - Log-Datei herunterladen

## Query-Parameter

Viele Endpunkte unterstützen OData-Query-Parameter:

- `$top` - Anzahl der Ergebnisse begrenzen
- `$skip` - Anzahl der Ergebnisse überspringen
- `$filter` - Ergebnisse filtern
- `$orderby` - Ergebnisse sortieren
- `$select` - Bestimmte Felder auswählen
- `$expand` - Verwandte Entitäten erweitern
- `$inlinecount` - Anzahl in die Antwort einschließen

Beispiel: `/api/message-processing-logs?$top=10&$filter=Status eq 'FAILED'`

## Fehlerbehandlung

Alle Endpunkte geben standardmäßige HTTP-Statuscodes zurück:

- `200 OK` - Erfolg
- `400 Bad Request` - Ungültige Parameter
- `401 Unauthorized` - Fehlende oder ungültige Authentifizierung
- `404 Not Found` - Ressource nicht gefunden
- `500 Internal Server Error` - Serverfehler

Fehlerantworten enthalten ein JSON-Objekt mit einem `error`-Feld.

## OAuth-Authentifizierung

Der SAP-Client verwendet OAuth-Authentifizierung mit Client Credentials. Das Token wird automatisch abgerufen und erneuert, wenn es abläuft. Die OAuth-Konfiguration wird aus der `.env`-Datei gelesen.

## Lizenz

MIT 