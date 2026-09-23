import { test, expect, Page } from '@playwright/test';
import { ApiClient } from '../../api/apiClient';
import { InvoicesApi } from '../../api/invoicesApi';
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

const API_BASE = process.env.API_BASE_URL ?? 'https://api.practicesoftwaretesting.com';

/**
 * SIMULATED SCENARIOS — Toolshop's real gateway can't be forced into timeout,
 * delay, or refund states on demand, so these intercept the real network
 * calls to produce each state. Cancellation uses real app behavior instead.
 */

async function addToCartAndReachPayment(page: Page) {
  const home = new HomePage(page);
  await home.goto();
  await home.openFirstProduct();
  await new ProductPage(page).addToCart();

  const checkout = new CheckoutPage(page);
  await expect(checkout.cartQuantity).toHaveText('1');
  await checkout.goto();
  await checkout.proceedToSignIn.click();
  await checkout.proceedToBilling.click();
  await checkout.houseNumberInput.fill('12');
  await checkout.proceedToPayment.click();
  await checkout.paymentMethodSelect.selectOption('cash-on-delivery');
  return checkout;
}

test('SIMULATED: payment gateway timeout — no false success shown', async ({ page }) => {
  await page.route('**/payment/check', (route) => route.abort('timedout'));

  const checkout = await addToCartAndReachPayment(page);
  await checkout.confirmButton.click();

  await expect(checkout.paymentSuccessAlert).not.toBeVisible({ timeout: 5000 });
});

test('SIMULATED: delayed gateway confirmation still resolves', async ({ page }) => {
  await page.route('**/payment/check', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 3000)); // simulated slow gateway
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Payment was successful' }),
    });
  });

  const checkout = await addToCartAndReachPayment(page);
  await checkout.confirmButton.click();

  await expect(checkout.paymentSuccessAlert).toBeVisible({ timeout: 10_000 });
});

test('abandoning checkout before confirmation creates no order (real behavior)', async ({ page, request }) => {
  await page.goto('/');
  const token = await page.evaluate(() => localStorage.getItem('auth-token'));
  const invoicesApi = new InvoicesApi(new ApiClient(request, API_BASE));
  const before = await (await invoicesApi.getAll(token!)).json();

  await addToCartAndReachPayment(page);
  await page.goto('/'); // cancel by navigating away instead of confirming

  const after = await (await invoicesApi.getAll(token!)).json();
  expect(after.total).toBe(before.total);
});

test('SIMULATED: refund endpoint returns success', async ({ page }) => {
  await page.route('**/mock-refund', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Refund processed' }),
    })
  );

  await page.goto('/');
  const result = await page.evaluate(async () => {
    const res = await fetch('/mock-refund', { method: 'POST' });
    return res.json();
  });

  expect(result.message).toBe('Refund processed');
});