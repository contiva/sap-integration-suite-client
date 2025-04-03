import { Router, Request, Response } from 'express';
import sapClient from '../clients/sap-client';
import logger from '../utils/logger';
import { formatSapTimestampsInObject } from '../utils/date-formatter';

const router = Router();

// Get all message store entries
router.get('/entries', async (req: Request, res: Response) => {
  try {
    // Die spezifische Methode muss je nach tatsächlicher API-Implementierung angepasst werden
    // Dies ist eine Platzhalter-Implementierung, die angepasst werden muss
    const response = await sapClient.messageStore.getMessageStoreEntries();
    const formattedData = formatSapTimestampsInObject(response.data);
    res.json(formattedData);
  } catch (error) {
    logger.error('Error fetching message store entries:', error);
    res.status(500).json({ error: 'Failed to fetch message store entries' });
  }
});

// Get message store entry by ID
router.get('/entries/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Die spezifische Methode muss je nach tatsächlicher API-Implementierung angepasst werden
    const response = await sapClient.messageStore.getMessageStoreEntryById(id);
    const formattedData = formatSapTimestampsInObject(response.data);
    res.json(formattedData);
  } catch (error) {
    logger.error(`Error fetching message store entry ${req.params.id}:`, error);
    res.status(500).json({ error: `Failed to fetch message store entry ${req.params.id}` });
  }
});

// Get message store entry attachments
router.get('/entries/:id/attachments', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Die spezifische Methode muss je nach tatsächlicher API-Implementierung angepasst werden
    const response = await sapClient.messageStore.getMessageStoreEntryAttachments(id);
    const formattedData = formatSapTimestampsInObject(response.data);
    res.json(formattedData);
  } catch (error) {
    logger.error(`Error fetching attachments for message store entry ${req.params.id}:`, error);
    res.status(500).json({ error: `Failed to fetch attachments for message store entry ${req.params.id}` });
  }
});

// Get message store entry attachment
router.get('/entries/:id/attachments/:attachmentId', async (req: Request, res: Response) => {
  try {
    const { id, attachmentId } = req.params;
    // Die spezifische Methode muss je nach tatsächlicher API-Implementierung angepasst werden
    const response = await sapClient.messageStore.getMessageStoreEntryAttachment(id, attachmentId);
    const formattedData = formatSapTimestampsInObject(response.data);
    res.json(formattedData);
  } catch (error) {
    logger.error(`Error fetching attachment ${req.params.attachmentId} for message store entry ${req.params.id}:`, error);
    res.status(500).json({ error: `Failed to fetch attachment ${req.params.attachmentId} for message store entry ${req.params.id}` });
  }
});

// Download message store entry attachment content
router.get('/entries/:id/attachments/:attachmentId/content', async (req: Request, res: Response) => {
  try {
    const { id, attachmentId } = req.params;
    // Die spezifische Methode muss je nach tatsächlicher API-Implementierung angepasst werden
    const response = await sapClient.messageStore.getMessageStoreEntryAttachmentContent(id, attachmentId);
    
    // Set content type based on the attachment
    // This would need to be adjusted based on the actual response
    res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="attachment-${attachmentId}"`);
    
    res.send(response.data);
  } catch (error) {
    logger.error(`Error downloading attachment ${req.params.attachmentId} for message store entry ${req.params.id}:`, error);
    res.status(500).json({ error: `Failed to download attachment ${req.params.attachmentId} for message store entry ${req.params.id}` });
  }
});

export default router; 