import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models/shared/api.response';
import { CategoryResponse } from '../models/categories/category.response';
import { OrderItemRequest } from '../models/orders/order-item.request';
import { OrderRequest } from '../models/orders/order.request';
import { OrderResponse } from '../models/orders/order.response';
import { AccessTokenService } from './access_token.service';

/**
 * Retrieve orders and submit purchases through the API.
 * @author Oriol Plazas
 * @since 1.0.0
 */
@Injectable({
  providedIn: 'root',
})
export class OrderService {
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
   * Handles an API get all the orders
   * @returns Observable of OrderResponse
   * @author Oriol Plazas
   * @since 1.0.0
   */
  public getOrders(): Observable<OrderResponse[]> {
    return this.http
      .get<ApiResponse<OrderResponse[]>>(`${this.apiBaseUrl}/orders`, {
        headers: {
          Authorization: `Bearer ${this.accessTokenService.getToken()}`,
        },
      })
      .pipe(map((res) => res.data));
  }

  /**
   * Handles an API Post request to create an order
   * @param items The items to
   * @param idempotencyKey idempotencyKey to avoid duplicate orders
   * @returns Observable of OrderResponse
   * @author Oriol Plazas
   * @since 1.0.0
   */
  public postOrder(items: OrderItemRequest[], idempotencyKey: string): Observable<OrderResponse> {
    const request: OrderRequest = { items };
    return this.http
      .post<ApiResponse<OrderResponse>>(`${this.apiBaseUrl}/orders`, request, {
        headers: {
          Authorization: `Bearer ${this.accessTokenService.getToken()}`,
          'Idempotency-Key': idempotencyKey,
        },
      })
      .pipe(map((res) => res.data));
  }
}
