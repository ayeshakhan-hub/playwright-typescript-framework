import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test('UI shows a clear message when there are no products', async ({ page }) => {
  await page.route('**/products*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        current_page: 1, data: [], from: null, last_page: 1, per_page: 9, to: null, total: 0,
      }),
    });
  });

  const home = new HomePage(page);
  await home.goto();

  await expect(home.noResultsMessage).toBeVisible();
});

test('BUG-002: no error state shown when the products API fails — stuck on loading skeletons', async ({ page }) => {
  test.fail(true, 'Known issue: /products returning a server error leaves the UI on loading skeletons indefinitely, with no error message or retry option. See BUG-002.');

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

  await expect(page.getByText(/error|something went wrong|try again/i)).toBeVisible({ timeout: 5000 });
});