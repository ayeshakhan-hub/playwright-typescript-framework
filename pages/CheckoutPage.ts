import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly cartQuantity: Locator;
  readonly linePrice: Locator;

  readonly proceedToSignIn: Locator;
  readonly proceedToBilling: Locator;
  readonly houseNumberInput: Locator;
  readonly proceedToPayment: Locator;
  readonly paymentMethodSelect: Locator;
  readonly confirmButton: Locator;
  readonly paymentSuccessAlert: Locator;
  readonly orderConfirmationMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartQuantity = page.locator('[data-test="cart-quantity"]');
    this.linePrice = page.locator('[data-test="line-price"]').first();
    this.proceedToSignIn = page.locator('[data-test="proceed-1"]');
    this.proceedToBilling = page.locator('[data-test="proceed-2"]');
    this.houseNumberInput = page.getByLabel('House number');
    this.proceedToPayment = page.locator('[data-test="proceed-3"]');
    this.paymentMethodSelect = page.getByLabel('Payment Method');
    this.confirmButton = page.getByRole('button', { name: 'Confirm' });
    this.paymentSuccessAlert = page.getByText(/payment was successful/i);
    this.orderConfirmationMessage = page.getByText(/Thanks for your order! Your invoice number is INV-\d+\./);
  }

  async goto() {
    await this.page.goto('/checkout');
  }

  async setQuantity(index: number, qty: string) {
    const input = this.page.locator('[data-test="product-quantity"]').nth(index);
    await input.fill(qty);
    await input.press('Tab');
  }

  async completeCheckoutUpToConfirmation(paymentMethod: string) {
    await this.proceedToSignIn.click();
    await this.proceedToBilling.click();
    await this.houseNumberInput.fill('12');
    await this.proceedToPayment.click();
    await this.paymentMethodSelect.selectOption(paymentMethod);
    await this.confirmButton.click();
    await this.paymentSuccessAlert.waitFor();
  }
}