import { Routes } from '@angular/router';

const TODO: any = null;

export const routes: Routes = [
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
  { path: 'scan', component: TODO }, //Scan -> Get items and post them
  { path: 'checkout', component: TODO }, //checkout -> Get items and use checkout modes

  { path: '**', component: TODO }, // 404
];
