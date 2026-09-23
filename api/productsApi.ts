//product-related endpoints

import { ApiClient } from './apiClient';

export class ProductsApi {
  constructor(private client: ApiClient) {}

  getAll() {
    return this.client.get('/products');
  }

  getById(id: string) {
    return this.client.get(`/products/${id}`);
  }
}