import { test, expect } from '@playwright/test';
import { decodeJwt, createExpiredToken } from '../../utils/jwt';
import { LoginPage } from '../../pages/LoginPage';

test('logged-in user receives a valid JWT with expected claims', async ({ page }) => {
await page.goto('/');   // ← add this

  const token = await page.evaluate(() => localStorage.getItem('auth-token'));
  expect(token).toBeTruthy();

  const decoded = decodeJwt(token!);

  expect(decoded.role).toBe('user');
  expect(decoded.sub).toBeTruthy();
  expect(decoded.exp).toBeGreaterThan(decoded.iat);

  const lifetimeSeconds = decoded.exp - decoded.iat;
  expect(lifetimeSeconds).toBe(300);
});

test('admin login receives a JWT with the admin role', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(process.env.ADMIN_EMAIL!, process.env.ADMIN_PASSWORD!);
  await expect(page).toHaveURL(/admin\/dashboard/);   // ← fixed

  const token = await page.evaluate(() => localStorage.getItem('auth-token'));
  const decoded = decodeJwt(token!);

  expect(decoded.role).toBe('admin');
});

test('an expired token no longer grants access to the account area', async ({ page }) => {
    await page.goto('/');
   
    const validToken = await page.evaluate(() => localStorage.getItem('auth-token'));
    const expiredToken = createExpiredToken(validToken!);
   
    await page.evaluate((token) => localStorage.setItem('auth-token', token), expiredToken);

    await page.goto('/account');

    await expect(page).toHaveURL(/login/);
});