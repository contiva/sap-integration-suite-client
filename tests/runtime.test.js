/**
 * SAP Runtime Artifacts Test
 * 
 * Dieses Skript zeigt alle deployten Artefakte an und analysiert fehlerhafte Artefakte.
 */

const SapClient = require('../dist').default;
require('dotenv').config();

async function main() {
  try {
    // Base URL for API calls from environment
    const BASE_URL = process.env.SAP_BASE_URL;
    
    if (!BASE_URL) {
      throw new Error('SAP_BASE_URL environment variable is not set');
    }
    
    // Create SAP Integration Suite Client
    const client = new SapClient({
      oauth: {
        url: process.env.SAP_OAUTH_TOKEN_URL,
        clientid: process.env.SAP_OAUTH_CLIENT_ID,
        clientsecret: process.env.SAP_OAUTH_CLIENT_SECRET,
      },
      apiUrl: BASE_URL,
    });

    console.log('🔄 Retrieving deployed artifacts...\n');

    // Get deployed artifacts
    const deployedArtifacts = await client.integrationContent.getDeployedArtifacts();

    console.log(`✅ Found ${deployedArtifacts.length} deployed artifacts:\n`);
    
    // Group by status
    const byStatus = new Map();
    for (const artifact of deployedArtifacts) {
      const status = artifact.Status || 'UNKNOWN';
      if (!byStatus.has(status)) {
        byStatus.set(status, []);
      }
      byStatus.get(status).push(artifact);
    }
    
    // Show all artifacts in a simple list, grouped by status
    for (const [status, artifacts] of byStatus.entries()) {
      console.log(`\n${status} (${artifacts.length}):`);
      for (const artifact of artifacts) {
        console.log(`- ${artifact.Name} (${artifact.Id})`);
      }
    }

    // Find artifacts with ERROR status and analyze them
    const errorArtifacts = deployedArtifacts.filter(
      (artifact) => artifact.Status === 'ERROR'
    );

    if (errorArtifacts.length > 0) {
      console.log('\n🔍 Analysing error details for artifacts with ERROR status:\n');

      for (const artifact of errorArtifacts) {
        console.log(`⚠️  ${artifact.Name} (${artifact.Id}):`);
        
        // Get detailed error information
        const detailedError = await client.integrationContent.getDetailedArtifactErrorInformation(artifact.Id);
        
        if (detailedError) {
          // Parse error details to get the root cause using the enhanced method
          const parsedDetails = client.integrationContent.parseErrorDetails(detailedError);
          
          if (parsedDetails) {
            // Display error message
            if (parsedDetails.message) {
              console.log(`   Error: ${parsedDetails.message}`);
            }
            
            // Display root cause if available
            if (parsedDetails.childMessageInstances && parsedDetails.childMessageInstances.length > 0) {
              const rootCause = parsedDetails.childMessageInstances[0];
              console.log(`   Root cause: ${rootCause.message}`);
              
              if (rootCause.parameters && rootCause.parameters.length > 0) {
                console.log(`   Details: ${rootCause.parameters[0]}`);
              }
            }
            
            // Display parameters if available and no child instances
            else if (parsedDetails.parameters && parsedDetails.parameters.length > 0) {
              console.log(`   Details: ${parsedDetails.parameters[0]}`);
            }
          } else {
            console.log('   No detailed error information available');
          }
        } else {
          console.log('   No error information available');
        }
        
        console.log(''); // Empty line between errors
      }
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (error.response) {
      console.error('Response status:', error.response.status);
    }
  }
}

main();
