/**
 * Interface of the response of the API when
 * creating a new pairing session
 * @property token_hash - Pairing session token
 * @property claimed_at - Session claim timestamp
 * @author Oriol Plazas
 * @since 1.0.0
 */
export interface SessionResponse {
  token_hash: string;
  claimed_at: string;
}
