/**
 * Interface used since the REST API (Laravel)
 * returns also a data: {} field, so can parse and type the response properly
 * although the return uses the same format
 */
export interface ApiResponse<T> {
  data: T;
}
