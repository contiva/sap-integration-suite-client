import { Router, Request, Response, NextFunction } from 'express';
import sapClient from '../clients/sap-client';
import logger from '../utils/logger';
import { formatSapTimestampsInObject } from '../utils/date-formatter';

/**
 * Erstellt einen Router für Security Content Endpunkte
 * @param options Optionale Konfiguration
 * @returns Express Router mit Security Content Routes
 */
export function createSecurityContentRoutes(options: { customSapClient?: any } = {}) {
  const router = Router();
  const client = options.customSapClient || sapClient;

  // Get user credentials
  router.get('/user-credentials', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const response = await client.securityContent.userCredentials.userCredentialsList();
        // Format timestamps in the response
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error('Error fetching user credentials:', error);
        res.status(500).json({ error: 'Failed to fetch user credentials' });
      }
    })();
  });

  // Get user credential by name
  router.get('/user-credentials/:name', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const { name } = req.params;
        
        const response = await client.securityContent.userCredentialsName.userCredentialsList(name);
        // Format timestamps in the response
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error(`Error fetching user credential ${req.params.name}:`, error);
        res.status(500).json({ error: `Failed to fetch user credential ${req.params.name}` });
      }
    })();
  });

  // Get secure parameters
  router.get('/secure-parameters', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const response = await client.securityContent.secureParameters.secureParametersList();
        // Format timestamps in the response
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error('Error fetching secure parameters:', error);
        res.status(500).json({ error: 'Failed to fetch secure parameters' });
      }
    })();
  });

  // Get secure parameter by name
  router.get('/secure-parameters/:name', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const { name } = req.params;
        
        const response = await client.securityContent.secureParametersName.secureParametersList(name);
        // Format timestamps in the response
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error(`Error fetching secure parameter ${req.params.name}:`, error);
        res.status(500).json({ error: `Failed to fetch secure parameter ${req.params.name}` });
      }
    })();
  });

  // Get OAuth2 client credentials
  router.get('/oauth2-client-credentials', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const response = await client.securityContent.oAuth2ClientCredentials.oAuth2ClientCredentialsList();
        // Format timestamps in the response
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error('Error fetching OAuth2 client credentials:', error);
        res.status(500).json({ error: 'Failed to fetch OAuth2 client credentials' });
      }
    })();
  });

  // Get OAuth2 client credential by name
  router.get('/oauth2-client-credentials/:name', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const { name } = req.params;
        
        const response = await client.securityContent.oAuth2ClientCredentialsName.oAuth2ClientCredentialsList(name);
        // Format timestamps in the response
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error(`Error fetching OAuth2 client credential ${req.params.name}:`, error);
        res.status(500).json({ error: `Failed to fetch OAuth2 client credential ${req.params.name}` });
      }
    })();
  });

  // Get keystores - since there's no direct listAll method, we'll get the system keystore
  router.get('/keystores', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        // Get the system keystore - which is the main one
        const systemName: ["system"] = ["system"];
        const response = await client.securityContent.keystoreResourcesKeystoreName.keystoreResourcesList(systemName);
        // Format timestamps in the response
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error('Error fetching keystores:', error);
        res.status(500).json({ error: 'Failed to fetch keystores' });
      }
    })();
  });

  // Get keystore by name
  router.get('/keystores/:name', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const { name } = req.params;
        
        // Handle only the supported keystore names
        if (name !== 'system' && name !== 'backup_admin_system') {
          return res.status(400).json({ 
            error: 'Invalid keystore name. Supported values are "system" or "backup_admin_system"' 
          });
        }
        
        const keystoreName = [name] as ["system"] | ["backup_admin_system"];
        const response = await client.securityContent.keystoreResourcesKeystoreName.keystoreResourcesList(keystoreName);
        // Format timestamps in the response
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error(`Error fetching keystore ${req.params.name}:`, error);
        res.status(500).json({ error: `Failed to fetch keystore ${req.params.name}` });
      }
    })();
  });

  // Get certificate user mappings
  router.get('/certificate-user-mappings', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const response = await client.securityContent.certificateUserMappings.certificateUserMappingsList();
        // Format timestamps in the response
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error('Error fetching certificate user mappings:', error);
        res.status(500).json({ error: 'Failed to fetch certificate user mappings' });
      }
    })();
  });

  // Get certificate user mapping by ID
  router.get('/certificate-user-mappings/:id', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const { id } = req.params;
        
        const response = await client.securityContent.certificateUserMappingsId.certificateUserMappingsList(id);
        // Format timestamps in the response
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error(`Error fetching certificate user mapping ${req.params.id}:`, error);
        res.status(500).json({ error: `Failed to fetch certificate user mapping ${req.params.id}` });
      }
    })();
  });

  // Get access policies
  router.get('/access-policies', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        const response = await client.securityContent.accessPolicies.accessPoliciesList();
        // Format timestamps in the response
        const formattedData = formatSapTimestampsInObject(response.data);
        res.json(formattedData);
      } catch (error) {
        logger.error('Error fetching access policies:', error);
        res.status(500).json({ error: 'Failed to fetch access policies' });
      }
    })();
  });

  // Get access policy by ID - since there's no direct GET method, we filter the list
  router.get('/access-policies/:id', function(req: Request, res: Response, next: NextFunction) {
    (async () => {
      try {
        // There's no direct method to get a single access policy by ID
        // So we'll need to get all policies and filter client-side
        const response = await client.securityContent.accessPolicies.accessPoliciesList();
        const allPolicies = response.data;
        
        // Find the policy with the matching ID or return null
        const { id } = req.params;
        const policy = allPolicies.d?.results?.find((p: any) => p.Id === id) || null;
        
        if (policy) {
          // Format timestamps in the response
          const formattedData = formatSapTimestampsInObject(policy);
          res.json(formattedData);
        } else {
          res.status(404).json({ error: `Access policy with ID ${id} not found` });
        }
      } catch (error) {
        logger.error(`Error fetching access policy ${req.params.id}:`, error);
        res.status(500).json({ error: `Failed to fetch access policy ${req.params.id}` });
      }
    })();
  });

  return router;
}

// Export default Router für Abwärtskompatibilität
export default createSecurityContentRoutes(); 