import { HistoryAction } from './history-action.enum';

/**
 * Representation of a stock history entry returned by the API.
 * @property id - History entry identifier
 * @property product - Product summary with id and name
 * @property field - Changed product field
 * @property operation - Recorded history operation
 * @property old_value - Previous value, null if unavailable
 * @property new_value - Updated value, null if unavailable
 * @property created_at - Creation timestamp, omitted if unavailable
 * @author Oriol Plazas
 * @since 1.0.0
 */
export interface StockHistoryResponse {
  id: number;
  product: {
    id: string;
    name: string;
  };
  field: string;
  operation: HistoryAction;
  old_value: string | null;
  new_value: string | null;
  created_at?: string;
}
