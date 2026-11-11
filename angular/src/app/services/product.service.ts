import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { ProductResponse } from '../models/products/product.response';
import { ApiResponse } from '../models/shared/api.response';
import { ProductRequest } from '../models/products/product.request';
import { AccessTokenService } from './access_token.service';

/**
 * Retrieve and manage products through the API.
 * @author Oriol Plazas
 * @since 1.0.0
 */
@Injectable({
  providedIn: 'root',
})
export class ProductService {
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
   * Handles an API request to get all the products
   * @returns Observable<ProductResponse[]> With the products of the user
   * @author Oriol Plazas
   * @since 1.0.0
   */
  public getMyProducts(): Observable<ProductResponse[]> {
    return this.http
      .get<ApiResponse<ProductResponse[]>>(`${this.apiBaseUrl}/products`, {
        headers: { Authorization: `Bearer ${this.accessTokenService.getToken()}` },
      })
      .pipe(map((res) => res.data)); //Remove data from api response
  }
  /**
   * Handles an API request to search a product by a barcode
   * @param barcode Barcode of the product to search
   * @returns Observable<ProductResponse> The product with that barcode
   * @author Oriol Plazas
   * @since 1.0.0
   */
  public getProductByBarcode(barcode: string): Observable<ProductResponse> {
    return this.http
      .get<ApiResponse<ProductResponse>>(`${this.apiBaseUrl}/products/barcode/${barcode}`, {
        headers: { Authorization: `Bearer ${this.accessTokenService.getToken()}` },
      })
      .pipe(map((res) => res.data)); //Remove data from api response
  }

  /**
   * Handles an API request to search a product by a id
   * @param id Id of the product to search
   * @returns Observable<ProductResponse> The product with that id
   * @author Oriol Plazas
   * @since 1.0.0
   */
  public getProductById(id: number): Observable<ProductResponse> {
    return this.http
      .get<ApiResponse<ProductResponse>>(`${this.apiBaseUrl}/products/${id}`, {
        headers: { Authorization: `Bearer ${this.accessTokenService.getToken()}` },
      })
      .pipe(map((res) => res.data)); //Remove data from api response
  }

  /**
   * Handles an API request to create a product
   * @param product - Product to create
   * @returns Observable<ProductResponse> The product created
   * @author Oriol Plazas
   * @since 1.0.0
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
   * @author Oriol Plazas
   * @since 1.0.0
   */
  public putProduct(id: number, product: ProductRequest): Observable<ProductResponse> {
    return this.http
      .put<ApiResponse<ProductResponse>>(`${this.apiBaseUrl}/products/${id}`, product, {
        headers: { Authorization: `Bearer ${this.accessTokenService.getToken()}` },
      })
      .pipe(map((res) => res.data)); //Remove data from api response
  }

  /**
   * Handles an API request to delete a product
   * @param id - The id of the product to delete
   * @returns No content
   * @author Oriol Plazas
   * @since 1.0.0
   */
  public deleteProduct(id: number): Observable<any> {
    return this.http.delete<Observable<any>>(`${this.apiBaseUrl}/products/${id}`, {
      headers: { Authorization: `Bearer ${this.accessTokenService.getToken()}` },
    });
  }
}
