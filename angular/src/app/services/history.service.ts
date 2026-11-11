import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models/shared/api.response';
import { CategoryResponse } from '../models/categories/category.response';
import { AccessTokenService } from './access_token.service';
import { StockHistoryResponse } from '../models/history/stock-history.response';

/**
 * Retrieve stock history from the API.
 * @author Oriol Plazas
 * @since 1.0.0
 */
@Injectable({
  providedIn: 'root',
})
export class HistoryService {
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
   * Handles an API request to get history of changes
   * @returns Observable<StockHistoryResponse[]> With all the history of changes
   * @author Oriol Plazas
   * @since 1.0.0
   */
  public getAll(): Observable<StockHistoryResponse[]> {
    return this.http
      .get<ApiResponse<StockHistoryResponse[]>>(`${this.apiBaseUrl}/history/products`, {
        headers: { Authorization: `Bearer ${this.accessTokenService.getToken()}` },
      })
      .pipe(map((res) => res.data)); //Remove data from api response
  }
}
