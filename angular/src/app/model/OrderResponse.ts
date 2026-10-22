import { OrderItemResponse } from './OrderItemResponse';

export interface OrderResponse {
  id: number;
  total_price: string;
  items?: OrderItemResponse[];
}
