import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models/shared/api.response';
import { CategoryResponse } from '../models/categories/category.response';
import { AccessTokenService } from './access_token.service';

/**
 * Retrieve product categories from the API.
 * @author Oriol Plazas
 * @since 1.0.0
 */
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
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
   * Handles an API request to get all the categories
   * @returns Observable<CategoryResponse[]> With all the categories
   * @author Oriol Plazas
   * @since 1.0.0
   */
  public getAll(): Observable<CategoryResponse[]> {
    return this.http
      .get<ApiResponse<CategoryResponse[]>>(`${this.apiBaseUrl}/categories`, {
        headers: { Authorization: `Bearer ${this.accessTokenService.getToken()}` },
      })
      .pipe(map((res) => res.data)); //Remove data from api response
  }
}
