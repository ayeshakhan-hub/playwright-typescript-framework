//login/register/refresh (formalizing what refresh-token.spec.ts already does)import { ApiClient } from './apiClient';

import { ApiClient } from './apiClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone?: string;
  dob?: string;
  address?: {
    street?: string;
    house_number?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
  };
}

export class AuthApi {
  constructor(private client: ApiClient) {}

  login(credentials: LoginCredentials) {
    return this.client.post('/users/login', credentials);
  }

  refresh(token: string) {
    return this.client.get('/users/refresh', token);
  }

  register(payload: RegisterPayload) {
    return this.client.post('/users/register', payload);
  }
}