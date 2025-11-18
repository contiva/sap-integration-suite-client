module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/units/**/*.test.js',
    '**/tests/integration/**/*.test.js'
  ],
  verbose: true,
  testTimeout: 30000, // erhöhtes Timeout für API-Aufrufe
}; 