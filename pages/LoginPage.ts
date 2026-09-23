import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/auth/login');
  }

  async login(email: string, password: string) {
    await this.page.getByPlaceholder('Your email').fill(email);
    await this.page.getByPlaceholder('Your password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
}