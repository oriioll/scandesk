/**
 * Interface that shows the format of an API response of a dashboard kpi
 */
export interface KPI {
  total_products: number;
  out_of_stock: number;
  low_stock: number;
  today_orders: number;
  today_revenue: number;
}
