/**
 * Konvertiert einen SAP-Zeitstempel in ein lesbares Datumsformat
 * @param timestamp SAP-Zeitstempel als String oder Zahl (Millisekunden seit Epoch)
 * @returns Formatiertes Datum als String, oder den Original-Wert, wenn keine gültige Konvertierung möglich ist
 */
export function formatSapTimestamp(timestamp: string | number | null | undefined): string {
  if (!timestamp) return '';
  
  try {
    // Konvertiere String zu Number, falls nötig
    const timestampNum = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
    
    // Prüfe, ob der Wert eine gültige Zahl ist
    if (isNaN(timestampNum)) return String(timestamp);
    
    // Erstelle ein Date-Objekt
    const date = new Date(timestampNum);
    
    // Prüfe, ob das Datum gültig ist
    if (isNaN(date.getTime())) return String(timestamp);
    
    // Formatiere das Datum als ISO-String mit lokaler Zeitzone
    return date.toLocaleString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch (error) {
    // Bei Fehler gib den ursprünglichen Wert zurück
    return String(timestamp);
  }
}

/**
 * Rekursives Durchlaufen eines Objekts und Anwenden des Formatters auf Zeitstempel-Felder
 * @param obj Das zu verarbeitende Objekt
 * @returns Das verarbeitete Objekt mit formatierten Zeitstempeln
 */
export function formatSapTimestampsInObject(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  
  // Arrays rekursiv durchlaufen
  if (Array.isArray(obj)) {
    return obj.map(item => formatSapTimestampsInObject(item));
  }
  
  // Neues Objekt für die formatierte Ausgabe
  const formattedObj: any = {};
  
  for (const key in obj) {
    // Prüfe, ob der Schlüssel ein Zeitstempel sein könnte
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Rekursiver Aufruf für verschachtelte Objekte
      formattedObj[key] = formatSapTimestampsInObject(obj[key]);
    } else if (
      typeof obj[key] === 'string' || 
      typeof obj[key] === 'number'
    ) {
      // Prüfe, ob der Schlüssel ein Zeitstempel sein könnte
      if (
        key.toLowerCase().includes('date') || 
        key.toLowerCase().includes('time') ||
        key === 'CreationDate' ||
        key === 'ModifiedDate' ||
        key === 'LastUpdated' ||
        key === 'DeployedOn' ||
        key === 'LogStart' ||
        key === 'LogEnd'
      ) {
        formattedObj[key] = formatSapTimestamp(obj[key]);
      } else {
        formattedObj[key] = obj[key];
      }
    } else {
      formattedObj[key] = obj[key];
    }
  }
  
  return formattedObj;
} 