import { Router, Request, Response, NextFunction } from 'express';
import { defaultClient } from '../index';
import logger from '../utils/logger';
import { formatSapTimestampsInObject } from '../utils/date-formatter';

/**
 * Erstellt einen Router für Integration Content Endpunkte
 * @param options Optionale Konfiguration
 * @returns Express Router mit Integration Content Routes
 */
export function createIntegrationContentRoutes(options: { customSapClient?: any } = {}) {
  const router = Router();
  const client = options.customSapClient || defaultClient;

  // Get all integration packages
  router.get('/packages', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const { $top, $skip, $filter, $orderby, $select, $inlinecount } = req.query;
        
        const query: any = {};
        if ($top) query.$top = Number($top);
        if ($skip) query.$skip = Number($skip);
        if ($filter) query.$filter = $filter as string;
        if ($orderby) query.$orderby = [$orderby as string];
        if ($select) query.$select = [$select as string];
        if ($inlinecount) query.$inlinecount = [$inlinecount as string];
        
        const response = await client.integrationContent.integrationPackages.integrationPackagesList(query);
        
        // Formatiere die Zeitstempel in der Antwort
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error('Error fetching integration packages:', error);
        res.status(500).json({ error: 'Failed to fetch integration packages' });
      }
    })();
  });

  // Get integration package by ID
  router.get('/packages/:id', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const { id } = req.params;
        const response = await client.integrationContent.integrationPackagesId.integrationPackagesList(id);
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error(`Error fetching integration package ${req.params.id}:`, error);
        res.status(500).json({ error: `Failed to fetch integration package ${req.params.id}` });
      }
    })();
  });

  // Get integration flows for a package
  router.get('/packages/:id/flows', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const { id } = req.params;
        const response = await client.integrationContent.integrationPackagesId.integrationDesigntimeArtifactsList(id);
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error(`Error fetching integration flows for package ${req.params.id}:`, error);
        res.status(500).json({ error: `Failed to fetch integration flows for package ${req.params.id}` });
      }
    })();
  });

  // Get integration flow by ID and version
  router.get('/flows/:id/versions/:version', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const { id, version } = req.params;
        const response = await client.integrationContent.integrationDesigntimeArtifactsIdIdVersionVersion.integrationDesigntimeArtifactsIdVersionList(id, version);
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error(`Error fetching integration flow ${req.params.id} version ${req.params.version}:`, error);
        res.status(500).json({ error: `Failed to fetch integration flow ${req.params.id} version ${req.params.version}` });
      }
    })();
  });

  // Deploy integration flow
  router.post('/flows/:id/versions/:version/deploy', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const { id, version } = req.params;
        await client.integrationContent.deployIntegrationDesigntimeArtifact.deployIntegrationDesigntimeArtifactCreate({
          Id: id,
          Version: version
        });
        res.status(202).json({ message: `Deployment of integration flow ${id} version ${version} has been triggered` });
      } catch (error) {
        logger.error(`Error deploying integration flow ${req.params.id} version ${req.params.version}:`, error);
        res.status(500).json({ error: `Failed to deploy integration flow ${req.params.id} version ${req.params.version}` });
      }
    })();
  });

  // Get service endpoints
  router.get('/endpoints', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const response = await client.integrationContent.serviceEndpoints.serviceEndpointsList();
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error('Error fetching service endpoints:', error);
        res.status(500).json({ error: 'Failed to fetch service endpoints' });
      }
    })();
  });

  return router;
}

// Export default Router für Abwärtskompatibilität
export default createIntegrationContentRoutes(); 