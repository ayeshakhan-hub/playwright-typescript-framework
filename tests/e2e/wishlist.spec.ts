import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';

test('adding a product to favourites shows it in the account favourites list', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();
  await home.openFirstProduct();

  const product = new ProductPage(page);
  const productName = await product.getName();
  await product.addToFavorites();

  await page.goto('/account/favorites');
  await expect(
    page.locator('[data-test="product-name"]', { hasText: productName })
  ).toBeVisible();
});


// import { test, expect } from '@playwright/test';
// import { LoginPage } from '../../pages/LoginPage';
// import { HomePage } from '../../pages/HomePage';
// import { ProductPage } from '../../pages/ProductPage';

// test.beforeEach(async ({ page }) => {
//   const loginPage = new LoginPage(page);
//   await loginPage.goto();
//   await loginPage.login(process.env.CUSTOMER_EMAIL!, process.env.CUSTOMER_PASSWORD!);
//   await expect(page).toHaveURL(/account/);
// });

// test('adding a product to favourites shows it in the account favourites list', async ({ page }) => {
//   const home = new HomePage(page);
//   await home.goto();
//   await home.openFirstProduct();

//   const product = new ProductPage(page);
//   const productName = await product.getName();

//   await product.addToFavorites();

//   await page.goto('/account/favorites');
//   await expect(
//     page.locator('[data-test="product-name"]', { hasText: productName })
//   ).toBeVisible();
// });


