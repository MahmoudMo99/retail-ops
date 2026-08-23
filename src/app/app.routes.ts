import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/dashboard').then((m) => m.Dashboard),
        data: {
          topbarTitle: 'NAV.DASHBOARD',
          topbarSubtitle: 'TOPBAR.DASHBOARD_SUBTITLE',
        },
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/pages/products/products').then((m) => m.Products),
        data: {
          topbarTitle: 'NAV.PRODUCTS',
          topbarSubtitle: 'TOPBAR.PRODUCTS_SUBTITLE',
        },
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/orders/pages/orders/orders').then((m) => m.Orders),
        data: {
          topbarTitle: 'NAV.ORDERS',
          topbarSubtitle: 'TOPBAR.ORDERS_SUBTITLE',
        },
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./features/customers/pages/customers/customers').then((m) => m.Customers),
        data: {
          topbarTitle: 'NAV.CUSTOMERS',
          topbarSubtitle: 'TOPBAR.CUSTOMERS_SUBTITLE',
        },
      },
      {
        path: 'inventory',
        loadComponent: () =>
          import('./features/inventory/pages/inventory/inventory').then((m) => m.Inventory),
        data: {
          topbarTitle: 'NAV.INVENTORY',
          topbarSubtitle: 'TOPBAR.INVENTORY_SUBTITLE',
        },
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./features/analytics/pages/analytics/analytics').then((m) => m.Analytics),
        data: {
          topbarTitle: 'NAV.ANALYTICS',
          topbarSubtitle: 'TOPBAR.ANALYTICS_SUBTITLE',
        },
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/pages/users/users').then((m) => m.Users),
        data: {
          topbarTitle: 'NAV.USERS',
          topbarSubtitle: 'TOPBAR.USERS_SUBTITLE',
        },
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/pages/settings/settings').then((m) => m.Settings),
        data: {
          topbarTitle: 'NAV.SETTINGS',
          topbarSubtitle: 'TOPBAR.SETTINGS_SUBTITLE',
        },
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
