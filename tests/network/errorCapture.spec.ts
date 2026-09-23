import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test('investigate: what happens when products API returns a server error', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));

  await page.route('**/products*', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Internal Server Error' }),
    });
  });

  const home = new HomePage(page);
  await home.goto();

  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'test-results/server-error-debug.png', fullPage: true });
  console.log('Captured errors:', errors);
});