import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionResponse } from '../models/session/session.response';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models/shared/api.response';
import { environment } from '../../environments/environment.prod';
import { VerifySessionResponse } from '../models/session/verify-session.response';
import { AccessTokenService } from './access_token.service';

/**
 * Create pairing sessions and verify their tokens through the API.
 * @author Oriol Plazas
 * @since 1.0.0
 */
@Injectable({
  providedIn: 'root',
})
export class SyncService {
  // --- Injected deps ---
  /**
   * Create the service with its API and token dependencies.
   * @param http - HTTP client for API requests
   * @param accessTokenService - Current access token provider
   * @author Oriol Plazas
   * @since 1.0.0
   */
  constructor(
    private http: HttpClient,
    private accessTokenService: AccessTokenService,
  ) {}

  // --- State ---
  private readonly apiBaseUrl = environment.apiBaseUrl;

  // --- Public API ---
  /**
   * Creates a pairing session via api request
   * @returns Observable<SessionResponse> of the api response
   * @author Oriol Plazas
   * @since 1.0.0
   */
  public createSession(): Observable<SessionResponse> {
    return this.http
      .post<ApiResponse<SessionResponse>>(
        `${this.apiBaseUrl}/sync/pair-code`,
        {},
        {
          headers: { Authorization: `Bearer ${this.accessTokenService.getToken()}` },
        },
      )
      .pipe(map((res) => res.data)); //Remove data from api response
  }
  /**
   * Verifies if a session exists
   * @param token - Pairing token to verify
   * @returns Observable<VerifySessionResponse> of the api response
   * @author Oriol Plazas
   * @since 1.0.0
   */
  public verifySession(token: string): Observable<VerifySessionResponse> {
    return this.http
      .post<ApiResponse<VerifySessionResponse>>(
        `${this.apiBaseUrl}/sync/verify`,
        {
          token_hash: token,
        },
        {
          headers: { Authorization: `Bearer ${this.accessTokenService.getToken()}` },
        },
      )
      .pipe(map((res) => res.data)); //Remove data from api response
  }
}
