import { Routes } from '@angular/router';
import { ScanPage } from './pages/scan-page/scan-page.component';
import { PairPage } from './pages/pair-page/pair-page.component';
import { CheckoutPage } from './pages/checkout-page/checkout-page.component';
import { DashboardPage } from './pages/dashboard-page/dashboard-page.component';
import { RegisterPage } from './pages/register-page/register-page.component';
import { LoginPage } from './pages/login-page/login-page.component';

const TODO: any = null;
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardPage },
  { path: 'scan', component: ScanPage },
  { path: 'pair', component: PairPage },
  { path: 'checkout', component: CheckoutPage },
  { path: 'register', component: RegisterPage }, //Register page
  { path: 'login', component: LoginPage }, //Login page
  { path: '**', redirectTo: 'scan' }, // temporal, hasta tener 404
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
