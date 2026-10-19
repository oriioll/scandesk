/**
 * Interface of product to API request
 */
export interface ProductRequest {
  barcode: string;
  name: string;
  category_id: string;
  price: number;
  stock: number;
}
