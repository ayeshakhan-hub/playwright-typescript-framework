import { test, expect } from '@playwright/test';
import { ApiClient } from '../../api/apiClient';
import { PaymentApi } from '../../api/paymentApi';
import { PaymentMethod, PaymentDetails } from '../../types/payment';

const API_BASE = process.env.API_BASE_URL ?? 'https://api.practicesoftwaretesting.com';

const validPaymentCases: { method: PaymentMethod; details: PaymentDetails }[] = [
  { method: 'credit-card', details: { credit_card_number: '4111-1111-1111-1111', expiration_date: '12/2028', cvv: '123', card_holder_name: 'Ayesha Khan' } },
  { method: 'cash-on-delivery', details: {} },
  { method: 'bank-transfer', details: { bank_name: 'Test Bank', account_name: 'Ayesha Khan', account_number: '123456789' } },
  { method: 'gift-card', details: { gift_card_number: '1234567890123456', validation_code: '1A2B' } },
  { method: 'buy-now-pay-later', details: { monthly_installments: '3' } },
];

for (const { method, details } of validPaymentCases) {
  test(`payment succeeds for ${method}`, async ({ request }) => {
    const paymentApi = new PaymentApi(new ApiClient(request, API_BASE));
    const response = await paymentApi.check({ payment_method: method, payment_details: details });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.message).toBe('Payment was successful');
  });
}

test('investigate: credit card payment with missing required fields', async ({ request }) => {
  const paymentApi = new PaymentApi(new ApiClient(request, API_BASE));
  const response = await paymentApi.check({ payment_method: 'credit-card', payment_details: {} });

  console.log('Status:', response.status(), '| Body:', await response.text());
});