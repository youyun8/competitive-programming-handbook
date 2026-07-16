import { defineConfig, devices } from '@playwright/test';

const basePath = process.env.PUBLIC_BASE_PATH ?? '/algorithm-handbook';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://127.0.0.1:4321${basePath}/`,
    trace: 'retain-on-failure'
  },
  webServer: {
    command: `PUBLIC_BASE_PATH=${basePath} pnpm dev --host 127.0.0.1`,
    url: `http://127.0.0.1:4321${basePath}/`,
    reuseExistingServer: !process.env.CI
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } }
  ]
});
