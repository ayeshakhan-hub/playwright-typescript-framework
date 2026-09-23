import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('Home navigation', () => {
  test('search bar is visible on load', async ({ page }) => {
   const home = new HomePage(page);
   await home.goto();

  await expect(home.searchInput).toBeVisible();
  });

  test('can navigate to a category from the menu', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.openCategory('Hand Tools');
    await expect(page.getByRole('heading', { name: 'Category: Hand Tools' })).toBeVisible();
  });
});