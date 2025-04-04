export class ResponseNormalizer {
    /**
       * Hilfsmethode zur Normalisierung von Array-Antworten von der API
       * 
       * @param {any} data Die API-Antwortdaten
       * @param {string} methodName Name der aufrufenden Methode für Logging
       * @param {string} [specificProperty] Optionale spezifische Property für bestimmte API-Formate
       * @returns {any[]} Normalisiertes Array
       * @private
       */
    public normalizeArrayResponse(data: any, methodName: string, specificProperty?: string): any[] {
        // 1. OData v2 format (d.results)
        if (data?.d?.results && Array.isArray(data.d.results)) {
            return data.d.results;
        }

        // 2. OData v4 format (value array)
        if (data?.value && Array.isArray(data.value)) {
            return data.value;
        }

        // 3. Direkt ein Array (bereits normalisiert)
        if (Array.isArray(data)) {
            return data;
        }

        // 4. Spezifisches Format für bestimmte Endpunkte
        if (specificProperty && data?.[specificProperty] && Array.isArray(data[specificProperty])) {
            return data[specificProperty];
        }

        // Fallback - leeres Array zurückgeben, wenn keine Daten gefunden wurden
        console.warn(`Unbekanntes Antwortformat bei ${methodName}:`,
            typeof data === 'object' ?
                `Objekt mit Keys: [${Object.keys(data || {}).join(', ')}]` :
                typeof data);
        return [];
    }

    /**
     * Hilfsmethode zur Normalisierung von Entitäts-Antworten von der API
     * 
     * @param {any} data Die API-Antwortdaten
     * @param {string} methodName Name der aufrufenden Methode für Logging
     * @returns {any | undefined} Normalisierte Entität oder undefined
     * @private
     */
    public normalizeEntityResponse(data: any, methodName: string): any | undefined {
        // 1. OData Format mit d-Property
        if (data?.d) {
            return data.d;
        }

        // 2. OData v4 Format mit value-Array und nur einem Element
        if (data?.value && Array.isArray(data.value) && data.value.length > 0) {
            return data.value[0];
        }

        // 3. Direkt ein Objekt (bereits normalisiert)
        if (data && typeof data === 'object' && !Array.isArray(data)) {
            return data;
        }

        // Fallback - undefined zurückgeben, wenn keine Daten gefunden wurden
        console.warn(`Unbekanntes Antwortformat bei ${methodName}:`,
            typeof data === 'object' ?
                `Objekt mit Keys: [${Object.keys(data || {}).join(', ')}]` :
                typeof data);
        return undefined;
    }
}
