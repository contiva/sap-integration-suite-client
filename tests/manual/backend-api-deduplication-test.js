/**
 * Backend API Test: Queue Deduplication
 * 
 * This script simulates multiple concurrent users accessing the same
 * landscape data through the Backend API, demonstrating the Queue
 * Deduplication feature in action.
 * 
 * Run with: node tests/manual/backend-api-deduplication-test.js
 */

const https = require('https');
const http = require('http');

// Configuration
const BACKEND_URL = 'http://localhost:3000';
const LANDSCAPE_ID = '6fac7823-dc44-41c4-9881-143c60642c3c'; // Example landscape ID
const AUTH_TOKEN = 'your-auth-token-here'; // Replace with actual token

// Helper to make HTTP requests
function makeRequest(url, token) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve({ statusCode: res.statusCode, data });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// Simulated delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runBackendTest() {
  console.log('\n==============================================');
  console.log('🌐 Backend API Test: Queue Deduplication');
  console.log('==============================================\n');

  console.log('📋 Test Configuration:');
  console.log(`  - Backend URL: ${BACKEND_URL}`);
  console.log(`  - Landscape ID: ${LANDSCAPE_ID}`);
  console.log(`  - Concurrent Requests: 10`);
  console.log('');

  // Test endpoint
  const endpoint = `${BACKEND_URL}/api/v1/landscapes/${LANDSCAPE_ID}/runtime-systems`;

  console.log('🚀 Test Scenario:');
  console.log('  1. Clear cache by adding forceCacheRefresh parameter');
  console.log('  2. Make initial request to populate cache');
  console.log('  3. Wait for cache to become stale (simulated)');
  console.log('  4. Make 10 concurrent requests');
  console.log('  5. Verify only 1 SAP API call in Backend logs');
  console.log('');

  try {
    // Note: This test requires manual verification of Backend logs
    console.log('⚠️  MANUAL TEST INSTRUCTIONS:');
    console.log('');
    console.log('1. Open Backend terminal and monitor logs:');
    console.log('   Look for "[CacheManager] ⏭️ Skipping duplicate revalidation"');
    console.log('');
    console.log('2. Run this test to trigger concurrent requests');
    console.log('');
    console.log('3. Expected Backend log output:');
    console.log('   - 1x: "Background revalidation successful"');
    console.log('   - 9x: "⏭️ Skipping duplicate revalidation"');
    console.log('');
    console.log('4. If you want to run this test, replace AUTH_TOKEN with a valid token');
    console.log('   and uncomment the code below.');
    console.log('');

    /*
    // Uncomment to run actual test:
    
    console.log('Step 1: Initial request (populate cache)...');
    await makeRequest(`${endpoint}?forceCacheRefresh=true`, AUTH_TOKEN);
    console.log('✅ Cache populated\n');

    console.log('Step 2: Waiting 2 seconds for cache to stabilize...');
    await delay(2000);
    console.log('✅ Ready\n');

    console.log('Step 3: Making 10 concurrent requests...');
    const startTime = Date.now();
    
    const requests = Array(10).fill(null).map((_, index) => {
      console.log(`   Request ${index + 1} sent...`);
      return makeRequest(endpoint, AUTH_TOKEN)
        .then(() => console.log(`   ✅ Request ${index + 1} completed`))
        .catch((err) => console.log(`   ❌ Request ${index + 1} failed: ${err.message}`));
    });

    await Promise.all(requests);
    const duration = Date.now() - startTime;
    
    console.log(`\n✅ All requests completed in ${duration}ms\n`);

    console.log('==============================================');
    console.log('📊 RESULTS');
    console.log('==============================================');
    console.log('✅ 10 concurrent API requests sent');
    console.log('✅ Check Backend logs for deduplication confirmation');
    console.log('');
    console.log('Expected Backend Logs:');
    console.log('  - [CacheManager] Background revalidation successful (1x)');
    console.log('  - [CacheManager] ⏭️ Skipping duplicate revalidation (9x)');
    console.log('==============================================\n');
    */

    console.log('==============================================');
    console.log('📝 ALTERNATIVE: Use Mock Demo');
    console.log('==============================================');
    console.log('');
    console.log('For a fully automated test without Backend/SAP dependencies:');
    console.log('');
    console.log('  npm run build');
    console.log('  node tests/manual/queue-deduplication-mock-demo.js');
    console.log('');
    console.log('This will demonstrate the same deduplication logic');
    console.log('with mocked SAP API calls and show:');
    console.log('  - 50 concurrent requests');
    console.log('  - Only 1 SAP API call');
    console.log('  - 98% deduplication rate');
    console.log('==============================================\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

runBackendTest();
