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
import { HistoryOrdersPage } from './pages/history-orders-page/history-orders-page.component';
import { HistoryPage } from './pages/history-page/history-page.component';
import { authGuard } from './core/guard/auth.guard';
import { guestGuard } from './core/guard/guest.guard';
import { LandingComponent } from './pages/landing-page/landing-page.component';
import { LegalPageComponent } from './pages/legal-page/legal-page.component';

const TODO: any = null;
export const routes: Routes = [
  // Redirect the root URL to the authenticated dashboard.
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  // Authenticated pages use the app header and require authGuard.
  {
    path: '', // Groupe dashboard pages
    data: { header: 'app' satisfies HeaderVariant },
    children: [
      { path: 'dashboard', component: DashboardPage, title: 'Dashboard | ScanDesk' },
      { path: 'scan', component: ScanPage, title: 'Scan products | ScanDesk' },
      { path: 'checkout', component: CheckoutPage, title: 'Checkout | ScanDesk' },
      { path: 'products', component: ProductsPage, title: 'Products | ScanDesk' },
      { path: 'products/:id', component: ProductDetailPage, title: 'Product details | ScanDesk' },
      {
        path: 'history',
        // History index and product entries, guarded by authGuard with the app header.
        children: [
          { path: '', pathMatch: 'full', component: HistoryPage, title: 'History | ScanDesk' },
          { path: 'products', component: HistoryProductsPage, title: 'Product history | ScanDesk' },
          { path: 'orders', component: HistoryOrdersPage, title: 'Order history | ScanDesk' },
          { path: 'orders/:id', component: NotFoundPage, title: 'Page not found | ScanDesk' },
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
      { path: 'login', component: LoginPage, title: 'Log in | ScanDesk' },
      { path: 'register', component: RegisterPage, title: 'Create account | ScanDesk' },
    ],
    canActivate: [guestGuard], //Only for not logged users
  },
  // Public landing page with the landing header.
  {
    path: 'info',
    component: LandingComponent,
    title: 'ScanDesk | Barcode inventory and checkout',
    data: { header: 'landing' satisfies HeaderVariant },
  }, //Info - Landing page
  {
    path: 'terms',
    component: LegalPageComponent,
    title: 'Terms of service | ScanDesk',
    data: { header: 'auth' satisfies HeaderVariant },
  },
  {
    path: 'policy',
    component: LegalPageComponent,
    title: 'Privacy policy | ScanDesk',
    data: { header: 'auth' satisfies HeaderVariant },
  },
  {
    path: 'cookies',
    component: LegalPageComponent,
    title: 'Cookie policy | ScanDesk',
    data: { header: 'auth' satisfies HeaderVariant },
  },
  // Pairing page for phone sync with no header.
  {
    path: 'pair',
    component: PairPage,
    title: 'Connect your phone | ScanDesk',
    data: { header: 'none' satisfies HeaderVariant },
  }, // phone sync: /pair#<token>
  // Fallback page for unmatched URLs.
  { path: '**', component: NotFoundPage, title: 'Page not found | ScanDesk' }, // 404
];
