/**
 * Represent an order item returned by the API.
 * @property id - Order item identifier
 * @property product_id - Referenced product identifier
 * @property quantity - Ordered product quantity
 * @property unit_price - Unit price as a decimal string
 * @property product_name - Product name at purchase
 * @author Oriol Plazas
 * @since 1.0.0
 */
export interface OrderItemResponse {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: string;
  product_name: string;
}
