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
  
  try {
    // Create client using .env configuration
    const client = new SapClient();
    console.log('✅ SapClient initialized successfully');
    
    // Test authentication by fetching packages
    console.log('🔄 Fetching packages to verify authentication...');
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
    
    // Print first 5 package details - adapt property names based on your response
    if (packageCount > 0) {
      console.log('\nSample packages:');
      packageList.slice(0, 5).forEach((pkg, index) => {
        // Try to handle different property naming conventions
        const name = pkg.Name || pkg.name || pkg.PackageName || pkg.packageName || pkg.id || pkg.Id || 'Unknown';
        const id = pkg.Id || pkg.id || pkg.PackageId || pkg.packageId || 'Unknown';
        console.log(`${index + 1}. ${name} (ID: ${id})`);
      });
    }
    
    console.log('\n✅ SAP Connection test SUCCESSFUL');
    return true;
  } catch (error) {
    console.error('\n❌ SAP Connection test FAILED');
    console.error('Error details:', error.message);
    
    // If there's an Axios error with response data, show more details
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
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