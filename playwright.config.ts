import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',

  // Run test files in parallel with each other.
  fullyParallel: true,

  // Fail the CI build if someone commits a test.only
  forbidOnly: !!process.env.CI,

  // Flaky tests get a second chance in CI only.
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: process.env.BASE_URL ?? 'https://practicesoftwaretesting.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Cap how long a single action (click, fill) may wait.
    actionTimeout: 10_000,
  },


  projects: [
  { name: 'setup', testMatch: /auth\.setup\.ts/ },

  {
    name: 'api',
    testDir: './tests/api',
    // No dependency on 'setup' — these tests authenticate themselves via AuthApi.login()
    // or need no auth at all, so they never touch a browser or Cloudflare's challenge.
  },

  {
    name: 'chromium',
    testDir: './tests/e2e',
    use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
    dependencies: ['setup'],
  },
  {
    name: 'firefox',
    testDir: './tests/e2e',
    use: { ...devices['Desktop Firefox'], storageState: 'playwright/.auth/user.json' },
    dependencies: ['setup'],
    grep: /@smoke/,
  },
  {
    name: 'webkit',
    testDir: './tests/e2e',
    use: { ...devices['Desktop Safari'], storageState: 'playwright/.auth/user.json' },
    dependencies: ['setup'],
    grep: /@smoke/,
  },
  {
    name: 'mobile-chrome',
    testDir: './tests/e2e',
    use: { ...devices['Pixel 5'], storageState: 'playwright/.auth/user.json' },
    dependencies: ['setup'],
    grep: /@smoke/,
  },
],
});