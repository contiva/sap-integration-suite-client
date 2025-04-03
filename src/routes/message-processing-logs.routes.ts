import { Router, Request, Response } from 'express';
import sapClient from '../clients/sap-client';
import logger from '../utils/logger';
import { formatSapTimestampsInObject } from '../utils/date-formatter';

const router = Router();

// Get all message processing logs
router.get('/', async (req: Request, res: Response) => {
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
    
    const response = await sapClient.messageProcessingLogs.messageProcessingLogs.messageProcessingLogsList(query);
    // Formatiere die Zeitstempel in der Antwort
    const formattedData = formatSapTimestampsInObject(response.data);
    res.json(formattedData);
  } catch (error) {
    logger.error('Error fetching message processing logs:', error);
    res.status(500).json({ error: 'Failed to fetch message processing logs' });
  }
});

// Get message processing log by message GUID
router.get('/:messageGuid', async (req: Request, res: Response) => {
  try {
    const { messageGuid } = req.params;
    const { $select, $expand } = req.query;
    
    const query: any = {};
    if ($select) query.$select = [$select as string];
    if ($expand) query.$expand = [$expand as string];
    
    const response = await sapClient.messageProcessingLogs.messageProcessingLogsMessageGuid.messageProcessingLogsList(messageGuid, query);
    // Formatiere die Zeitstempel in der Antwort
    const formattedData = formatSapTimestampsInObject(response.data);
    res.json(formattedData);
  } catch (error) {
    logger.error(`Error fetching message processing log ${req.params.messageGuid}:`, error);
    res.status(500).json({ error: `Failed to fetch message processing log ${req.params.messageGuid}` });
  }
});

// Get adapter attributes for a message processing log
router.get('/:messageGuid/adapter-attributes', async (req: Request, res: Response) => {
  try {
    const { messageGuid } = req.params;
    const { $select } = req.query;
    
    const query: any = {};
    if ($select) query.$select = [$select as string];
    
    const response = await sapClient.messageProcessingLogs.messageProcessingLogsMessageGuid.adapterAttributesList(messageGuid, query);
    // Formatiere die Zeitstempel in der Antwort
    const formattedData = formatSapTimestampsInObject(response.data);
    res.json(formattedData);
  } catch (error) {
    logger.error(`Error fetching adapter attributes for message ${req.params.messageGuid}:`, error);
    res.status(500).json({ error: `Failed to fetch adapter attributes for message ${req.params.messageGuid}` });
  }
});

// Get attachments for a message processing log
router.get('/:messageGuid/attachments', async (req: Request, res: Response) => {
  try {
    const { messageGuid } = req.params;
    const response = await sapClient.messageProcessingLogs.messageProcessingLogsMessageGuid.attachmentsList(messageGuid);
    // Formatiere die Zeitstempel in der Antwort
    const formattedData = formatSapTimestampsInObject(response.data);
    res.json(formattedData);
  } catch (error) {
    logger.error(`Error fetching attachments for message ${req.params.messageGuid}:`, error);
    res.status(500).json({ error: `Failed to fetch attachments for message ${req.params.messageGuid}` });
  }
});

// Get error information for a message processing log
router.get('/:messageGuid/error-information', async (req: Request, res: Response) => {
  try {
    const { messageGuid } = req.params;
    const response = await sapClient.messageProcessingLogs.messageProcessingLogsMessageGuid.errorInformationList(messageGuid);
    // Formatiere die Zeitstempel in der Antwort
    const formattedData = formatSapTimestampsInObject(response.data);
    res.json(formattedData);
  } catch (error) {
    logger.error(`Error fetching error information for message ${req.params.messageGuid}:`, error);
    res.status(500).json({ error: `Failed to fetch error information for message ${req.params.messageGuid}` });
  }
});

// Get error details text for a message processing log
router.get('/:messageGuid/error-details', async (req: Request, res: Response) => {
  try {
    const { messageGuid } = req.params;
    const response = await sapClient.messageProcessingLogs.messageProcessingLogsMessageGuid.errorInformationValueList(messageGuid);
    res.send(response.data);
  } catch (error) {
    logger.error(`Error fetching error details for message ${req.params.messageGuid}:`, error);
    res.status(500).json({ error: `Failed to fetch error details for message ${req.params.messageGuid}` });
  }
});

export default router; 