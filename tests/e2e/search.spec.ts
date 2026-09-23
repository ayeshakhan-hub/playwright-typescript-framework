import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test('searching for a product shows matching results @smoke', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();
  await home.search('hammer');

  await expect(home.productNames.first()).toBeVisible();

  const names = (await home.productNames.allTextContents()).map(n => n.trim());
  expect(names.length).toBeGreaterThan(0);

  // At least one result should be the thing we searched for.
  expect(names.some(name => name.toLowerCase().includes('hammer'))).toBe(true);
  
});

test('searching for nonsense shows no results message', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();
  await home.search('zzzznotarealproduct');

  await expect(home.noResultsMessage).toBeVisible();
});