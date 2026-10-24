import { Component } from '@angular/core';
import { Kpi } from './kpi/kpi.component';
import { KpiTone } from '../../models/dashboard/kpi-tone';

@Component({
  selector: 'app-dashboard-page',
  imports: [Kpi],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
})
export class DashboardPage {
  public kpis: { label: string; value: string; hint: string; tone: KpiTone }[] = [
    { label: 'Total products', value: '248', hint: 'In 6 categories', tone: 'default' },
    { label: 'Out of stock', value: '12', hint: '4.8% of catalog', tone: 'error' },
    { label: 'Low stock', value: '21', hint: 'Below minimum', tone: 'warning' },
    { label: "Today's sales", value: '184,50 €', hint: '14 orders', tone: 'default' },
  ];
}
