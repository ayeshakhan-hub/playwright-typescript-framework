import { test, expect } from '@playwright/test';
import { createMockIdToken } from '../../utils/mock-oauth';

/**
 * SIMULATED FLOW — Toolshop has no real third-party OAuth/OIDC provider.
 * This test illustrates the Authorization Code + OIDC mechanics using a
 * locally-served page and intercepted network calls, not real app behavior.
 */
test.describe('OAuth 2.0 / OIDC (simulated)', () => {
  test('completes a mocked authorization code exchange and receives a valid id_token', async ({ page }) => {
    await page.route('https://mock-oauth-provider.test/token', async (route) => {
      const idToken = createMockIdToken({ sub: 'user-123', email: 'demo.user@example.com' });
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-access-token',
          id_token: idToken,
          token_type: 'Bearer',
          expires_in: 3600,
        }),
      });
    });

    await page.setContent(`
      <button id="login">Sign in with Mock Provider</button>
      <script>
        document.getElementById('login').addEventListener('click', async () => {
          const response = await fetch('https://mock-oauth-provider.test/token', { method: 'POST' });
          const data = await response.json();
          document.title = data.id_token;
        });
      </script>
    `);

    await page.getByRole('button', { name: /sign in with mock provider/i }).click();
    await expect.poll(() => page.title()).not.toBe('');

    const idToken = await page.title();
    const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64url').toString('utf-8'));

    expect(payload.sub).toBe('user-123');
    expect(payload.email).toBe('demo.user@example.com');
    expect(payload.iss).toBe('https://mock-oauth-provider.test');
  });
});