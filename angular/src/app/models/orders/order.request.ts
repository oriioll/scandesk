import { OrderItemRequest } from './order-item.request';

export interface OrderRequest {
  items: OrderItemRequest[];
}
