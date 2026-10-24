import { CategoryResponse } from '../categories/category.response';

/**
 * Interface that shows the format of an API response of a product
 */
export interface ProductResponse {
  id: number;
  barcode: string;
  name: string;
  price: number;
  stock: number;
  category: CategoryResponse;
}
