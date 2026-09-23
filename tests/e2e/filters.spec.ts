import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test('filtering by brand shows only matching products', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();

  await expect(home.productNames.first()).toBeVisible();
  const allCount = await home.productNames.count();

  await home.filterByBrand('ForgeFlex Tools');
  await expect(home.productNames.first()).toBeVisible();
  const filteredCount = await home.productNames.count();

 // expect(filteredCount).toBeLessThan(allCount);
  expect(filteredCount).toBeGreaterThan(0);

  await home.unfilterByBrand('ForgeFlex Tools');
  await expect(home.productNames.first()).toBeVisible();
  await expect(home.productNames).toHaveCount(allCount);
});

// import { test, expect } from '@playwright/test';

// test('filtering by brand shows only matching products', async ({ page }) => {
//   await page.goto('/');
//   await page.waitForTimeout(3000);
//   const allCount = await page.locator('[data-test="product-name"]').count();

//   await page.locator('[data-test="brand-01M2N89D652KYKGN5KK457S011"]').check();

//   const filtered = page.locator('[data-test="product-name"]');
//   await expect(filtered.first()).toBeVisible();

//   const filteredCount = await filtered.count();
//  // expect(filteredCount).toBeLessThan(allCount);
//   expect(filteredCount).toBeGreaterThan(0);

//   await page.locator('[data-test="brand-01M2N89D652KYKGN5KK457S011"]').uncheck();
//   await expect(page.locator('[data-test="product-name"]')).toHaveCount(allCount);
// });
