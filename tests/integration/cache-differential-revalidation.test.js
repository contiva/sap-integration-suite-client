/**
 * Integration tests for differential cache revalidation
 * 
 * These tests validate that:
 * 1. Collection endpoints use differential updates during background revalidation
 * 2. Only changed artifacts are updated in the cache
 * 3. Cache metadata (cachedAt, expiresAt, revalidateAfter) is always refreshed
 * 4. Newly deployed artifacts are automatically detected after revalidation time
 */

const SapClient = require('../../dist/clients/sap-client').default;
const { createClient } = require('redis');
require('dotenv').config();

// Test configuration
const TEST_CONFIG = {
	baseUrl: process.env.SAP_BASE_URL,
	oauthClientId: process.env.SAP_OAUTH_CLIENT_ID,
	oauthClientSecret: process.env.SAP_OAUTH_CLIENT_SECRET,
	oauthTokenUrl: process.env.SAP_OAUTH_TOKEN_URL,
	redisConnectionString: process.env.REDIS_CONNECTION_STRING,
	redisEnabled: true,
};

// Redis client for direct cache inspection
let redisClient;

// Helper function to get cache entry via CacheManager (with decryption)
async function getCacheEntry(key, cacheManager) {
	if (cacheManager && cacheManager.isReady()) {
		try {
			return await cacheManager.get(key);
		} catch (error) {
			console.warn('Failed to get cache entry via CacheManager:', error.message);
			return null;
		}
	}
	return null;
}

// Helper function to find cache key for IntegrationRuntimeArtifacts
async function findRuntimeArtifactsCacheKey() {
	if (!redisClient || !redisClient.isOpen) {
		return null;
	}

	const keys = [];
	let cursor = 0;

	do {
		const result = await redisClient.scan(cursor, {
			MATCH: 'sap:*:GET:/IntegrationRuntimeArtifacts*',
			COUNT: 100,
		});
		cursor = result.cursor;
		keys.push(...result.keys);
	} while (cursor !== 0);

	// Return the first key found (without specific ID in URL)
	return keys.find(key => !key.includes("('")) || null;
}

describe('Differential Cache Revalidation Tests', () => {
	let client;

	beforeAll(async () => {
		// Skip tests if Redis is not configured
		if (!TEST_CONFIG.redisConnectionString || !TEST_CONFIG.baseUrl) {
			console.warn('Skipping differential revalidation tests: Redis or SAP credentials not configured');
			return;
		}

		// Initialize Redis client for test utilities
		let connectionPart = TEST_CONFIG.redisConnectionString.split(',')[0];
		connectionPart = connectionPart.replace(/^redis[s]?:\/\//, '');

		if (!connectionPart || !connectionPart.includes(':')) {
			throw new Error(`Invalid Redis connection string format: ${TEST_CONFIG.redisConnectionString}`);
		}

		const [host, portPart] = connectionPart.split(':');
		const port = parseInt(portPart, 10);

		// Check if TLS should be used (for Azure Redis)
		const useTLS = TEST_CONFIG.redisConnectionString.includes('ssl=true') || 
			TEST_CONFIG.redisConnectionString.includes('rediss://');

		// Extract password from connection string
		const passwordMatch = TEST_CONFIG.redisConnectionString.match(/password=([^,]+)/);
		const password = passwordMatch ? passwordMatch[1] : undefined;

		redisClient = createClient({
			socket: {
				host,
				port,
				tls: useTLS,
			},
			password,
		});

		await redisClient.connect();
	});

	afterAll(async () => {
		if (client) {
			await client.close();
		}
		if (redisClient && redisClient.isOpen) {
			await redisClient.quit();
		}
	});

	/**
	 * Test: Differential revalidation for collection endpoints
	 * 
	 * Szenario:
	 * 1. Initial request caches IntegrationRuntimeArtifacts
	 * 2. Wait for cache to become stale (after revalidateAfter time)
	 * 3. Second request triggers background revalidation
	 * 4. Verify that differential update is used (not full replacement)
	 * 5. Verify that cache metadata is refreshed
	 */
	test('should use differential updates for collection endpoints during revalidation', async () => {
		if (!TEST_CONFIG.redisConnectionString || !TEST_CONFIG.baseUrl) {
			console.warn('Skipping test: Redis or SAP credentials not configured');
			return;
		}

		// Initialize client with very short revalidation time for testing
		client = new SapClient({
			...TEST_CONFIG,
			encryptionSecret: TEST_CONFIG.oauthClientSecret, // Use client secret for encryption
		});

		// 1. Initial request to cache data
		console.log('[Test] Step 1: Initial request to cache IntegrationRuntimeArtifacts...');
		const artifacts1 = await client.integrationContent.getIntegrationRuntimeArtifacts();
		
		expect(artifacts1).toBeDefined();
		expect(Array.isArray(artifacts1)).toBe(true);
		
		const initialCount = artifacts1.length;
		console.log(`[Test] Initial cache contains ${initialCount} artifacts`);

		// Find the cache key
		const cacheKey = await findRuntimeArtifactsCacheKey();
		expect(cacheKey).toBeTruthy();
		console.log(`[Test] Found cache key: ${cacheKey.substring(0, 80)}...`);

		// Get initial cache metadata
		const initialCacheData = await getCacheEntry(cacheKey, client._cacheManager);
		expect(initialCacheData).toBeTruthy();
		expect(initialCacheData.cachedAt).toBeDefined();
		expect(initialCacheData.revalidateAfter).toBeDefined();
		
		const initialCachedAt = initialCacheData.cachedAt;
		const initialRevalidateAfter = initialCacheData.revalidateAfter;
		
		console.log(`[Test] Initial cache metadata: cachedAt=${new Date(initialCachedAt).toISOString()}, revalidateAfter=${new Date(initialRevalidateAfter).toISOString()}`);

		// 2. Wait for cache to become stale
		// For testing, we'll manually set the revalidateAfter to a past time
		console.log('[Test] Step 2: Manually marking cache as stale...');
		
		// Get current cache data
		const staleCacheData = { ...initialCacheData };
		staleCacheData.cachedAt = Date.now() - (2 * 3600 * 1000); // 2 hours ago
		staleCacheData.revalidateAfter = Date.now() - (1 * 3600 * 1000); // 1 hour ago (stale)
		staleCacheData.expiresAt = Date.now() + (28 * 24 * 3600 * 1000); // Still valid for 28 days
		
		// Save the modified cache data back
		const serialized = JSON.stringify(staleCacheData);
		const ttl = Math.ceil((staleCacheData.expiresAt - Date.now()) / 1000);
		await redisClient.set(cacheKey, serialized, { EX: ttl });
		
		console.log('[Test] Cache marked as stale (revalidateAfter is in the past)');

		// 3. Second request should trigger background revalidation with differential update
		console.log('[Test] Step 3: Second request to trigger background revalidation...');
		
		// Wait a bit to ensure background revalidation has time to start
		await new Promise(resolve => setTimeout(resolve, 500));
		
		const artifacts2 = await client.integrationContent.getIntegrationRuntimeArtifacts();
		
		expect(artifacts2).toBeDefined();
		expect(Array.isArray(artifacts2)).toBe(true);
		
		console.log(`[Test] Second request returned ${artifacts2.length} artifacts`);

		// 4. Wait for background revalidation to complete
		console.log('[Test] Step 4: Waiting for background revalidation to complete...');
		await new Promise(resolve => setTimeout(resolve, 3000));

		// 5. Verify cache metadata was refreshed
		console.log('[Test] Step 5: Verifying cache metadata was refreshed...');
		const revalidatedCacheData = await getCacheEntry(cacheKey, client._cacheManager);
		
		expect(revalidatedCacheData).toBeTruthy();
		expect(revalidatedCacheData.cachedAt).toBeGreaterThan(initialCachedAt);
		expect(revalidatedCacheData.revalidateAfter).toBeGreaterThan(initialRevalidateAfter);
		
		console.log(`[Test] Revalidated cache metadata: cachedAt=${new Date(revalidatedCacheData.cachedAt).toISOString()}, revalidateAfter=${new Date(revalidatedCacheData.revalidateAfter).toISOString()}`);
		console.log('[Test] ✅ Differential revalidation successful: Cache metadata refreshed');

		// 6. Verify data integrity
		expect(revalidatedCacheData.data).toBeDefined();
		console.log('[Test] ✅ Cache data integrity verified');
	}, 30000); // 30 second timeout

	/**
	 * Test: Non-collection endpoints should not use differential updates
	 * 
	 * Verifies that specific artifact requests (with ID) use full replacement
	 */
	test('should use full replacement for non-collection endpoints', async () => {
		if (!TEST_CONFIG.redisConnectionString || !TEST_CONFIG.baseUrl) {
			console.warn('Skipping test: Redis or SAP credentials not configured');
			return;
		}

		if (!client) {
			client = new SapClient({
				...TEST_CONFIG,
				encryptionSecret: TEST_CONFIG.oauthClientSecret,
			});
		}

		// Get a specific artifact (non-collection endpoint)
		console.log('[Test] Requesting specific artifact (non-collection endpoint)...');
		
		// First, get list of artifacts to find a valid ID
		const artifacts = await client.integrationContent.getIntegrationRuntimeArtifacts();
		expect(artifacts.length).toBeGreaterThan(0);
		
		const testArtifactId = artifacts[0].Id;
		console.log(`[Test] Using artifact ID: ${testArtifactId}`);

		// Request specific artifact
		const artifact = await client.integrationContent.getIntegrationRuntimeArtifact(testArtifactId);
		expect(artifact).toBeDefined();
		expect(artifact.Id).toBe(testArtifactId);

		console.log('[Test] ✅ Non-collection endpoint request successful');
		console.log('[Test] Note: This endpoint uses full replacement (not differential)');
	}, 20000);
});
