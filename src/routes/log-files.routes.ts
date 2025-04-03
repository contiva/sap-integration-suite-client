import { Router, Request, Response, NextFunction } from 'express';
import { defaultClient } from '../index';
import logger from '../utils/logger';
import { formatSapTimestampsInObject } from '../utils/date-formatter';

/**
 * Erstellt einen Router für Log Files Endpunkte
 * @param options Optionale Konfiguration
 * @returns Express Router mit Log Files Routes
 */
export function createLogFilesRoutes(options: { customSapClient?: any } = {}) {
  const router = Router();
  const client = options.customSapClient || defaultClient;

  // Get all log file archives
  router.get('/archives', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const response = await client.logFiles.logArchives.logArchivesList();
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error('Error fetching log archives:', error);
        res.status(500).json({ error: 'Failed to fetch log archives' });
      }
    })();
  });

  // Get log file archive by scope and type
  router.get('/archives/:scope/:logFileType', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const { scope, logFileType } = req.params;
        const response = await client.logFiles.logArchivesScopeLogFileType.logArchivesList(scope, logFileType);
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error(`Error fetching log archive ${req.params.scope}/${req.params.logFileType}:`, error);
        res.status(500).json({ error: `Failed to fetch log archive ${req.params.scope}/${req.params.logFileType}` });
      }
    })();
  });

  // Download log file archive
  router.get('/archives/:scope/:logFileType/download', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const { scope, logFileType } = req.params;
        const response = await client.logFiles.logArchivesScopeLogFileType.logArchivesValueList(scope, logFileType);
        
        // Set content disposition header for download
        res.setHeader('Content-Disposition', `attachment; filename=${scope}_${logFileType}.log`);
        res.setHeader('Content-Type', 'application/octet-stream');
        
        res.send(response.data);
      } catch (error) {
        logger.error(`Error downloading log archive ${req.params.scope}/${req.params.logFileType}:`, error);
        res.status(500).json({ error: `Failed to download log archive ${req.params.scope}/${req.params.logFileType}` });
      }
    })();
  });

  // Get all log files
  router.get('/files', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const response = await client.logFiles.logFiles.logFilesList();
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error('Error fetching log files:', error);
        res.status(500).json({ error: 'Failed to fetch log files' });
      }
    })();
  });

  // Get log file by name and application
  router.get('/files/:name/:application', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const { name, application } = req.params;
        const response = await client.logFiles.logFilesNameApplication.logFilesList(name, application);
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error(`Error fetching log file ${req.params.name}/${req.params.application}:`, error);
        res.status(500).json({ error: `Failed to fetch log file ${req.params.name}/${req.params.application}` });
      }
    })();
  });

  // Download log file
  router.get('/files/:name/:application/download', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const { name, application } = req.params;
        const response = await client.logFiles.logFilesNameApplication.logFilesValueList(name, application);
        
        // Set content disposition header for download
        res.setHeader('Content-Disposition', `attachment; filename=${name}_${application}.log`);
        res.setHeader('Content-Type', 'application/octet-stream');
        
        res.send(response.data);
      } catch (error) {
        logger.error(`Error downloading log file ${req.params.name}/${req.params.application}:`, error);
        res.status(500).json({ error: `Failed to download log file ${req.params.name}/${req.params.application}` });
      }
    })();
  });

  return router;
}

// Export default Router für Abwärtskompatibilität
export default createLogFilesRoutes(); 