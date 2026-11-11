/**
 * Define application pages and their route guards and header variants.
 * @author Oriol Plazas
 * @since 1.0.0
 */
import { Routes } from '@angular/router';
import { ScanPage } from './pages/scan-page/scan-page.component';
import { PairPage } from './pages/pair-page/pair-page.component';
import { CheckoutPage } from './pages/checkout-page/checkout-page.component';
import { DashboardPage } from './pages/dashboard-page/dashboard-page.component';
import { RegisterPage } from './pages/register-page/register-page.component';
import { LoginPage } from './pages/login-page/login-page.component';
import { HeaderVariant } from './models/header/header-variant';
import { ProductsPage } from './pages/products-page/products-page.component';
import { ProductDetailPage } from './pages/product-detail-page/product-detail-page.component';
import { NotFoundPage } from './pages/not-found-page/not-found-page.component';
import { HistoryProductsPage } from './pages/history-products-page/history-products-page.component';
import { HistoryPage } from './pages/history-page/history-page.component';
import { authGuard } from './core/guard/auth.guard';
import { guestGuard } from './core/guard/guest.guard';
import { LandingComponent } from './pages/landing-page/landing-page.component';

const TODO: any = null;
export const routes: Routes = [
  // Redirect the root URL to the authenticated dashboard.
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  // Authenticated pages use the app header and require authGuard.
  {
    path: '', // Groupe dashboard pages
    data: { header: 'app' satisfies HeaderVariant },
    children: [
      { path: 'dashboard', component: DashboardPage }, // Dashboard page
      { path: 'scan', component: ScanPage }, //Scan -> Get items and post them
      { path: 'checkout', component: CheckoutPage }, //checkout -> Get items and use checkout modes
      { path: 'products', component: ProductsPage }, // Product list page
      { path: 'products/:id', component: ProductDetailPage }, // Product detail page
      {
        path: 'history',
        // History index and product entries, guarded by authGuard with the app header.
        children: [
          { path: '', pathMatch: 'full', component: HistoryPage }, // history main menu
          { path: 'products', component: HistoryProductsPage }, // stock or product changes
          { path: 'orders', component: NotFoundPage }, // order history not implemented
          { path: 'orders/:id', component: NotFoundPage }, // order detail not implemented
        ],
      },
    ],
    canActivate: [authGuard], //Only for logged in users
  },
  {
    path: '',
    data: { header: 'auth' satisfies HeaderVariant },
    // Login and registration pages, guarded by guestGuard with the auth header.
    children: [
      { path: 'login', component: LoginPage }, //Login page
      { path: 'register', component: RegisterPage }, //Register page
    ],
    canActivate: [guestGuard], //Only for not logged users
  },
  // Public landing page with the landing header.
  {
    path: 'info',
    component: LandingComponent,
    data: { header: 'landing' satisfies HeaderVariant },
  }, //Info - Landing page
  // Pairing page for phone sync with no header.
  { path: 'pair', component: PairPage, data: { header: 'none' satisfies HeaderVariant } }, // phone sync: /pair#<token>
  // Fallback page for unmatched URLs.
  { path: '**', component: NotFoundPage }, // 404
];
