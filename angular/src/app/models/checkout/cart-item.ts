/**
 * Interface to define a Product in the cart (quantity included)
 * Only for frontend ux-ui display
 */
export interface CartItem {
  id: number;
  name: string;
  price: number;
  stock: number;
  quantity: number;
}
