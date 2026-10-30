import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { ProductResponse } from '../models/products/product.response';
import { ApiResponse } from '../models/shared/api.response';
import { ProductRequest } from '../models/products/product.request';
import { AccessTokenService } from './access_token.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private accessTokenService: AccessTokenService,
  ) {}
  /**
   * Handles an API request to search a product by a user id
   * @param barcode Barcode of the product to search
   * @returns Observable<ProductResponse> The product with that barcode
   */
  public getProductByBarcode(barcode: string): Observable<ProductResponse> {
    return this.http
      .get<ApiResponse<ProductResponse>>(`${this.apiBaseUrl}/products/barcode/${barcode}`, {
        headers: { Authorization: `Bearer ${this.accessTokenService.getToken()}` },
      })
      .pipe(map((res) => res.data)); //Remove data from api response
  }

  /**
   * Handles an API request to create a product
   * @param product - Product to create
   * @returns Observable<ProductResponse> The product created
   */
  public postProduct(product: ProductRequest): Observable<ProductResponse> {
    return this.http
      .post<ApiResponse<ProductResponse>>(`${this.apiBaseUrl}/products`, product, {
        headers: { Authorization: `Bearer ${this.accessTokenService.getToken()}` },
      })
      .pipe(map((res) => res.data)); //Remove data from api response
  }

  /**
   * Handles an API request to update a product
   * @param id - The id of the product to update
   * @param product - Data to update
   * @returns Observable<ProductResponse> The product updated
   */
  public putProduct(id: number, product: ProductRequest): Observable<ProductResponse> {
    return this.http
      .put<ApiResponse<ProductResponse>>(`${this.apiBaseUrl}/products/${id}`, product, {
        headers: { Authorization: `Bearer ${this.accessTokenService.getToken()}` },
      })
      .pipe(map((res) => res.data)); //Remove data from api response
  }
}
