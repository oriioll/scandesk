import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, finalize, map, Observable, of, tap } from 'rxjs';
import { ApiResponse } from '../models/shared/api.response';
import { CategoryResponse } from '../models/categories/category.response';
import { UserResponse } from '../models/user/user.response';
import { UserRequest } from '../models/user/user.request';
import { TokenResponse } from '../models/user/token.response';
import { AccessTokenService } from './access_token.service';

/**
 * Manage account authentication and access tokens through the API.
 * @author Oriol Plazas
 * @since 1.0.0
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
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
   * Handles an API request to post a new user
   * @param user - Account details to register
   * @returns Observable<TokenResponse> With the info of the token
   * @author Oriol Plazas
   * @since 1.0.0
   */
  public createUser(user: UserRequest): Observable<TokenResponse> {
    return this.http
      .post<ApiResponse<TokenResponse>>(`${this.apiBaseUrl}/auth/register`, user)
      .pipe(
        map((res) => res.data), //Remove data from api response
        tap((data) => {
          //Store the token to keep user logged in
          this.accessTokenService.storeToken(data.access_token);
        }),
      );
  }

  /**
   * Handles an API request to log in a user
   * @param user - Credentials for the account
   * @returns Observable<TokenResponse> With the info of the token
   * @author Oriol Plazas
   * @since 1.0.0
   */
  public loginUser(user: UserRequest): Observable<TokenResponse> {
    return this.http.post<ApiResponse<TokenResponse>>(`${this.apiBaseUrl}/auth/login`, user).pipe(
      map((res) => res.data), //Remove data from api response
      tap((data) => {
        //Store the token to keep user logged in
        this.accessTokenService.storeToken(data.access_token);
      }),
    );
  }

  /**
   * Handles an API request to get the currently logged user
   * @returns Observable<UserResponse[]> With the info of the logged user
   * @author Oriol Plazas
   * @since 1.0.0
   */
  public whoami(): Observable<UserResponse> {
    return this.http
      .get<ApiResponse<UserResponse>>(`${this.apiBaseUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${this.accessTokenService.getToken()}` },
      })
      .pipe(map((res) => res.data)); //Remove data from api response
  }

  /**
   * Handles an API request to log out the user
   * @returns Observable<> With no content
   * @author Oriol Plazas
   * @since 1.0.0
   */
  public logout(): Observable<any> {
    return this.http
      .post(`${this.apiBaseUrl}/auth/logout`, null, {
        headers: { Authorization: `Bearer ${this.accessTokenService.getToken()}` },
      })
      .pipe(
        catchError(() => of(null)),
        finalize(() => this.accessTokenService.clearToken()),
      );
  }

  /**
   * Uses whoami function to see if a user is logged or not
   * @returns Observable<boolean> to check if is logged or not
   * @author Oriol Plazas
   * @since 1.0.0
   */
  public userIsLogged(): Observable<boolean> {
    return this.whoami().pipe(
      map(() => true),
      catchError(() => of(false)),
    );
  }
}
