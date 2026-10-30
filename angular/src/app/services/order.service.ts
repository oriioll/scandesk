import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models/shared/api.response';
import { CategoryResponse } from '../models/categories/category.response';
import { OrderItemRequest } from '../models/orders/order-item.request';
import { OrderRequest } from '../models/orders/order.request';
import { OrderResponse } from '../models/orders/order.response';
import { AccessTokenService } from './access_token.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private accessTokenService: AccessTokenService,
  ) {}

  /**
   * Handles an API Post request to create an order
   * @param items The items to
   * @param idempotencyKey idempotencyKey to avoid duplicate orders
   * @returns Observable of OrderResponse
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
