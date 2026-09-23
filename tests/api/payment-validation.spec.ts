import { test, expect } from '@playwright/test';
import { ApiClient } from '../../api/apiClient';
import { PaymentApi } from '../../api/paymentApi';
import { PaymentMethod, PaymentDetails } from '../../types/payment';

const API_BASE = process.env.API_BASE_URL ?? 'https://api.practicesoftwaretesting.com';

interface InvalidCase {
  description: string;
  method: PaymentMethod;
  details: PaymentDetails;
}

const invalidGiftCardCases: InvalidCase[] = [
  { description: 'number too short (15 chars)', method: 'gift-card', details: { gift_card_number: '123456789012345', validation_code: '1A2B' } },
  { description: 'number too long (17 chars)', method: 'gift-card', details: { gift_card_number: '12345678901234567', validation_code: '1A2B' } },
  { description: 'number contains a special character', method: 'gift-card', details: { gift_card_number: '12345678901234!@', validation_code: '1A2B' } },
  { description: 'validation code too short (3 chars)', method: 'gift-card', details: { gift_card_number: '1234567890123456', validation_code: 'A2B' } },
  { description: 'validation code too long (5 chars)', method: 'gift-card', details: { gift_card_number: '1234567890123456', validation_code: '1A2B3' } },
];

const invalidCreditCardCases: InvalidCase[] = [
  { description: 'card number missing dashes', method: 'credit-card', details: { credit_card_number: '4111111111111111', expiration_date: '12/2028', cvv: '123', card_holder_name: 'Ayesha Khan' } },
  { description: 'expiration date in the past', method: 'credit-card', details: { credit_card_number: '4111-1111-1111-1111', expiration_date: '01/2020', cvv: '123', card_holder_name: 'Ayesha Khan' } },
  { description: 'expiration date wrong format (MM/YY)', method: 'credit-card', details: { credit_card_number: '4111-1111-1111-1111', expiration_date: '12/28', cvv: '123', card_holder_name: 'Ayesha Khan' } },
  { description: 'CVV contains letters', method: 'credit-card', details: { credit_card_number: '4111-1111-1111-1111', expiration_date: '12/2028', cvv: 'AB1', card_holder_name: 'Ayesha Khan' } },
  { description: 'card holder name contains numbers', method: 'credit-card', details: { credit_card_number: '4111-1111-1111-1111', expiration_date: '12/2028', cvv: '123', card_holder_name: 'Ayesha2 Khan' } },
];

const invalidBankTransferCases: InvalidCase[] = [
  { description: 'bank name contains numbers', method: 'bank-transfer', details: { bank_name: 'Test Bank1', account_name: 'Ayesha Khan', account_number: '123456789' } },
  { description: 'account number contains letters', method: 'bank-transfer', details: { bank_name: 'Test Bank', account_name: 'Ayesha Khan', account_number: '12345A789' } },
];

const allInvalidCases = [...invalidGiftCardCases, ...invalidCreditCardCases, ...invalidBankTransferCases];

for (const { description, method, details } of allInvalidCases) {
  test(`rejects invalid ${method} payload — ${description}`, async ({ request }) => {
    const paymentApi = new PaymentApi(new ApiClient(request, API_BASE));
    const response = await paymentApi.check({ payment_method: method, payment_details: details });

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.message).toBe('Resource not found');
  });
}