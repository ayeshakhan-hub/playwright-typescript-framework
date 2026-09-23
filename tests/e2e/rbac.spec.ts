import { test, expect } from '@playwright/test';

test('customer cannot access the admin dashboard @smoke', async ({ page }) => {
  // runs under the customer storageState already (chromium project)
  await page.goto('/admin/dashboard');
  await expect(page).not.toHaveURL(/admin\/dashboard/);
});