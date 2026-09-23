// fixtures/auth.fixture.ts — extended
import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { createTestUser, TestUser } from '../data/user-factory';

type AuthFixtures = {
  loggedInPage: void;
  newUser: TestUser;
};

export const test = base.extend<AuthFixtures>({
  newUser: async ({}, use) => {
    const user = createTestUser();
    await use(user);
  },

  loggedInPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.CUSTOMER_EMAIL!, process.env.CUSTOMER_PASSWORD!);
    await expect(page).toHaveURL(/account/);
    await use();
  },
});

export { expect };