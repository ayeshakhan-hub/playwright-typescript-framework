// import { test, expect } from '@playwright/test';
// import { HomePage } from '../../pages/HomePage';
// import { ProductPage } from '../../pages/ProductPage';
// import { CheckoutPage } from '../../pages/CheckoutPage';

// test('adding a product to cart updates the cart and badge', async ({ page }) => {
//   const home = new HomePage(page);
//   await home.goto();
//   await home.openFirstProduct();

//   const product = new ProductPage(page);
//   const productName = await product.getName().textContent();
//   await product.addToCart();

//   const checkout = new CheckoutPage(page);
//   await expect(checkout.cartQuantity).toHaveText('1');

//   await page.goto('/checkout');
//   await expect(page.locator('[data-test="product-title"]', { hasText: productName!.trim() })).toBeVisible();
// });

// test('increasing quantity in cart updates the line total', async ({ page }) => {
//   await page.goto('/');
//   await page.locator('[data-test="product-name"]').first().click();
//   await page.locator('[data-test="add-to-cart"]').click();

//   await page.goto('/checkout');
//   const qtyInput = page.locator('[data-test="product-quantity"]').first();
//   await qtyInput.fill('3');
//   await qtyInput.press('Tab');

//   await expect(page.locator('[data-test="line-price"]').first()).not.toHaveText('0');
// });


import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test('adding a product to cart updates the cart and badge @smoke', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();
  await home.openFirstProduct();

  const product = new ProductPage(page);
  const productName = await product.getName();
  await product.addToCart();

  const checkout = new CheckoutPage(page);
  await expect(checkout.cartQuantity).toHaveText('1');

  await checkout.goto();
  await expect(
    page.locator('[data-test="product-title"]', { hasText: productName })
  ).toBeVisible();
});

test('increasing quantity in cart updates the line total', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();
  await home.openFirstProduct();

  const product = new ProductPage(page);
  await product.addToCart();

  const checkout = new CheckoutPage(page);
  await expect(checkout.cartQuantity).toHaveText('1');   // ← add this line

  await checkout.goto();
  const priceBefore = await checkout.linePrice.textContent();
  await checkout.setQuantity(0, '3');
  await expect(checkout.linePrice).not.toHaveText(priceBefore ?? '');
});