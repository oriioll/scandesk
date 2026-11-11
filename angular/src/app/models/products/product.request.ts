/**
 * Interface of product to API request
 * @property barcode - Product barcode
 * @property name - Product name
 * @property category_id - Category identifier
 * @property price - Product price as a decimal number
 * @property stock - Available stock quantity
 * @author Oriol Plazas
 * @since 1.0.0
 */
export interface ProductRequest {
  barcode: string;
  name: string;
  category_id: number;
  price: number;
  stock: number;
}
