import { Router, Request, Response } from 'express';
import sapClient from '../clients/sap-client';
import logger from '../utils/logger';
import { formatSapTimestampsInObject } from '../utils/date-formatter';

const router = Router();

// Get all log file archives
router.get('/archives', async (req: Request, res: Response) => {
  try {
    const response = await sapClient.logFiles.logFileArchives.logFileArchivesList();
    // Formatiere die Zeitstempel in der Antwort
    const formattedData = formatSapTimestampsInObject(response.data);
    res.json(formattedData);
  } catch (error) {
    logger.error('Error fetching log file archives:', error);
    res.status(500).json({ error: 'Failed to fetch log file archives' });
  }
});

// Get log file archive by scope and type
router.get('/archives/:scope/:logFileType', async (req: Request<{ scope: string, logFileType: string }>, res: Response) => {
  try {
    const { scope, logFileType } = req.params;
    const { ModifiedAfter } = req.query;
    
    const query: any = {};
    if (ModifiedAfter) query.ModifiedAfter = ModifiedAfter as string;
    
    // Validate scope and logFileType
    if (!['all', 'latest'].includes(scope)) {
      res.status(400).json({ error: 'Invalid scope. Must be "all" or "latest"' });
      return;
    }
    
    if (!['http', 'trace'].includes(logFileType)) {
      res.status(400).json({ error: 'Invalid logFileType. Must be "http" or "trace"' });
      return;
    }
    
    const response = await sapClient.logFiles.logFileArchivesScopeScopeLogFileTypeLogFileTypeNodeScopeWorker.logFileArchivesScopeLogFileTypeNodeScopeWorkerList(
      [scope] as any, 
      [logFileType] as any, 
      query
    );
    // Formatiere die Zeitstempel in der Antwort
    const formattedData = formatSapTimestampsInObject(response.data);
    res.json(formattedData);
  } catch (error) {
    logger.error(`Error fetching log file archive ${req.params.scope}/${req.params.logFileType}:`, error);
    res.status(500).json({ error: `Failed to fetch log file archive ${req.params.scope}/${req.params.logFileType}` });
  }
});

// Download log file archive
router.get('/archives/:scope/:logFileType/download', async (req: Request<{ scope: string, logFileType: string }>, res: Response) => {
  try {
    const { scope, logFileType } = req.params;
    const { ModifiedAfter } = req.query;
    
    const query: any = {};
    if (ModifiedAfter) query.ModifiedAfter = ModifiedAfter as string;
    
    // Validate scope and logFileType
    if (!['all', 'latest'].includes(scope)) {
      res.status(400).json({ error: 'Invalid scope. Must be "all" or "latest"' });
      return;
    }
    
    if (!['http', 'trace'].includes(logFileType)) {
      res.status(400).json({ error: 'Invalid logFileType. Must be "http" or "trace"' });
      return;
    }
    
    const response = await sapClient.logFiles.logFileArchivesScopeScopeLogFileTypeLogFileTypeNodeScopeWorker.valueList(
      [scope] as any, 
      [logFileType] as any, 
      query
    );
    
    // Set response headers for file download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${scope}-${logFileType}-logs.zip"`);
    
    res.send(response.data);
  } catch (error) {
    logger.error(`Error downloading log file archive ${req.params.scope}/${req.params.logFileType}:`, error);
    res.status(500).json({ error: `Failed to download log file archive ${req.params.scope}/${req.params.logFileType}` });
  }
});

// Get all log files
router.get('/files', async (req: Request, res: Response) => {
  try {
    // Extract query parameters
    const { $top, $skip, $filter, $orderby, $select } = req.query;
    
    const query: any = {};
    if ($top) query.$top = Number($top);
    if ($skip) query.$skip = Number($skip);
    if ($filter) query.$filter = $filter as string;
    if ($orderby) query.$orderby = [$orderby as string];
    if ($select) query.$select = [$select as string];
    
    const response = await sapClient.logFiles.logFiles.logFilesList(query);
    // Formatiere die Zeitstempel in der Antwort
    const formattedData = formatSapTimestampsInObject(response.data);
    res.json(formattedData);
  } catch (error) {
    logger.error('Error fetching log files:', error);
    res.status(500).json({ error: 'Failed to fetch log files' });
  }
});

// Get log file by name and application
router.get('/files/:name/:application', async (req: Request<{ name: string, application: string }>, res: Response) => {
  try {
    const { name, application } = req.params;
    const response = await sapClient.logFiles.logFilesNameNameApplicationApplication.logFilesNameApplicationList(name, application);
    // Formatiere die Zeitstempel in der Antwort
    const formattedData = formatSapTimestampsInObject(response.data);
    res.json(formattedData);
  } catch (error) {
    logger.error(`Error fetching log file ${req.params.name}/${req.params.application}:`, error);
    res.status(500).json({ error: `Failed to fetch log file ${req.params.name}/${req.params.application}` });
  }
});

// Download log file by name and application
router.get('/files/:name/:application/download', async (req: Request<{ name: string, application: string }>, res: Response) => {
  try {
    const { name, application } = req.params;
    const response = await sapClient.logFiles.logFilesNameNameApplicationApplication.valueList(name, application);
    
    // Set response headers for file download
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
    
    res.send(response.data);
  } catch (error) {
    logger.error(`Error downloading log file ${req.params.name}/${req.params.application}:`, error);
    res.status(500).json({ error: `Failed to download log file ${req.params.name}/${req.params.application}` });
  }
});

export default router; 