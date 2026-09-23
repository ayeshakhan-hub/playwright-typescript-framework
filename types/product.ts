export interface Brand {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  sub_categories: Category[];
}

export interface ProductImage {
  by_name: string;
  by_url: string;
  source_name: string;
  source_url: string;
  file_name: string;
  title: string;
  id: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  is_location_offer: boolean;
  is_rental: boolean;
  in_stock: boolean;
  co2_rating: string;
  is_eco_friendly: boolean;
  brand: Brand;
  category: Category;
  product_image: ProductImage;
}

export interface PaginatedProducts {
  current_page: number;
  data: Product[];
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}