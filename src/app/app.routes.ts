import { Routes } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GeneralComponent } from './pages/settings/general/general.component';
import { HomeComponent } from './pages/home/home.component';
import { BaseComponent } from './layouts/base/base.component';

export const routes: Routes = [
  // Shell with persistent header/sidebar
  {
    path: '',
    component: BaseComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'orders', component: GeneralComponent },
      { path: 'pos', component: GeneralComponent },
      { path: 'customers', component: GeneralComponent },
      { path: 'staff', component: GeneralComponent },
      { path: 'inventory', component: GeneralComponent },

      {
        path: 'menu',
        children: [
          { path: 'items', component: GeneralComponent },
          { path: 'item-category', component: GeneralComponent },
          { path: 'sizes', component: GeneralComponent },
          { path: 'addons', component: GeneralComponent },
          { path: 'addon-category', component: GeneralComponent },
        ],
      },
      {
        path: 'marketing',
        children: [
          { path: 'seo', component: GeneralComponent },
          { path: 'sms', component: GeneralComponent },
          { path: 'push-notifications', component: GeneralComponent },
        ],
      },
      {
        path: 'promotions',
        children: [
          { path: 'vouchers', component: GeneralComponent },
          { path: 'offers', component: GeneralComponent },
        ],
      },
      {
        path: 'settings',
        children: [
          { path: 'general', component: GeneralComponent },
          { path: 'branches', component: GeneralComponent },
          { path: 'theme', component: GeneralComponent },
          { path: 'app', component: GeneralComponent },
          { path: 'tax', component: GeneralComponent },
          { path: 'tip', component: GeneralComponent },
        ],
      },

      { path: 'integrations/:service', component: GeneralComponent },
      { path: 'payment-gateway/:gateway', component: GeneralComponent },
      { path: 'logs/:type', component: GeneralComponent },
    ],
  },

  // Guest route (outside the shell)
  { path: 'signin', component: SigninComponent },

  // Optional: not-found
  // { path: '**', redirectTo: '' },
];
