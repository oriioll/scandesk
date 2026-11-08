import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models/shared/api.response';
import { AccessTokenService } from './access_token.service';
import { KPI } from '../models/dashboard/kpi.response';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private accessTokenService: AccessTokenService,
  ) {}
  /**
   * Handles an API request to get all the data for kpis
   * @returns Observable<KPI> With all the data for kpis
   */
  public getKPIs(): Observable<KPI> {
    return this.http
      .get<ApiResponse<KPI>>(`${this.apiBaseUrl}/dashboard/kpis`, {
        headers: { Authorization: `Bearer ${this.accessTokenService.getToken()}` },
      })
      .pipe(map((res) => res.data)); //Remove data from api response
  }
}
