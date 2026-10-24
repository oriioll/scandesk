/**
 * Interface of product to API request
 */
export interface ProductRequest {
  barcode: string;
  name: string;
  category_id: number;
  price: number;
  stock: number;
}
