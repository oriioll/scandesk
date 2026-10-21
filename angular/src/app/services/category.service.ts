import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../model/ApiResponse';
import { CategoryResponse } from '../model/CategoryResponse';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}
  /**
   * Handles an API request to get all the categories
   * @returns Observable<CategoryResponse[]> With all the categories
   */
  public getAll(): Observable<CategoryResponse[]> {
    return this.http
      .get<ApiResponse<CategoryResponse[]>>(`${this.apiBaseUrl}/categories`)
      .pipe(map((res) => res.data)); //Remove data from api response
  }
}
