import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { createTestUser } from '../data/user-factory';
import { saveCredentials } from '../data/session-store';
import { ApiClient } from '../api/apiClient';
import { AuthApi } from '../api/authApi';

const authFile = 'playwright/.auth/user.json';
const API_BASE = process.env.API_BASE_URL ?? 'https://api.practicesoftwaretesting.com';

setup('authenticate', async ({ page, request }) => {
  const user = createTestUser();

  const authApi = new AuthApi(new ApiClient(request, API_BASE));
  const registerResponse = await authApi.register({
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    password: user.password,
    phone: user.phone,
    dob: user.dob,
    address: {
      street: user.street,
      house_number: user.houseNumber,
      city: user.city,
      state: user.state,
      country: user.country,
      postal_code: user.postalCode,
    },
  });
  expect(registerResponse.status()).toBe(201);

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(user.email, user.password);
  await expect(page).toHaveURL(/account/);

  await page.context().storageState({ path: authFile });
  saveCredentials({ email: user.email, password: user.password });
});