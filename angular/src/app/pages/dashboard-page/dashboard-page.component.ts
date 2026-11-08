import { Component, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { Kpi } from './kpi/kpi.component';
import { KpiTone } from '../../models/dashboard/kpi-tone';
import { FeatureCard } from '../../models/dashboard/features';
import { DashboardFeature } from './dashboard-features/dashboard-features.component';
import { AuthService } from '../../services/auth.service';
import { SkeletonComponent } from '../../shared/skeleton/skeleton.component';
import { KPI } from '../../models/dashboard/kpi.response';
import { DashboardService } from '../../services/dashboard.service';

const EUR = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
@Component({
  selector: 'app-dashboard-page',
  imports: [Kpi, DashboardFeature, SkeletonComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
})
export class DashboardPage implements OnInit {
  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
  ) {}
  protected readonly kpiSkeletons = [0, 1, 2, 3];
  public username = signal('');
  public loadingUsername = signal(true);
  public loadingKPIs = signal(false);
  public kpiData = signal<KPI | null>(null);
  public usernameLoadError = signal(false);
  public kpiError = signal(false);
  //Array of kpis in the app
  public kpis: { label: string; value: string; hint: string; tone: KpiTone }[] = [
    { label: 'Total products', value: '', hint: '', tone: 'default' },
    { label: 'Out of stock', value: '', hint: '', tone: 'default' },
    { label: 'Low stock', value: '', hint: 'Below 5 units', tone: 'default' },
    { label: "Today's sales", value: '', hint: '', tone: 'default' },
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
  /**
   * Loads all the data needed to build the kpis
   */
  private loadKpis() {
    this.loadingKPIs.set(true);
    this.kpiError.set(false);
    this.dashboardService
      .getKPIs()
      .pipe(finalize(() => this.loadingKPIs.set(false)))
      .subscribe({
        next: (k) => {
          this.kpiData.set(k);
          const pct = k.total_products
            ? ((k.out_of_stock / k.total_products) * 100).toFixed(1)
            : '0';

          this.kpis = [
            {
              label: 'Total products',
              value: String(k.total_products),
              hint: 'Active products',
              tone: 'default',
            },
            {
              label: 'Out of stock',
              value: String(k.out_of_stock),
              hint: `${pct}% of catalog`,
              tone: k.out_of_stock > 0 ? 'error' : 'success',
            },
            {
              label: 'Low stock',
              value: String(k.low_stock),
              hint: 'Below 5 units',
              tone: k.low_stock > 0 ? 'warning' : 'default',
            },
            {
              label: "Today's sales",
              value: EUR.format(Number(k.today_revenue)),
              hint: `${k.today_orders} ${k.today_orders === 1 ? 'order' : 'orders'}`,
              tone: 'default',
            },
          ];
        },
        error: () => this.kpiError.set(true),
      });
  }
  /**
   * Loads the user name
   */
  private getUserName() {
    this.authService
      .whoami()
      .pipe(finalize(() => this.loadingUsername.set(false)))
      .subscribe({
        next: (user) => {
          this.username.set(user.name);
          this.loadKpis();
        },
        error: () => {
          this.usernameLoadError.set(true);
        },
      });
  }
  protected retry(): void {
    this.usernameLoadError.set(false);
    this.loadingUsername.set(true);
    this.getUserName();
  }
}
