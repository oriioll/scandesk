/**
 * Interface that shows the format of an API response of the stats for the doughnut graph
 *
 * @property categoryId - Id of the category
 * @property categoryName - Name of the category
 * @property total_products - Number of product for the category
 * @author Oriol Plazas
 * @since 1.0.0
 */
export interface DoughnutGraph {
  categoryId: number;
  categoryName: string;
  total_products: number;
}
