/**
 * Interface to get the API response when creating or logging in a user
 * @property message - Result message
 * @property access_token - Issued access token
 * @property token_type - Authentication token type
 * @author Oriol Plazas
 * @since 1.0.0
 */
export interface TokenResponse {
  message: string;
  access_token: string;
  token_type: string;
}
