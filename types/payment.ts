export type PaymentMethod =
  | 'bank-transfer' | 'cash-on-delivery' | 'credit-card' | 'buy-now-pay-later' | 'gift-card';

export type PaymentDetails = Record<string, string>;

export interface PaymentRequest {
  payment_method: PaymentMethod;
  payment_details: PaymentDetails;
}