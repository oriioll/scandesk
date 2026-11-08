import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models/shared/api.response';
import { CategoryResponse } from '../models/categories/category.response';
import { AccessTokenService } from './access_token.service';
import { StockHistoryResponse } from '../models/history/stock-history.response';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private accessTokenService: AccessTokenService,
  ) {}
  /**
   * Handles an API request to get history of changes
   * @returns Observable<StockHistoryResponse[]> With all the history of changes
   */
  public getAll(): Observable<StockHistoryResponse[]> {
    return this.http
      .get<ApiResponse<StockHistoryResponse[]>>(`${this.apiBaseUrl}/history/products`, {
        headers: { Authorization: `Bearer ${this.accessTokenService.getToken()}` },
      })
      .pipe(map((res) => res.data)); //Remove data from api response
  }
}
