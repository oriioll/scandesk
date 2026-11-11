import { CategoryResponse } from '../categories/category.response';

/**
 * Interface that shows the format of an API response of a product
 * @property id - Product identifier
 * @property barcode - Product barcode
 * @property name - Product name
 * @property price - Product price as a decimal number
 * @property stock - Available stock quantity
 * @property category - Category details, null if uncategorized
 * @author Oriol Plazas
 * @since 1.0.0
 */
export interface ProductResponse {
  id: number;
  barcode: string;
  name: string;
  price: number;
  stock: number;
  category: CategoryResponse | null;
}
