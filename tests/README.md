# SAP Integration Suite Client Tests

This directory contains test files for verifying the functionality of the SAP Integration Suite Client.

## Connection Test

The connection test verifies that your SAP connection parameters are valid and that you can successfully connect to the SAP system and fetch packages.

### Requirements

- Valid SAP connection parameters in your `.env` file:
  - `SAP_BASE_URL`
  - `SAP_OAUTH_CLIENT_ID`
  - `SAP_OAUTH_CLIENT_SECRET`
  - `SAP_OAUTH_TOKEN_URL`

### Running the Connection Test

You can run the connection test with:

```bash
npm run test:connection
```

This test will:
1. Initialize the SAP client using your `.env` configuration
2. Attempt to authenticate with the SAP system
3. Fetch integration packages to verify connectivity
4. Display the number of packages found and the first 5 package names

### Build Verification

You can use the verify script to build the project and then run the connection test:

```bash
npm run verify
```

This is useful to ensure that both:
1. The project builds successfully
2. The built client can successfully connect to your SAP system

### Using in CI/CD

This test can be incorporated into CI/CD pipelines to verify that any changes to the client don't break SAP connectivity.

Example GitHub Actions step:

```yaml
- name: Verify SAP Connection
  run: npm run verify
  env:
    SAP_BASE_URL: ${{ secrets.SAP_BASE_URL }}
    SAP_OAUTH_CLIENT_ID: ${{ secrets.SAP_OAUTH_CLIENT_ID }}
    SAP_OAUTH_CLIENT_SECRET: ${{ secrets.SAP_OAUTH_CLIENT_SECRET }}
    SAP_OAUTH_TOKEN_URL: ${{ secrets.SAP_OAUTH_TOKEN_URL }}
``` 