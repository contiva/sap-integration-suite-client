module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/tests/units/**/*.test.js'
  ],
  verbose: true,
  testTimeout: 30000, // erhöhtes Timeout für API-Aufrufe
}; 