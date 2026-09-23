import { Page, Locator } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly unitPrice: Locator;
  readonly addToCartButton: Locator;
  readonly addToFavoritesButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
    this.unitPrice = page.locator('[data-test="unit-price"]');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.addToFavoritesButton = page.getByRole('button', { name: /add to favorites|favourite/i });
  }

 async getName(): Promise<string> {
  return this.heading.evaluate(el => {
    return Array.from(el.childNodes)
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent ?? '')
      .join('')
      .trim();
  });
}

  async addToCart() {
    await this.addToCartButton.click();
  }

  async addToFavorites() {
    await this.addToFavoritesButton.click();
  }
}