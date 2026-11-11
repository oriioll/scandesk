/**
 * Represent one product and quantity in an order request.
 * @property product_id - Product identifier
 * @property quantity - Requested product quantity
 * @author Oriol Plazas
 * @since 1.0.0
 */
export interface OrderItemRequest {
  product_id: number;
  quantity: number;
}
