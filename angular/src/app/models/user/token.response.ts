/**
 * Interface to get the API response when creating or logging in a user
 */
export interface TokenResponse {
  message: string;
  access_token: string;
  token_type: string;
}
