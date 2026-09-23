import { test, expect } from '@playwright/test';
import { ApiClient } from '../../api/apiClient';
import { InvoicesApi } from '../../api/invoicesApi';
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

const API_BASE = process.env.API_BASE_URL ?? 'https://api.practicesoftwaretesting.com';

test('completes checkout successfully with cash on delivery @smoke', async ({ page, request }) => {
  await page.goto('/');
  const token = await page.evaluate(() => localStorage.getItem('auth-token'));
  const invoicesApi = new InvoicesApi(new ApiClient(request, API_BASE));
  const before = await (await invoicesApi.getAll(token!)).json();

  const home = new HomePage(page);
  await home.goto();
  await home.openFirstProduct();
  const product = new ProductPage(page);
  await product.addToCart();

  const checkout = new CheckoutPage(page);
  await expect(checkout.cartQuantity).toHaveText('1');
  await checkout.goto();
  await checkout.completeCheckoutUpToConfirmation('cash-on-delivery');
  await checkout.confirmButton.click();

  await expect(checkout.orderConfirmationMessage).toBeVisible();

  const after = await (await invoicesApi.getAll(token!)).json();
  console.log('Happy-path invoice diff:', after.total - before.total);
});

test('BUG-003: double-clicking Confirm creates a duplicate order', async ({ page, request }) => {
    test.fail(true, 'Confirmed: a single, normal checkout correctly creates one invoice. But rapid/repeated clicks on the Confirm button (no debounce or disable-after-click) each independently create a new invoice — 3 rapid clicks produced 3 invoices in testing. See BUG-003.');

    await page.goto('/');
    const token = await page.evaluate(() => localStorage.getItem('auth-token'));

    const invoicesApi = new InvoicesApi(new ApiClient(request, API_BASE));
    const before = await (await invoicesApi.getAll(token!)).json();

    const home = new HomePage(page);
    await home.goto();
    await home.openFirstProduct();
    await new ProductPage(page).addToCart();

    const checkout = new CheckoutPage(page);
    await expect(checkout.cartQuantity).toHaveText('1');
    await checkout.goto();
    await checkout.completeCheckoutUpToConfirmation('cash-on-delivery');

    await Promise.all([
        checkout.confirmButton.click(),
        checkout.confirmButton.click(),
    ]);

    const after = await (await invoicesApi.getAll(token!)).json();
    console.log(after.total - before.total);
    expect(after.total - before.total).toBe(1);
});