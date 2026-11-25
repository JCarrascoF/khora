import { defineConfig, devices } from '@playwright/test';

const PORT = 18181;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'mobile-chromium',
      use: {
        ...devices['Pixel 7'],
        viewport: { width: 390, height: 844 },
        hasTouch: true,
        isMobile: true
      }
    },
    {
      name: 'desktop-chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 }
      }
    }
  ],
  webServer: {
    command: `PORT=${PORT} HOST=127.0.0.1 ENABLE_SQLITE_DB=false AUTH_PASSWORD= node --no-warnings server/server.js --no-cache`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 15000
  }
});
