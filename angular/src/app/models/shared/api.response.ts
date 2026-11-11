/**
 * Interface used since the REST API (Laravel)
 * returns also a data: {} field, so can parse and type the response properly
 * although the return uses the same format
 * @template T - Type of the response data
 * @property data - Wrapped API response data
 * @author Oriol Plazas
 * @since 1.0.0
 */
export interface ApiResponse<T> {
  data: T;
}
