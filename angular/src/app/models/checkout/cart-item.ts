/**
 * Interface to define a Product in the cart (quantity included)
 * Only for frontend ux-ui display
 * @property id - Product identifier
 * @property name - Product name
 * @property price - Unit price as a decimal number
 * @property stock - Available stock quantity
 * @property quantity - Quantity selected for the cart
 * @author Oriol Plazas
 * @since 1.0.0
 */
export interface CartItem {
  id: number;
  name: string;
  price: number;
  stock: number;
  quantity: number;
}
