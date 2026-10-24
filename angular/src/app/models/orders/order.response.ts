import { OrderItemResponse } from './order-item.response';

export interface OrderResponse {
  id: number;
  total_price: string;
  items?: OrderItemResponse[];
}
