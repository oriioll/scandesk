/**
 * Interface of the response of the API when verifying
 * if a session exists via phone
 * @property exists - Whether the session exists
 * @property message - Verification result message
 * @author Oriol Plazas
 * @since 1.0.0
 */
export interface VerifySessionResponse {
  exists: boolean;
  message: string;
}
