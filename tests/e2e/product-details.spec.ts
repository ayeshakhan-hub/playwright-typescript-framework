import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';

test('viewing a product shows its details', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();
  await home.openFirstProduct();

  const product = new ProductPage(page);
  await expect(product.heading).toBeVisible();
  await expect(product.unitPrice).toBeVisible();
  await expect(product.addToCartButton).toBeEnabled();
});

test('unit price on the detail page is unaffected by adding to cart', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();
  await home.openFirstProduct();

  const product = new ProductPage(page);
  const priceBefore = await product.unitPrice.textContent();
  await product.addToCart();

  expect(await product.unitPrice.textContent()).toBe(priceBefore);
});