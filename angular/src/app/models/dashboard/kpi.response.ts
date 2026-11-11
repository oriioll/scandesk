/**
 * Interface that shows the format of an API response of a dashboard kpi
 *
 * @property total_products - Count of user products
 * @property out_of_stock - Count of products with no stock
 * @property low_stock - Count of products with low stock
 * @property today_orders - Count of today's orders
 * @property today_revenue - Today's revenue as a decimal number
 * @author Oriol Plazas
 * @since 1.0.0
 */
export interface KPI {
  total_products: number;
  out_of_stock: number;
  low_stock: number;
  today_orders: number;
  today_revenue: number;
}
