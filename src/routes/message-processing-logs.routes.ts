import { Router, Request, Response, NextFunction } from 'express';
import { defaultClient } from '../index';
import logger from '../utils/logger';
import { formatSapTimestampsInObject } from '../utils/date-formatter';

/**
 * Erstellt einen Router für Message Processing Logs Endpunkte
 * @param options Optionale Konfiguration
 * @returns Express Router mit Message Processing Logs Routes
 */
export function createMessageProcessingLogsRoutes(options: { customSapClient?: any } = {}) {
  const router = Router();
  const client = options.customSapClient || defaultClient;

  // Get all message processing logs
  router.get('/', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        // Extract query parameters
        const { $top, $skip, $filter, $orderby, $select, $inlinecount } = req.query;
        
        const query: any = {};
        if ($top) query.$top = Number($top);
        if ($skip) query.$skip = Number($skip);
        if ($filter) query.$filter = $filter as string;
        if ($orderby) query.$orderby = [$orderby as string];
        if ($select) query.$select = [$select as string];
        if ($inlinecount) query.$inlinecount = [$inlinecount as string];
        
        const response = await client.messageProcessingLogs.messageProcessingLogs.messageProcessingLogsList(query);
        // Formatiere die Zeitstempel in der Antwort
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error('Error fetching message processing logs:', error);
        res.status(500).json({ error: 'Failed to fetch message processing logs' });
      }
    })();
  });

  // Get message processing log by message GUID
  router.get('/:messageGuid', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const { messageGuid } = req.params;
        const { $select, $expand } = req.query;
        
        const query: any = {};
        if ($select) query.$select = [$select as string];
        if ($expand) query.$expand = [$expand as string];
        
        const response = await client.messageProcessingLogs.messageProcessingLogsMessageGuid.messageProcessingLogsList(messageGuid, query);
        // Formatiere die Zeitstempel in der Antwort
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error(`Error fetching message processing log ${req.params.messageGuid}:`, error);
        res.status(500).json({ error: `Failed to fetch message processing log ${req.params.messageGuid}` });
      }
    })();
  });

  // Get adapter attributes for a message processing log
  router.get('/:messageGuid/adapter-attributes', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const { messageGuid } = req.params;
        const { $select } = req.query;
        
        const query: any = {};
        if ($select) query.$select = [$select as string];
        
        const response = await client.messageProcessingLogs.messageProcessingLogsMessageGuid.adapterAttributesList(messageGuid, query);
        // Formatiere die Zeitstempel in der Antwort
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error(`Error fetching adapter attributes for message ${req.params.messageGuid}:`, error);
        res.status(500).json({ error: `Failed to fetch adapter attributes for message ${req.params.messageGuid}` });
      }
    })();
  });

  // Get attachments for a message processing log
  router.get('/:messageGuid/attachments', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const { messageGuid } = req.params;
        const response = await client.messageProcessingLogs.messageProcessingLogsMessageGuid.attachmentsList(messageGuid);
        // Formatiere die Zeitstempel in der Antwort
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error(`Error fetching attachments for message ${req.params.messageGuid}:`, error);
        res.status(500).json({ error: `Failed to fetch attachments for message ${req.params.messageGuid}` });
      }
    })();
  });

  // Get error information for a message processing log
  router.get('/:messageGuid/error-information', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const { messageGuid } = req.params;
        const response = await client.messageProcessingLogs.messageProcessingLogsMessageGuid.errorInformationList(messageGuid);
        // Formatiere die Zeitstempel in der Antwort
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error(`Error fetching error information for message ${req.params.messageGuid}:`, error);
        res.status(500).json({ error: `Failed to fetch error information for message ${req.params.messageGuid}` });
      }
    })();
  });

  // Get error details text for a message processing log
  router.get('/:messageGuid/error-details', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const { messageGuid } = req.params;
        const response = await client.messageProcessingLogs.messageProcessingLogsMessageGuid.errorInformationValueList(messageGuid);
        res.send(response.data);
      } catch (error) {
        logger.error(`Error fetching error details for message ${req.params.messageGuid}:`, error);
        res.status(500).json({ error: `Failed to fetch error details for message ${req.params.messageGuid}` });
      }
    })();
  });

  return router;
}

// Export default Router für Abwärtskompatibilität
export default createMessageProcessingLogsRoutes(); 