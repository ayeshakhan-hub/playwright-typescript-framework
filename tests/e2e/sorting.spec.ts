import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test('sorting by price low to high orders products correctly', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();
  await home.sortBy('price,asc');

  await expect(home.productPrices.first()).toBeVisible();

  await expect.poll(async () => {
    const texts = await home.productPrices.allTextContents();
    const prices = texts.map(t => parseFloat(t.replace(/[^0-9.]/g, '')));
    const sorted = [...prices].sort((a, b) => a - b);
    return JSON.stringify(prices) === JSON.stringify(sorted);
  }, { timeout: 5_000, message: 'product list did not finish sorting' }).toBe(true);
});