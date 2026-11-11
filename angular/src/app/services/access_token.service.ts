import { Injectable } from '@angular/core';

/**
 * Store and retrieve the current access token.
 * @author Oriol Plazas
 * @since 1.0.0
 */
@Injectable({
  providedIn: 'root',
})
export class AccessTokenService {
  // --- Public API ---
  /**
   * Stores an access_token in local storage
   * @param token - Access token to store
   * @returns void
   * @author Oriol Plazas
   * @since 1.0.0
   */
  public storeToken(token: string) {
    //Remove old token if exists
    if (!this.getToken()) {
      localStorage.removeItem('access_token');
    }
    localStorage.setItem('access_token', token);
  }

  /**
   * Checks if an access_token exists
   * @returns token or null
   * @author Oriol Plazas
   * @since 1.0.0
   */
  public getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * removes the current token, usefull when loging out
   * @returns void
   * @author Oriol Plazas
   * @since 1.0.0
   */
  public clearToken() {
    localStorage.removeItem('access_token');
  }
}
