import { ApiClient } from './apiClient';
import { PaymentRequest } from '../types/payment';

export class PaymentApi {
  constructor(private client: ApiClient) {}

  check(payload: PaymentRequest) {
    return this.client.post('/payment/check', payload);
  }
}