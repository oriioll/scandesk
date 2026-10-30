import { Component, OnInit, signal } from '@angular/core';
import { Kpi } from './kpi/kpi.component';
import { KpiTone } from '../../models/dashboard/kpi-tone';
import { FeatureCard } from '../../models/dashboard/features';
import { DashboardFeature } from './dashboard-features/dashboard-features.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [Kpi, DashboardFeature],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
})
export class DashboardPage implements OnInit {
  constructor(private authService: AuthService) {}
  public username = signal('');
  //Array of kpis in the app
  public kpis: { label: string; value: string; hint: string; tone: KpiTone }[] = [
    { label: 'Total products', value: '248', hint: 'In 6 categories', tone: 'default' },
    { label: 'Out of stock', value: '12', hint: '4.8% of catalog', tone: 'error' },
    { label: 'Low stock', value: '21', hint: 'Below minimum', tone: 'warning' },
    { label: "Today's sales", value: '184,50 €', hint: '14 orders', tone: 'default' },
  ];

  //Array of features of the app
  public features: FeatureCard[] = [
    {
      iconPath: '/icons/product.svg',
      title: 'Products',
      text: 'Check all your catalog, create new products, and edit or delete them',
      buttons: [
        { text: 'See all', isPrincipal: true, routeTo: '/products' },
        {
          text: 'Create product',
          isPrincipal: false,
          routeTo: '/products',
          queryParams: { create: 'true' },
        },
      ],
      routeTo: '/products',
    },
    {
      iconPath: '/icons/history.svg',
      title: 'History',
      text: 'Review your orders and every stock change, and open any order for its details',
      buttons: [
        { text: 'Orders', isPrincipal: true, routeTo: '/history/orders' },
        { text: 'Stock changes', isPrincipal: false, routeTo: '/history/products' },
      ],
      routeTo: '/history',
    },
    {
      iconPath: '/icons/scan.svg',
      title: 'Scan',
      text: 'Use your phone as a scanner to manage stock or to check out',
      buttons: [
        { text: 'Scan', isPrincipal: true, routeTo: '/scan' },
        { text: 'Checkout', isPrincipal: true, routeTo: '/checkout' },
      ],
      routeTo: '/scan',
    },
  ];
  public ngOnInit(): void {
    this.getUserName();
  }
  private getUserName() {
    this.authService.whoami().subscribe({
      next: (user) => {
        this.username.set(user.name);
      },
      error: () => {
        return;
      },
    });
  }
}
