// Load environment variables from .env.e2e before Jest runs
require('dotenv').config({ path: '.env.e2e' });

module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/e2e/**/*.test.js',
    '**/tests/e2e/**/*.e2e.test.js'
  ],
  verbose: true,
  testTimeout: 60000, // Increased timeout for E2E tests with real API calls
  // Exclude unit and integration tests from E2E test runs
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/units/',
    '/tests/integration/'
  ],
  // Setup files can be added here if needed for E2E test setup
  setupFilesAfterEnv: ['<rootDir>/tests/e2e/setup.js'],
};

