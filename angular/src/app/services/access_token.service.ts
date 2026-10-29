import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AccessTokenService {
  /**
   * Stores an access_token in local storage
   * @param token The token to store
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
   */
  public getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * removes the current token, usefull when loging out
   */
  public clearToken() {
    localStorage.removeItem('access_token');
  }
}
