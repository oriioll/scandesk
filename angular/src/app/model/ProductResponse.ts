import { CategoryResponse } from './CategoryResponse';

export interface ProductResponse {
  id: number;
  barcode: string;
  name: string;
  price: number;
  stock: number;
  category: CategoryResponse;
}
