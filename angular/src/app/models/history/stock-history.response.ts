import { HistoryAction } from './history-action.enum';

/**
 * Representation of a stock history entry returned by the API.
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
