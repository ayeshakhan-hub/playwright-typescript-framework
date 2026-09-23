// shared setup: base URL, auth header helper

import { APIRequestContext } from '@playwright/test';

export class ApiClient {
  constructor(private request: APIRequestContext, private baseUrl: string) {}

  authHeader(token: string) {
    return { Authorization: `Bearer ${token}` };
  }

  get(path: string, token?: string) {
    return this.request.get(`${this.baseUrl}${path}`, {
      headers: token ? this.authHeader(token) : undefined,
    });
  }

  post(path: string, data: object, token?: string) {
    return this.request.post(`${this.baseUrl}${path}`, {
      data,
      headers: token ? this.authHeader(token) : undefined,
    });
  }
}