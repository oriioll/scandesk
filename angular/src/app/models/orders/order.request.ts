import { OrderItemRequest } from './order-item.request';

/**
 * Represent the payload for creating an order.
 * @property items - Product and quantity entries
 * @author Oriol Plazas
 * @since 1.0.0
 */
export interface OrderRequest {
  items: OrderItemRequest[];
}
