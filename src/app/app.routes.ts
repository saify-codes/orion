import { Routes } from '@angular/router';
import { MerchantLayout } from './layouts/merchant/merchant.component';
import { SigninComponent } from './pages/merchant/signin/signin.component';
import { DashboardComponent } from './pages/merchant/dashboard/dashboard.component';
import { GeneralComponent } from './pages/merchant/settings/general/general.component';
import { HomeComponent } from './pages/merchant/home/home.component';

import { AdminLayout } from './layouts/admin/admin.component';
import { AdminHomeComponent } from './pages/admin/admin-home/admin-home.component';
import { MerchantsComponent } from './pages/admin/merchants/merchants.component';
import { SigninComponent as AdminSigninComponent } from './pages/admin/signin/signin.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { authGuardGuard } from './guards/admin/auth-guard.guard';
import { DatatableComponent } from './components/datatable/datatable.component';
import { AddMerchantComponent } from './pages/admin/merchants/add/add.component';
import { EditMerchantComponent } from './pages/admin/merchants/edit/edit.component';
import { AddAdminComponent } from './pages/admin/admins/add/add.component';

export const routes: Routes = [
  // admin routes
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [],
    children: [
      { path: '',             component: AdminHomeComponent,  pathMatch: 'full' },
      { path: 'dashboard',    component: DatatableComponent },
      { path: 'merchant',     component: MerchantsComponent },
      { path: 'merchant/add', component: AddMerchantComponent },
      { path: 'merchant/:id', component: EditMerchantComponent },
      { path: 'admins',       component: MerchantsComponent },
      { path: 'admins/add',   component: AddAdminComponent },
      { path: 'admins/:id',   component: EditMerchantComponent },
    ],
  },

  // merchant routes
  {
    path: '',
    component: MerchantLayout,
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
      {
        path: 'reports',
        children: [
          { path: 'sales', component: GeneralComponent },
          { path: 'sales-summary', component: GeneralComponent },
          { path: 'powerbi', component: GeneralComponent },
          { path: 'comparision', component: GeneralComponent },
          { path: 'customer', component: GeneralComponent },
        ],
      },
      { path: 'integrations/:service', component: GeneralComponent },
      { path: 'payment-gateway/:gateway', component: GeneralComponent },
      { path: 'logs/:type', component: GeneralComponent },
    ],
  },

  // Admin guest route (outside the shell)
  { path: 'admin/auth/login', component: AdminSigninComponent },

  // Merchant guest route (outside the shell)
  { path: 'auth/signin', component: SigninComponent },

  // 404
  { path: '**', component: NotFoundComponent },
];
