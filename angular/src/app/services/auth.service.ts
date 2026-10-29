import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { ApiResponse } from '../models/shared/api.response';
import { CategoryResponse } from '../models/categories/category.response';
import { UserResponse } from '../models/user/user.response';
import { UserRequest } from '../models/user/user.request';
import { TokenResponse } from '../models/user/token.response';
import { AccessTokenService } from './access_token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private accessTokenService: AccessTokenService,
  ) {}

  /**
   * Handles an API request to post a new user
   * @returns Observable<TokenResponse> With the info of the token
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
   * @returns Observable<TokenResponse> With the info of the token
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
   */
  public whoami(): Observable<UserResponse> {
    return this.http
      .get<ApiResponse<UserResponse>>(`${this.apiBaseUrl}/auth/me`)
      .pipe(map((res) => res.data)); //Remove data from api response
  }

  /**
   * Uses whoami function to see if a user is logged or not
   * @returns Observable<boolean> to check if is logged or not
   */
  public userIsLogged(): Observable<boolean> {
    return this.whoami().pipe(
      map(() => true),
      catchError(() => of(false)),
    );
  }
}
