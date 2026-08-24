import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { permissionGuard } from './core/guards/permission-guard';
export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/pages/login/login').then((component) => component.Login),
  },

  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout').then((m) => m.MainLayout),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        canActivate: [permissionGuard],
        data: {
          permission: 'dashboard.view',

          topbarTitle: 'NAV.DASHBOARD',

          topbarSubtitle: 'TOPBAR.DASHBOARD_SUBTITLE',
        },
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/dashboard').then(
            (component) => component.Dashboard,
          ),
      },
      {
        path: 'products',
        canActivate: [permissionGuard],
        data: {
          permission: 'products.view',

          topbarTitle: 'NAV.PRODUCTS',

          topbarSubtitle: 'TOPBAR.PRODUCTS_SUBTITLE',
        },
        loadComponent: () =>
          import('./features/products/pages/products/products').then(
            (component) => component.Products,
          ),
      },
      {
        path: 'orders',
        canActivate: [permissionGuard],
        data: {
          permission: 'orders.view',

          topbarTitle: 'NAV.ORDERS',

          topbarSubtitle: 'TOPBAR.ORDERS_SUBTITLE',
        },
        loadComponent: () =>
          import('./features/orders/pages/orders/orders').then((component) => component.Orders),
      },
      {
        path: 'customers',
        canActivate: [permissionGuard],
        data: {
          permission: 'customers.view',

          topbarTitle: 'NAV.CUSTOMERS',

          topbarSubtitle: 'TOPBAR.CUSTOMERS_SUBTITLE',
        },
        loadComponent: () =>
          import('./features/customers/pages/customers/customers').then(
            (component) => component.Customers,
          ),
      },
      {
        path: 'inventory',
        canActivate: [permissionGuard],
        data: {
          permission: 'inventory.view',

          topbarTitle: 'NAV.INVENTORY',

          topbarSubtitle: 'TOPBAR.INVENTORY_SUBTITLE',
        },
        loadComponent: () =>
          import('./features/inventory/pages/inventory/inventory').then(
            (component) => component.Inventory,
          ),
      },
      {
        path: 'analytics',
        canActivate: [permissionGuard],
        data: {
          permission: 'analytics.view',

          topbarTitle: 'NAV.ANALYTICS',

          topbarSubtitle: 'TOPBAR.ANALYTICS_SUBTITLE',
        },
        loadComponent: () =>
          import('./features/analytics/pages/analytics/analytics').then(
            (component) => component.Analytics,
          ),
      },
      {
        path: 'users',
        canActivate: [permissionGuard],
        data: {
          permission: 'users.view',

          topbarTitle: 'NAV.USERS',

          topbarSubtitle: 'TOPBAR.USERS_SUBTITLE',
        },
        loadComponent: () =>
          import('./features/users/pages/users/users').then((component) => component.Users),
      },
      {
        path: 'settings',
        canActivate: [permissionGuard],
        data: {
          permission: 'settings.view',

          topbarTitle: 'NAV.SETTINGS',

          topbarSubtitle: 'TOPBAR.SETTINGS_SUBTITLE',
        },
        loadComponent: () =>
          import('./features/settings/pages/settings/settings').then(
            (component) => component.Settings,
          ),
      },

      {
        path: 'forbidden',
        data: {
          topbarTitle: 'AUTH.FORBIDDEN.TITLE',

          topbarSubtitle: 'AUTH.FORBIDDEN.MESSAGE',
        },
        loadComponent: () =>
          import('./features/auth/pages/forbidden/forbidden').then(
            (component) => component.Forbidden,
          ),
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
