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

const TODO: any = null;
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
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
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'products' }, // history main menu
          { path: 'products', component: HistoryProductsPage }, // stock or product changes
          { path: 'orders', component: NotFoundPage }, // order history not implemented
          { path: 'orders/:id', component: NotFoundPage }, // order detail not implemented
        ],
      },
    ],
  },
  {
    path: '',
    data: { header: 'auth' satisfies HeaderVariant },
    children: [
      { path: 'login', component: LoginPage }, //Login page
      { path: 'register', component: RegisterPage }, //Register page
    ],
  },
  { path: 'pair', component: PairPage, data: { header: 'none' satisfies HeaderVariant } }, // phone sync: /pair#<token>
  { path: '**', component: NotFoundPage }, // 404
];
export const routes_future: Routes = [
  // Public
  { path: '', pathMatch: 'full', component: TODO }, // Landing page
  { path: 'login', component: TODO }, //Login page
  { path: 'register', component: TODO }, //Register page
  { path: 'pair', component: TODO }, // phone sync: /pair#<token>

  // Private
  { path: 'dashboard', component: TODO }, // Dashboard page
  { path: 'products', component: TODO }, // Product list page
  { path: 'products/:id', component: TODO }, // Product detail page
  {
    path: 'history',
    children: [
      { path: '', component: TODO }, // history main menu
      { path: 'products', component: TODO }, // stock or product changes
      { path: 'orders', component: TODO }, // order history
      { path: 'orders/:id', component: TODO }, // order detail page
    ],
  },
  { path: 'scan', component: ScanPage }, //Scan -> Get items and post them
  { path: 'checkout', component: CheckoutPage }, //checkout -> Get items and use checkout modes

  { path: '**', component: TODO }, // 404
];
