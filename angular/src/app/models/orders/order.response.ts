import { OrderItemResponse } from './order-item.response';

/**
 * Represent an order returned by the API.
 * @property id - Order identifier
 * @property total_price - Total price as a decimal string
 * @property items - Included items, omitted when unavailable
 * @author Oriol Plazas
 * @since 1.0.0
 */
export interface OrderResponse {
  id: number;
  total_price: string;
  items?: OrderItemResponse[];
}
