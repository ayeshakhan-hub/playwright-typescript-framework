import { ApiClient } from './apiClient';

export class InvoicesApi {
  constructor(private client: ApiClient) {}

  getAll(token: string) {
    return this.client.get('/invoices', token);
  }
}