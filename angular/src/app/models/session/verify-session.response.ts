/**
 * Interface of the response of the API when verifying
 * if a session exists via phone
 */
export interface VerifySessionResponse {
  exists: boolean;
  message: string;
}
