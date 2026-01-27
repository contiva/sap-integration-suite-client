/**
 * Manual test to demonstrate Queue Deduplication
 * 
 * This script simulates 50 concurrent users requesting the same stale cache data
 * and demonstrates that only 1 SAP API call is made (instead of 50).
 * 
 * Prerequisites:
 * - Redis running (or mock mode)
 * - .env.e2e configured with SAP credentials
 * 
 * Run with: node tests/manual/queue-deduplication-demo.js
 */

require('dotenv').config({ path: '.env.e2e' });

const SapClient = require('../../dist/index').default;
const { CacheManager } = require('../../dist/core/cache-manager');

// Enable debug mode to see cache logs
process.env.DEBUG = 'true';

async function demonstrateQueueDeduplication() {
  console.log('\n==============================================');
  console.log('🧪 Queue Deduplication Demo');
  console.log('==============================================\n');

  // SAP credentials from environment
  const sapConfig = {
    baseUrl: process.env.SAP_BASE_URL,
    oauthClientId: process.env.SAP_CLIENT_ID,
    oauthClientSecret: process.env.SAP_CLIENT_SECRET,
    oauthTokenUrl: process.env.SAP_TOKEN_URL,
  };

  // Redis config
  const redisConfig = process.env.REDIS_CONNECTION_STRING || 'localhost:6379,password=test,ssl=False';

  console.log('📋 Configuration:');
  console.log(`  - SAP System: ${sapConfig.baseUrl}`);
  console.log(`  - Redis: ${redisConfig}`);
  console.log(`  - Cache Enabled: true`);
  console.log(`  - Debug Mode: ${process.env.DEBUG}`);
  console.log('');

  // Create SAP client with cache enabled
  const sapClient = new SapClient(sapConfig, {
    enableCache: true,
    redisConnectionString: redisConfig,
    cacheTTL: 3600,
    revalidateAfter: 10, // 10 seconds for quick demo
  });

  try {
    console.log('🔗 Connecting to cache...');
    await sapClient.connect();
    console.log('✅ Connected to cache\n');

    // Step 1: Initial call to populate cache
    console.log('📥 Step 1: Initial call to populate cache');
    console.log('   Fetching deployed artifacts...');
    const initialData = await sapClient.integrationContent.getDeployedArtifacts();
    console.log(`   ✅ Received ${initialData.length} artifacts\n`);

    // Step 2: Wait for cache to become stale
    console.log('⏳ Step 2: Waiting 11 seconds for cache to become stale...');
    console.log('   (revalidateAfter = 10 seconds)');
    await new Promise(resolve => setTimeout(resolve, 11000));
    console.log('   ✅ Cache is now stale\n');

    // Step 3: Simulate 50 concurrent users
    console.log('🚀 Step 3: Simulating 50 concurrent users requesting the same data');
    console.log('   WITHOUT Queue Deduplication: 50 SAP API calls would be made');
    console.log('   WITH Queue Deduplication: Only 1 SAP API call should be made\n');

    console.log('   Starting 50 concurrent requests...');
    const startTime = Date.now();
    
    // Track SAP API calls (we'll monitor this in the background revalidation)
    let sapCallCount = 0;
    const originalFetch = sapClient.integrationContent.client.customFetch.bind(sapClient.integrationContent.client);
    sapClient.integrationContent.client.customFetch = async function(...args) {
      // Only count actual SAP calls, not cache hits
      const url = args[0];
      if (!url.includes('IntegrationRuntimeArtifacts')) {
        return originalFetch(...args);
      }
      
      // Check if this is coming from background revalidation
      const stack = new Error().stack;
      if (stack.includes('revalidateInBackground')) {
        sapCallCount++;
        console.log(`   🔥 SAP API Call #${sapCallCount} triggered`);
      }
      
      return originalFetch(...args);
    };

    // Make 50 concurrent requests
    const requests = Array(50).fill(null).map((_, index) =>
      sapClient.integrationContent.getDeployedArtifacts().then(() => {
        // Silent - just return
      })
    );

    await Promise.all(requests);
    const duration = Date.now() - startTime;

    console.log(`   ✅ All 50 requests completed in ${duration}ms\n`);

    // Wait for background revalidation to complete
    console.log('⏳ Waiting 3 seconds for background revalidation to complete...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('');

    // Results
    console.log('==============================================');
    console.log('📊 RESULTS');
    console.log('==============================================');
    console.log(`✅ Total concurrent requests: 50`);
    console.log(`✅ Total SAP API calls: ${sapCallCount}`);
    console.log(`✅ Requests served from cache: ${50 - sapCallCount}`);
    console.log(`✅ API call reduction: ${Math.round((1 - sapCallCount / 50) * 100)}%`);
    console.log('');

    if (sapCallCount === 1) {
      console.log('🎉 SUCCESS: Queue Deduplication is working perfectly!');
      console.log('   Only 1 SAP API call was made for 50 concurrent requests.');
    } else if (sapCallCount > 1 && sapCallCount < 10) {
      console.log('⚠️  PARTIAL SUCCESS: Deduplication is working, but not perfect.');
      console.log(`   ${sapCallCount} SAP API calls were made (expected: 1).`);
      console.log('   This may be due to timing or queue processing delays.');
    } else {
      console.log('❌ FAILURE: Queue Deduplication is not working as expected.');
      console.log(`   ${sapCallCount} SAP API calls were made (expected: 1).`);
    }
    console.log('==============================================\n');

  } catch (error) {
    console.error('❌ Error during demo:', error.message);
    console.error(error.stack);
  } finally {
    console.log('🧹 Cleaning up...');
    await sapClient.close();
    console.log('✅ Cleanup complete\n');
  }
}

// Run the demo
demonstrateQueueDeduplication().catch(console.error);
