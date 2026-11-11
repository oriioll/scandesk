import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models/shared/api.response';
import { AccessTokenService } from './access_token.service';
import { KPI } from '../models/dashboard/kpi.response';
import { DoughnutGraph } from '../models/dashboard/doughnut-graph.response';

/**
 * Retrieve dashboard KPI data from the API.
 * @author Oriol Plazas
 * @since 1.0.0
 */
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
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
   * Handles an API request to get all the data for kpis
   * @returns Observable<KPI> With all the data for kpis
   * @author Oriol Plazas
   * @since 1.0.0
   */
  public getKPIs(): Observable<KPI> {
    return this.http
      .get<ApiResponse<KPI>>(`${this.apiBaseUrl}/dashboard/kpis`, {
        headers: { Authorization: `Bearer ${this.accessTokenService.getToken()}` },
      })
      .pipe(map((res) => res.data)); //Remove data from api response
  }

  /**
   * Handles an API request to get all the data for kpis
   * @returns Observable<DoughnutGraph> With all the data for DoughnutGraph
   * @author Oriol Plazas
   * @since 1.0.0
   */
  public getDoughnutGraphStats(): Observable<DoughnutGraph[]> {
    return this.http
      .get<ApiResponse<DoughnutGraph[]>>(`${this.apiBaseUrl}/dashboard/doughnut-graph`, {
        headers: { Authorization: `Bearer ${this.accessTokenService.getToken()}` },
      })
      .pipe(map((res) => res.data)); //Remove data from api response
  }
}
