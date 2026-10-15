import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionResponse } from '../model/SessionResponse';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../model/ApiResponse';
import { environment } from '../../environments/environment';

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
}
