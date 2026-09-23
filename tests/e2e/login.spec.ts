import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { loadCredentials } from '../../data/session-store';

test.describe('Login', () => {
  test('valid credentials log the user in @smoke', async ({ page }) => {
    const { email, password } = loadCredentials();

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(email, password);

    await expect(page).toHaveURL(/account/);
        await expect(page.getByRole('heading', { name: 'My account' })).toBeVisible();
  });

  test('invalid credentials show an error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('wrong@example.com', 'wrongpassword123');

    await expect(page.getByText(/invalid/i)).toBeVisible();
  });
});