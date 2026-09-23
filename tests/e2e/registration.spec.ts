import { test, expect } from '@playwright/test';
import { createTestUser } from '../../data/user-factory';
import { RegisterPage } from '../../pages/RegisterPage';
import { LoginPage } from '../../pages/LoginPage';


  test('registering a new account then logging in', async ({ page }) => {
    const user = createTestUser();
    const registerPage = new RegisterPage(page);

    await registerPage.goto();
    await registerPage.register(user);

    await expect(page).toHaveURL(/login/);

  const loginPage = new LoginPage(page);
  await loginPage.login(user.email, user.password);

  await expect(page).toHaveURL(/account/);
  await expect(page.getByRole('heading', { name: 'My account' })).toBeVisible()
  });
