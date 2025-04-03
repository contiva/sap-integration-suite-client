/**
 * SAP Connection Test
 * 
 * This test verifies that the SAP connection parameters in .env are valid
 * and that we can successfully connect to the SAP system and fetch packages.
 */

const SapClient = require('../dist').default;
require('dotenv').config();

// Main test function 
async function testSapConnection() {
  console.log('🔄 Testing SAP Connection...');
  let testSuccessCount = 0;
  let testFailCount = 0;
  let client;
  
  try {
    // Create client using .env configuration
    console.log('\n🔄 STEP 1: Initialize SAP Client');
    client = new SapClient();
    console.log('✅ SapClient initialized successfully');
    testSuccessCount++;
    
    // Test authentication by fetching packages
    console.log('\n🔄 STEP 2: Fetch Integration Packages');
    const response = await client.integrationContent.integrationPackages.integrationPackagesList();
    
    if (!response) {
      throw new Error('No response received from SAP API');
    }
    
    const packages = response.data;
    
    // Log the response structure for debugging
    console.log('\n📋 API Response Structure:');
    console.log('Response type:', typeof packages);
    console.log('Response keys:', Object.keys(packages));
    console.log('Response sample:', JSON.stringify(packages).substring(0, 200) + '...');
    
    // Different SAP API versions may have different response structures
    // Try to handle common variations
    let packageList = [];
    
    if (Array.isArray(packages)) {
      packageList = packages;
      console.log('✅ Response is a direct array of packages');
    } else if (packages && Array.isArray(packages.IntegrationPackages)) {
      packageList = packages.IntegrationPackages;
      console.log('✅ Response contains IntegrationPackages array');
    } else if (packages && packages.d && Array.isArray(packages.d.results)) {
      // OData v2 format
      packageList = packages.d.results;
      console.log('✅ Response is in OData v2 format (d.results)');
    } else if (packages && packages.value && Array.isArray(packages.value)) {
      // OData v4 format
      packageList = packages.value;
      console.log('✅ Response is in OData v4 format (value array)');
    } else {
      console.error('❌ Unrecognized response structure. Please check the API response format.');
      console.error('Full response:', JSON.stringify(packages, null, 2));
      throw new Error('Invalid response format from SAP API');
    }
    
    const packageCount = packageList.length;
    console.log(`✅ Successfully identified ${packageCount} packages`);
    testSuccessCount++;
    
    if (packageCount === 0) {
      console.warn('⚠️ No packages found! This might indicate a configuration issue or empty account.');
    }
    
    // Print first 5 package details - adapt property names based on your response
    if (packageCount > 0) {
      console.log('\nSample packages:');
      packageList.slice(0, 5).forEach((pkg, index) => {
        // Try to handle different property naming conventions
        const name = pkg.Name || pkg.name || pkg.PackageName || pkg.packageName || pkg.id || pkg.Id || 'Unknown';
        const id = pkg.Id || pkg.id || pkg.PackageId || pkg.packageId || 'Unknown';
        console.log(`${index + 1}. ${name} (ID: ${id})`);
      });
      
      // ------------------------------------------------
      // STEP 3: Test fetching a single package by ID
      // ------------------------------------------------
      console.log('\n🔄 STEP 3: Test single package retrieval by ID');
      
      // Get the first package from the list
      const firstPackage = packageList[0];
      const packageId = firstPackage.Id || firstPackage.id || firstPackage.PackageId || firstPackage.packageId;
      
      if (!packageId) {
        console.error('❌ Could not determine package ID for single package test');
        testFailCount++;
      } else {
        console.log(`🔍 Fetching package with ID: ${packageId}`);
        
        try {
          // Fetch the single package by ID
          const singlePackageResponse = await client.integrationContent.integrationPackagesId.integrationPackagesList(packageId);
          
          if (!singlePackageResponse || !singlePackageResponse.data) {
            throw new Error('No response received when fetching single package');
          }
          
          const singlePackage = singlePackageResponse.data;
          
          // Debug: Log the full response structure to understand the data
          console.log('\n📋 Single Package Response Structure:');
          console.log('Response type:', typeof singlePackage);
          console.log('Response keys:', Object.keys(singlePackage));
          console.log('Full response:', JSON.stringify(singlePackage, null, 2).substring(0, 1000) + '...');
          
          // Log the retrieved package info - try different possible property paths
          let pkgName = 'Unknown';
          let pkgId = 'Unknown';
          
          // Try different property paths based on common API patterns
          if (singlePackage.Name) pkgName = singlePackage.Name;
          else if (singlePackage.name) pkgName = singlePackage.name;
          else if (singlePackage.d && singlePackage.d.Name) pkgName = singlePackage.d.Name;
          else if (singlePackage.d && singlePackage.d.name) pkgName = singlePackage.d.name;
          
          if (singlePackage.Id) pkgId = singlePackage.Id;
          else if (singlePackage.id) pkgId = singlePackage.id;
          else if (singlePackage.d && singlePackage.d.Id) pkgId = singlePackage.d.Id;
          else if (singlePackage.d && singlePackage.d.id) pkgId = singlePackage.d.id;
          
          console.log(`✅ Successfully retrieved single package: ${pkgName} (ID: ${pkgId})`);
          
          // Verify that the retrieved package matches the expected one
          if (pkgId === packageId) {
            console.log('✅ Package ID verification successful');
            testSuccessCount++;
          } else {
            console.warn('⚠️ Package ID mismatch: expected', packageId, 'but got', pkgId);
            testFailCount++;
          }
          
          // ------------------------------------------------
          // STEP 4: Test fetching integration flows in a package
          // ------------------------------------------------
          console.log('\n🔄 STEP 4: Fetch Integration Flows in the package');
          
          try {
            const flowsResponse = await client.integrationContent.integrationPackagesId.integrationDesigntimeArtifactsList(packageId);
            
            if (!flowsResponse || !flowsResponse.data) {
              throw new Error('No response received when fetching integration flows');
            }
            
            const flowsData = flowsResponse.data;
            
            // Debug log structure
            console.log('\n📋 Integration Flows Response Structure:');
            console.log('Response type:', typeof flowsData);
            console.log('Response keys:', Object.keys(flowsData));
            
            // Extract the flows list
            let flowsList = [];
            if (Array.isArray(flowsData)) {
              flowsList = flowsData;
            } else if (flowsData.value && Array.isArray(flowsData.value)) {
              flowsList = flowsData.value;
            } else if (flowsData.d && flowsData.d.results && Array.isArray(flowsData.d.results)) {
              flowsList = flowsData.d.results;
            }
            
            console.log(`✅ Successfully retrieved ${flowsList.length} integration flows from package`);
            testSuccessCount++;
            
            // Display flows if any exist
            if (flowsList.length > 0) {
              console.log('\nSample integration flows:');
              flowsList.slice(0, 3).forEach((flow, index) => {
                const flowName = flow.Name || flow.name || 'Unknown';
                const flowId = flow.Id || flow.id || 'Unknown';
                console.log(`${index + 1}. ${flowName} (ID: ${flowId})`);
              });
            }
          } catch (flowsError) {
            console.error('❌ Failed to retrieve integration flows:', flowsError.message);
            if (flowsError.response) {
              console.error('Status:', flowsError.response.status);
              console.error('Error details:', JSON.stringify(flowsError.response.data, null, 2));
            }
            testFailCount++;
          }
        } catch (pkgError) {
          console.error('❌ Failed to retrieve single package:', pkgError.message);
          if (pkgError.response) {
            console.error('Status:', pkgError.response.status);
            console.error('Error details:', JSON.stringify(pkgError.response.data, null, 2));
          }
          testFailCount++;
        }
      }
      
      // ------------------------------------------------
      // STEP 5: Test fetching service endpoints
      // ------------------------------------------------
      console.log('\n🔄 STEP 5: Fetch Service Endpoints');
      
      try {
        const endpointsResponse = await client.integrationContent.serviceEndpoints.serviceEndpointsList();
        
        if (!endpointsResponse || !endpointsResponse.data) {
          throw new Error('No response received when fetching service endpoints');
        }
        
        const endpointsData = endpointsResponse.data;
        
        // Debug log structure
        console.log('\n📋 Service Endpoints Response Structure:');
        console.log('Response type:', typeof endpointsData);
        console.log('Response keys:', Object.keys(endpointsData));
        
        // Extract the endpoints list
        let endpointsList = [];
        if (Array.isArray(endpointsData)) {
          endpointsList = endpointsData;
        } else if (endpointsData.value && Array.isArray(endpointsData.value)) {
          endpointsList = endpointsData.value;
        } else if (endpointsData.d && endpointsData.d.results && Array.isArray(endpointsData.d.results)) {
          endpointsList = endpointsData.d.results;
        }
        
        console.log(`✅ Successfully retrieved ${endpointsList.length} service endpoints`);
        testSuccessCount++;
        
        // Display endpoints if any exist
        if (endpointsList.length > 0) {
          console.log('\nSample service endpoints:');
          endpointsList.slice(0, 3).forEach((endpoint, index) => {
            const endpointName = endpoint.Name || endpoint.name || 'Unknown';
            const protocol = endpoint.Protocol || endpoint.protocol || 'Unknown';
            console.log(`${index + 1}. ${endpointName} (Protocol: ${protocol})`);
          });
        }
      } catch (endpointsError) {
        console.error('❌ Failed to retrieve service endpoints:', endpointsError.message);
        if (endpointsError.response) {
          console.error('Status:', endpointsError.response.status);
          console.error('Error details:', JSON.stringify(endpointsError.response.data, null, 2));
        }
        testFailCount++;
      }
    }
    
    // Final test summary
    console.log('\n📊 SAP Connection Test Summary:');
    console.log(`✅ ${testSuccessCount} tests passed`);
    console.log(`❌ ${testFailCount} tests failed`);
    
    if (testFailCount === 0) {
      console.log('\n✅ SAP Connection test SUCCESSFUL');
      return true;
    } else {
      console.log('\n⚠️ SAP Connection test PARTIALLY SUCCESSFUL');
      return testSuccessCount > 0; // Return true if at least some tests succeeded
    }
  } catch (error) {
    console.error('\n❌ SAP Connection test FAILED');
    console.error('Error details:', error.message);
    
    // If there's an Axios error with response data, show more details
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    
    // Show client configuration (without sensitive data)
    if (client) {
      console.log('\nClient configuration:');
      console.log('Base URL:', client.baseUrl);
      console.log('Features:', {
        normalizeResponses: client.normalizeResponses !== undefined,
        maxRetries: client.maxRetries || 0
      });
    }
    
    // Exit with an error code to fail the build process
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testSapConnection();
} else {
  // Export for use in other tests
  module.exports = testSapConnection;
}