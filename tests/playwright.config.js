const { devices } = require('@playwright/test');/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  workers: 1,
  retries: 1,
  //globalSetup: require.resolve('./global-setup'),
  ignoreHTTPSErrors: true,
  /*webServer: {
    command: 'cd ../examples/backend && yarn start',
    url: 'http://localhost:5714',
    timeout: 120 * 1000,
    reuseExistingServer: true,
  },*/
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    storageState: './tests/storage.state.json',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
};

module.exports = config;