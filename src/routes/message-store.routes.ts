import { Router, Request, Response, NextFunction } from 'express';
import sapClient from '../clients/sap-client';
import logger from '../utils/logger';
import { formatSapTimestampsInObject } from '../utils/date-formatter';

/**
 * Erstellt einen Router für Message Store Endpunkte
 * @param options Optionale Konfiguration
 * @returns Express Router mit Message Store Routes
 */
export function createMessageStoreRoutes(options: { customSapClient?: any } = {}) {
  const router = Router();
  const client = options.customSapClient || sapClient;

  // Get message store entries by message GUID
  router.get('/message-processing-logs/:messageGuid/entries', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const { messageGuid } = req.params;
        
        const response = await client.messageStore.messageProcessingLogsMessageGuid.messageStoreEntriesList(messageGuid);
        // Format timestamps in the response
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error(`Error fetching message store entries for message ${req.params.messageGuid}:`, error);
        res.status(500).json({ error: `Failed to fetch message store entries for message ${req.params.messageGuid}` });
      }
    })();
  });

  // Get message store entry by ID
  router.get('/entries/:messageStoreEntryId', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const { messageStoreEntryId } = req.params;
        
        const response = await client.messageStore.messageStoreEntriesMessageStoreEntryId.messageStoreEntriesList(messageStoreEntryId);
        // Format timestamps in the response
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error(`Error fetching message store entry ${req.params.messageStoreEntryId}:`, error);
        res.status(500).json({ error: `Failed to fetch message store entry ${req.params.messageStoreEntryId}` });
      }
    })();
  });

  // Get message payload from message store by entry ID
  router.get('/entries/:messageStoreEntryId/payload', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const { messageStoreEntryId } = req.params;
        
        const response = await client.messageStore.messageStoreEntriesMessageStoreEntryId.valueList(messageStoreEntryId);
        res.send(response.data);
      } catch (error) {
        logger.error(`Error fetching message payload for entry ${req.params.messageStoreEntryId}:`, error);
        res.status(500).json({ error: `Failed to fetch message payload for entry ${req.params.messageStoreEntryId}` });
      }
    })();
  });

  // Get attachments from message store by entry ID
  router.get('/entries/:messageStoreEntryId/attachments', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const { messageStoreEntryId } = req.params;
        
        const response = await client.messageStore.messageStoreEntriesMessageStoreEntryId.attachmentsList(messageStoreEntryId);
        // Format timestamps in the response
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error(`Error fetching attachments for message store entry ${req.params.messageStoreEntryId}:`, error);
        res.status(500).json({ error: `Failed to fetch attachments for message store entry ${req.params.messageStoreEntryId}` });
      }
    })();
  });

  // Get properties of message store entry by ID
  router.get('/entries/:messageStoreEntryId/properties', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const { messageStoreEntryId } = req.params;
        
        const response = await client.messageStore.messageStoreEntriesMessageStoreEntryId.propertiesList(messageStoreEntryId);
        // Format timestamps in the response
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error(`Error fetching properties for message store entry ${req.params.messageStoreEntryId}:`, error);
        res.status(500).json({ error: `Failed to fetch properties for message store entry ${req.params.messageStoreEntryId}` });
      }
    })();
  });

  // Get attachment by ID
  router.get('/attachments/:attachmentId', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const { attachmentId } = req.params;
        
        const response = await client.messageStore.messageStoreEntryAttachmentsMessageStoreEntryAttachmentId.messageStoreEntryAttachmentsList(attachmentId);
        // Format timestamps in the response
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error(`Error fetching attachment ${req.params.attachmentId}:`, error);
        res.status(500).json({ error: `Failed to fetch attachment ${req.params.attachmentId}` });
      }
    })();
  });

  // Get attachment content by ID
  router.get('/attachments/:attachmentId/content', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const { attachmentId } = req.params;
        
        const response = await client.messageStore.messageStoreEntryAttachmentsMessageStoreEntryAttachmentId.valueList(attachmentId);
        res.send(response.data);
      } catch (error) {
        logger.error(`Error fetching attachment content for ${req.params.attachmentId}:`, error);
        res.status(500).json({ error: `Failed to fetch attachment content for ${req.params.attachmentId}` });
      }
    })();
  });

  // Get attachment properties by ID
  router.get('/attachments/:attachmentId/properties', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const { attachmentId } = req.params;
        
        const response = await client.messageStore.messageStoreEntryAttachmentsMessageStoreEntryAttachmentId.propertiesList(attachmentId);
        // Format timestamps in the response
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error(`Error fetching properties for attachment ${req.params.attachmentId}:`, error);
        res.status(500).json({ error: `Failed to fetch properties for attachment ${req.params.attachmentId}` });
      }
    })();
  });

  // Get JMS broker resources
  router.get('/jms-brokers', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const query = req.query as any;
        
        const response = await client.messageStore.jmsBrokersBroker1.jmsBrokersBroker1List();
        // Format timestamps in the response
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error('Error fetching JMS broker resources:', error);
        res.status(500).json({ error: 'Failed to fetch JMS broker resources' });
      }
    })();
  });

  return router;
}

// Export default Router für Abwärtskompatibilität
export default createMessageStoreRoutes(); 