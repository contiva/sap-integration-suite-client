import { Router, Request, Response } from 'express';
import sapClient from '../clients/sap-client';
import logger from '../utils/logger';
import { formatSapTimestampsInObject } from '../utils/date-formatter';

const router = Router();

// Get all security artifacts
router.get('/artifacts', async (req: Request, res: Response) => {
  try {
    // Die spezifische Methode muss je nach tatsächlicher API-Implementierung angepasst werden
    // Dies ist eine Platzhalter-Implementierung, die angepasst werden muss
    const response = await sapClient.securityContent.getSecurityArtifacts();
    const formattedData = formatSapTimestampsInObject(response.data);
    res.json(formattedData);
  } catch (error) {
    logger.error('Error fetching security artifacts:', error);
    res.status(500).json({ error: 'Failed to fetch security artifacts' });
  }
});

// Get security artifact by ID
router.get('/artifacts/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Die spezifische Methode muss je nach tatsächlicher API-Implementierung angepasst werden
    const response = await sapClient.securityContent.getSecurityArtifactById(id);
    const formattedData = formatSapTimestampsInObject(response.data);
    res.json(formattedData);
  } catch (error) {
    logger.error(`Error fetching security artifact ${req.params.id}:`, error);
    res.status(500).json({ error: `Failed to fetch security artifact ${req.params.id}` });
  }
});

// Deploy security artifact
router.post('/artifacts/:id/deploy', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Die spezifische Methode muss je nach tatsächlicher API-Implementierung angepasst werden
    await sapClient.securityContent.deploySecurityArtifact(id);
    res.status(202).json({ message: `Deployment of security artifact ${id} has been triggered` });
  } catch (error) {
    logger.error(`Error deploying security artifact ${req.params.id}:`, error);
    res.status(500).json({ error: `Failed to deploy security artifact ${req.params.id}` });
  }
});

// Get security material
router.get('/materials', async (req: Request, res: Response) => {
  try {
    // Die spezifische Methode muss je nach tatsächlicher API-Implementierung angepasst werden
    const response = await sapClient.securityContent.getSecurityMaterials();
    const formattedData = formatSapTimestampsInObject(response.data);
    res.json(formattedData);
  } catch (error) {
    logger.error('Error fetching security materials:', error);
    res.status(500).json({ error: 'Failed to fetch security materials' });
  }
});

// Get security material by ID
router.get('/materials/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Die spezifische Methode muss je nach tatsächlicher API-Implementierung angepasst werden
    const response = await sapClient.securityContent.getSecurityMaterialById(id);
    const formattedData = formatSapTimestampsInObject(response.data);
    res.json(formattedData);
  } catch (error) {
    logger.error(`Error fetching security material ${req.params.id}:`, error);
    res.status(500).json({ error: `Failed to fetch security material ${req.params.id}` });
  }
});

export default router; 