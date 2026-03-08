import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 30_000 },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  workers: 1,

  reporter: [['html', { open: 'never', outputFolder: 'playwright-report' }]],

  use: {
    baseURL: process.env.WIKI_BASE_URL || 'https://en.wikipedia.org',
    headless: process.env.HEADLESS !== 'false',
    locale: 'en-US',
    timezoneId: 'Europe/Berlin',
    actionTimeout: 30_000,
    navigationTimeout: 60_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'on',
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  outputDir: 'test-results',
});
