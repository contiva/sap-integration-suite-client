/**
 * Mock Demo: Queue Deduplication
 * 
 * This script demonstrates Queue Deduplication using mocked SAP calls.
 * It proves that 50 concurrent requests result in only 1 actual fetch call.
 * 
 * Run with: node tests/manual/queue-deduplication-mock-demo.js
 */

const { CacheManager } = require('../../dist/core/cache-manager');

// Enable debug mode to see deduplication logs
process.env.DEBUG = 'true';

// Simulated delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Counter for SAP API calls
let sapApiCallCount = 0;

// Mock SAP fetch function (simulates slow SAP API)
async function mockSapFetch() {
  sapApiCallCount++;
  const callNumber = sapApiCallCount;
  
  console.log(`   🔥 SAP API Call #${callNumber} started`);
  
  // Simulate slow SAP response (100ms)
  await delay(100);
  
  // Return mock artifact data
  return {
    d: {
      results: [
        { Id: '1', Name: 'Artifact 1', DeployedOn: new Date().toISOString() },
        { Id: '2', Name: 'Artifact 2', DeployedOn: new Date().toISOString() },
        { Id: '3', Name: 'Artifact 3', DeployedOn: new Date().toISOString() },
      ],
    },
  };
}

async function runDemo() {
  console.log('\n==============================================');
  console.log('🧪 Queue Deduplication Mock Demo');
  console.log('==============================================\n');

  // Create cache manager (no Redis needed for this demo)
  const cacheManager = new CacheManager('localhost:6379,password=test,ssl=False', false);
  
  // Mock as enabled and connected (but not actually connecting)
  cacheManager['isEnabled'] = true;
  cacheManager['isConnected'] = true;

  try {
    console.log('📋 Test Setup:');
    console.log('  - Cache Manager: Mock mode (no Redis)');
    console.log('  - Debug Logging: Enabled');
    console.log('  - SAP API: Mocked (100ms response time)');
    console.log('');

    const cacheKey = 'test:deployed-artifacts';
    const cacheOptions = {
      ttl: 3600,
      revalidateAfter: 1800,
    };

    console.log('🚀 Scenario: 50 concurrent revalidation requests for the same key\n');
    console.log('   Starting 50 concurrent calls to revalidateInBackground()...');
    
    const startTime = Date.now();
    sapApiCallCount = 0; // Reset counter

    // Simulate 50 concurrent users triggering revalidation
    const requests = Array(50).fill(null).map((_, index) =>
      cacheManager.revalidateInBackground(cacheKey, mockSapFetch, cacheOptions)
    );

    await Promise.all(requests);
    
    const requestDuration = Date.now() - startTime;
    console.log(`   ✅ All 50 revalidation requests submitted in ${requestDuration}ms\n`);

    // Wait for queue processing to complete
    console.log('⏳ Waiting for queue processing (with 1s delays between items)...');
    await delay(3000);

    console.log('');
    console.log('==============================================');
    console.log('📊 RESULTS');
    console.log('==============================================');
    console.log(`✅ Total revalidation requests: 50`);
    console.log(`✅ Actual SAP API calls made: ${sapApiCallCount}`);
    console.log(`✅ Requests deduplicated: ${50 - sapApiCallCount}`);
    console.log(`✅ Deduplication rate: ${Math.round((1 - sapApiCallCount / 50) * 100)}%`);
    console.log('');

    if (sapApiCallCount === 1) {
      console.log('🎉 SUCCESS: Queue Deduplication is PERFECT!');
      console.log('   49 out of 50 requests were deduplicated.');
      console.log('   Only 1 SAP API call was made.');
    } else if (sapApiCallCount > 1 && sapApiCallCount <= 5) {
      console.log('✅ GOOD: Queue Deduplication is working well!');
      console.log(`   ${50 - sapApiCallCount} out of 50 requests were deduplicated.`);
      console.log(`   Only ${sapApiCallCount} SAP API calls were made.`);
      console.log('   (Some calls may have been queued before deduplication kicked in)');
    } else if (sapApiCallCount > 5 && sapApiCallCount <= 10) {
      console.log('⚠️  PARTIAL: Deduplication is working, but could be better.');
      console.log(`   ${sapApiCallCount} SAP API calls were made (expected: 1).`);
    } else {
      console.log('❌ FAILURE: Deduplication is not working as expected.');
      console.log(`   ${sapApiCallCount} SAP API calls were made (expected: 1).`);
    }
    console.log('==============================================\n');

    // Check _revalidationInProgress map
    const inProgressSize = cacheManager['_revalidationInProgress'].size;
    console.log('🧹 Cleanup Verification:');
    console.log(`   _revalidationInProgress Map size: ${inProgressSize}`);
    
    if (inProgressSize === 0) {
      console.log('   ✅ All revalidations cleaned up properly (no memory leak)');
    } else {
      console.log(`   ⚠️  Warning: ${inProgressSize} entries still in map`);
    }
    console.log('');

  } catch (error) {
    console.error('❌ Error during demo:', error.message);
    console.error(error.stack);
  } finally {
    console.log('🧹 Cleaning up...');
    
    // Reset mock state
    cacheManager['isEnabled'] = false;
    cacheManager['isConnected'] = false;
    
    await cacheManager.close();
    console.log('✅ Demo complete\n');
  }
}

// Run the demo
runDemo().catch(console.error);
