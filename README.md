# SAP CPI API Client

Eine Bibliothek für die Interaktion mit den SAP Cloud Platform Integration APIs.

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

```bash
npm install sap-cpi-api-client
```

## Konfiguration

Die Bibliothek nutzt Umgebungsvariablen für die Konfiguration. Lege folgende Variablen in deiner .env-Datei fest:

```env
SAP_BASE_URL=https://your-tenant.sap-api.com
SAP_OAUTH_CLIENT_ID=your-client-id
SAP_OAUTH_CLIENT_SECRET=your-client-secret
SAP_OAUTH_TOKEN_URL=https://your-tenant.authentication.sap.hana.ondemand.com/oauth/token
```

## Grundlegende Nutzung

```typescript
// Importiere den SAP Client
import SapClient from 'sap-cpi-api-client';

// Verwende den Client, um API Aufrufe zu tätigen
async function getIntegrationPackages() {
  try {
    const response = await SapClient.integrationContent.integrationPackages.integrationPackagesList();
    console.log(response.data);
  } catch (error) {
    console.error('Fehler beim Abrufen der Integrationspakete:', error);
  }
}
```

## Nutzung mit Express

```typescript
import express from 'express';
import { createIntegrationContentRoutes, createMessageProcessingLogsRoutes } from 'sap-cpi-api-client';

const app = express();

// Füge die vorgefertigten Routen hinzu
app.use('/api/integration-content', createIntegrationContentRoutes());
app.use('/api/message-processing-logs', createMessageProcessingLogsRoutes());

app.listen(3000, () => {
  console.log('Server läuft auf Port 3000');
});
```

### Anpassung des SAP Clients

```typescript
import express from 'express';
import SapClient from 'sap-cpi-api-client';
import { createSecurityContentRoutes } from 'sap-cpi-api-client';

// Client mit benutzerdefinierten Einstellungen
const customSapClient = new SapClient({
  baseUrl: process.env.CUSTOM_SAP_URL,
  // Weitere Optionen...
});

const app = express();

// Übergebe den benutzerdefinierten Client an die Router
app.use('/api/security-content', createSecurityContentRoutes({ 
  customSapClient 
}));

app.listen(3000);
```

## Verfügbare API Endpunkte

Die Bibliothek bietet Zugriff auf folgende SAP API-Gruppen:

- **Integration Content**: Pakete, Flows, Artefakte
- **Message Processing Logs**: Verarbeitungsprotokolle, Fehlerinformationen
- **Message Store**: Nachrichtenspeicher, Anhänge
- **Security Content**: Anmeldeinformationen, Zertifikate, Zugriffspolitiken
- **Log Files**: Protokolldateien

## Typsicherheit

Alle API-Antworten sind vollständig typisiert, basierend auf der SAP API-Dokumentation:

```typescript
import { IntegrationContentTypes } from 'sap-cpi-api-client';

// Typsichere Verwendung von Antwortdaten
const packages: IntegrationContentTypes.ComSapHciApiIntegrationPackage[] = 
  response.data.d.results;
```

## Hilfsutilities

Die Bibliothek enthält nützliche Hilfsfunktionen:

```typescript
import { formatSapTimestampsInObject, Logger } from 'sap-cpi-api-client';

// Formatieren von SAP-Zeitstempeln
const formattedData = formatSapTimestampsInObject(response.data);

// Logging
Logger.info('Operation erfolgreich');
```

## Lizenz

MIT 