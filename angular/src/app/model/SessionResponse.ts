/**
 * Interface of the response of the API when
 * creating a new pairing session
 */
export interface SessionResponse {
  token_hash: string;
  claimed_at: string;
}
