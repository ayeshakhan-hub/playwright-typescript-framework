import { test, expect } from '@playwright/test';
import { ApiClient } from '../../api/apiClient';
import { ProductsApi } from '../../api/productsApi';
import { PaginatedProducts, Product } from '../../types/product';

const API_BASE = process.env.API_BASE_URL ?? 'https://api.practicesoftwaretesting.com';

test.describe('Products API', () => {
  test('GET /products returns a paginated list with well-formed products', async ({ request }) => {
    const productsApi = new ProductsApi(new ApiClient(request, API_BASE));

    const response = await productsApi.getAll();
    expect(response.status()).toBe(200);

    const body: PaginatedProducts = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.total).toBeGreaterThanOrEqual(body.data.length);

    const product = body.data[0];
    expect(typeof product.id).toBe('string');
    expect(typeof product.name).toBe('string');
    expect(typeof product.price).toBe('number');
    expect(product.brand).toHaveProperty('name');
    expect(product.category).toHaveProperty('name');
  });

  test('GET /products/{id} returns full details for a real product', async ({ request }) => {
    const productsApi = new ProductsApi(new ApiClient(request, API_BASE));

    const list: PaginatedProducts = await (await productsApi.getAll()).json();
    const knownId = list.data[0].id;

    const response = await productsApi.getById(knownId);
    expect(response.status()).toBe(200);

    const product: Product = await response.json();
    expect(product.id).toBe(knownId);
    expect(typeof product.description).toBe('string');
    expect(product.product_image).toHaveProperty('file_name');
  });

  test('GET /products/{id} with an invalid id returns 404', async ({ request }) => {
    const productsApi = new ProductsApi(new ApiClient(request, API_BASE));

    const response = await productsApi.getById('not-a-real-id');
    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body.message).toBe('Requested item not found');
  });

    test('boolean-typed fields are genuinely booleans at runtime', async ({ request }) => {
        const productsApi = new ProductsApi(new ApiClient(request, API_BASE));
        const body: PaginatedProducts = await (await productsApi.getAll()).json();
        const product = body.data[0];

        expect(typeof product.is_rental).toBe('boolean');
        expect(typeof product.in_stock).toBe('boolean');
        expect(typeof product.is_location_offer).toBe('boolean');
    });
});