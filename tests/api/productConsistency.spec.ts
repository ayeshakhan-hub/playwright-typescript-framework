import { test, expect } from '@playwright/test';
import { ApiClient } from '../../api/apiClient';
import { ProductsApi } from '../../api/productsApi';
import { PaginatedProducts } from '../../types/product';
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';

const API_BASE = process.env.API_BASE_URL ?? 'https://api.practicesoftwaretesting.com';

test('product name and price in the UI match the API', async ({ page, request }) => {
  const productsApi = new ProductsApi(new ApiClient(request, API_BASE));
  const body: PaginatedProducts = await (await productsApi.getAll()).json();
  const apiProduct = body.data[0];

  const home = new HomePage(page);
  await home.goto();
  await home.search(apiProduct.name);
  await home.productNames.first().click();

  const product = new ProductPage(page);
  const uiName = await product.getName();
  const uiPriceText = await product.unitPrice.textContent();
  const uiPrice = parseFloat(uiPriceText!.replace(/[^0-9.]/g, ''));

  expect(uiName).toBe(apiProduct.name);
  expect(uiPrice).toBe(apiProduct.price);
});