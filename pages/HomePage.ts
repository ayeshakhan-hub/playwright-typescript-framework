import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly categoriesNav: Locator;
  readonly sortDropdown: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Search');
    this.categoriesNav = page.locator('[data-test="nav-categories"]');
    this.sortDropdown = page.getByLabel('sort');
    this.productNames = page.locator('[data-test="product-name"]');
    this.productPrices = page.locator('[data-test="product-price"]');
    this.noResultsMessage = page.getByText('There are no products found.');
  }

  async goto() {
    await this.page.goto('/');
  }

  async search(term: string) {
    await this.productNames.first().waitFor(); // ensure the page has actually rendered before checking for the mobile filters toggle

    const filtersToggle = this.page.getByRole('button', { name: 'Filters' });
    if (await filtersToggle.isVisible()) {
      await filtersToggle.click();
    }

    await this.searchInput.fill(term);
    await this.searchInput.press('Enter');
  }

  async openCategory(categoryLink: string) {
    await this.categoriesNav.click();
    await this.page.getByRole('link', { name: categoryLink }).click();
  }

  async sortBy(option: string) {
    await this.sortDropdown.selectOption(option);
  }

  async filterByBrand(brand: string) {
    await this.page.getByRole('checkbox', { name: brand }).check();
  }

  async unfilterByBrand(brand: string) {
    await this.page.getByRole('checkbox', { name: brand }).uncheck();
  }

  async openFirstProduct() {
    await this.productNames.first().click();
  }
}