import { Router, Request, Response } from 'express';
import sapClient from '../clients/sap-client';
import logger from '../utils/logger';
import { formatSapTimestampsInObject } from '../utils/date-formatter';

const router = Router();

// Get all integration packages
router.get('/packages', async (req: Request, res: Response) => {
  try {
    const response = await sapClient.integrationContent.integrationPackages.integrationPackagesList();
    const formattedData = formatSapTimestampsInObject(response.data);
    res.json(formattedData);
  } catch (error) {
    logger.error('Error fetching integration packages:', error);
    res.status(500).json({ error: 'Failed to fetch integration packages' });
  }
});

// Get integration package by ID
router.get('/packages/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await sapClient.integrationContent.integrationPackagesId.integrationPackagesList(id);
    const formattedData = formatSapTimestampsInObject(response.data);
    res.json(formattedData);
  } catch (error) {
    logger.error(`Error fetching integration package ${req.params.id}:`, error);
    res.status(500).json({ error: `Failed to fetch integration package ${req.params.id}` });
  }
});

// Get integration flows for a package
router.get('/packages/:id/flows', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await sapClient.integrationContent.integrationPackagesId.integrationDesigntimeArtifactsList(id);
    const formattedData = formatSapTimestampsInObject(response.data);
    res.json(formattedData);
  } catch (error) {
    logger.error(`Error fetching integration flows for package ${req.params.id}:`, error);
    res.status(500).json({ error: `Failed to fetch integration flows for package ${req.params.id}` });
  }
});

// Get integration flow by ID and version
router.get('/flows/:id/versions/:version', async (req: Request, res: Response) => {
  try {
    const { id, version } = req.params;
    const response = await sapClient.integrationContent.integrationDesigntimeArtifactsIdIdVersionVersion.integrationDesigntimeArtifactsIdVersionList(id, version);
    const formattedData = formatSapTimestampsInObject(response.data);
    res.json(formattedData);
  } catch (error) {
    logger.error(`Error fetching integration flow ${req.params.id} version ${req.params.version}:`, error);
    res.status(500).json({ error: `Failed to fetch integration flow ${req.params.id} version ${req.params.version}` });
  }
});

// Deploy integration flow
router.post('/flows/:id/versions/:version/deploy', async (req: Request, res: Response) => {
  try {
    const { id, version } = req.params;
    await sapClient.integrationContent.deployIntegrationDesigntimeArtifact.deployIntegrationDesigntimeArtifactCreate({
      Id: id,
      Version: version
    });
    res.status(202).json({ message: `Deployment of integration flow ${id} version ${version} has been triggered` });
  } catch (error) {
    logger.error(`Error deploying integration flow ${req.params.id} version ${req.params.version}:`, error);
    res.status(500).json({ error: `Failed to deploy integration flow ${req.params.id} version ${req.params.version}` });
  }
});

// Get service endpoints
router.get('/endpoints', async (req: Request, res: Response) => {
  try {
    const response = await sapClient.integrationContent.serviceEndpoints.serviceEndpointsList();
    const formattedData = formatSapTimestampsInObject(response.data);
    res.json(formattedData);
  } catch (error) {
    logger.error('Error fetching service endpoints:', error);
    res.status(500).json({ error: 'Failed to fetch service endpoints' });
  }
});

export default router; 