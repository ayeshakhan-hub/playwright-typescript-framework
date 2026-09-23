import { test, expect } from '@playwright/test';
import { ApiClient } from '../../api/apiClient';
import { AuthApi } from '../../api/authApi';
import { createExpiredToken } from '../../utils/jwt';

const API_BASE = process.env.API_BASE_URL ?? 'https://api.practicesoftwaretesting.com';

test.describe('Token refresh', () => {
  test('a valid token can be refreshed for a new one', async ({ request }) => {
    const authApi = new AuthApi(new ApiClient(request, API_BASE));

    const loginResponse = await authApi.login({
      email: process.env.ADMIN_EMAIL!,
      password: process.env.ADMIN_PASSWORD!,
    });
    const { access_token } = await loginResponse.json();

    const response = await authApi.refresh(access_token);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('access_token');
    expect(body.token_type.toLowerCase()).toBe('bearer');
    expect(body.expires_in).toBeGreaterThan(0);
  });

  test('refresh fails with an invalid token', async ({ request }) => {
  test.fail(true, 'Known API bug: garbage token returns 500 instead of documented 401 — see BUG-001');

  const authApi = new AuthApi(new ApiClient(request, API_BASE));

  const response = await authApi.refresh('invalid.token.value');
  expect(response.status()).toBe(401);
});

  test('refresh with a well-formed but expired token', async ({ request }) => {
    test.fail(true, 'Known API bug: expired/invalid token returns 500 instead of documented 401 — see BUG-001');

    const authApi = new AuthApi(new ApiClient(request, API_BASE));
    const loginResponse = await authApi.login({
      email: process.env.ADMIN_EMAIL!,
      password: process.env.ADMIN_PASSWORD!,
    });
    const { access_token } = await loginResponse.json();
    const expiredToken = createExpiredToken(access_token);

    const response = await authApi.refresh(expiredToken);
    expect(response.status()).toBe(401);
  });
});