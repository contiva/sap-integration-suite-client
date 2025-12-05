module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/units/**/*.test.js',
    '**/tests/integration/**/*.test.js'
  ],
  // Explicitly exclude E2E tests from standard test runs
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/e2e/'
  ],
  verbose: true,
  testTimeout: 30000, // erhöhtes Timeout für API-Aufrufe
}; 