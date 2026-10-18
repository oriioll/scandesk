/**
 * Interface of Requests to ws server when sending a barcode scanned
 * @field barcode - The barcode scanned
 * @field sessionToken - The token of the session so ws knows who to send the barcode
 */
export interface BarcodeScannedRequest {
  barcode: string;
  sessionToken: string;
}
