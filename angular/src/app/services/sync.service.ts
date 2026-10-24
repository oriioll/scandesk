import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionResponse } from '../models/session/session.response';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models/shared/api.response';
import { environment } from '../../environments/environment';
import { VerifySessionResponse } from '../models/session/verify-session.response';

@Injectable({
  providedIn: 'root',
})
export class SyncService {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}
  /**
   * Creates a pairing session via api request
   * @returns Observable<SessionResponse> of the api response
   */
  public createSession(): Observable<SessionResponse> {
    return this.http
      .post<ApiResponse<SessionResponse>>(`${this.apiBaseUrl}/sync/pair-code`, {})
      .pipe(map((res) => res.data)); //Remove data from api response
  }
  /**
   * Verifies if a session exists
   * @returns Observable<VerifySessionResponse> of the api response
   */
  public verifySession(token: string): Observable<VerifySessionResponse> {
    return this.http
      .post<ApiResponse<VerifySessionResponse>>(`${this.apiBaseUrl}/sync/verify`, {
        token_hash: token,
      })
      .pipe(map((res) => res.data)); //Remove data from api response
  }
}
