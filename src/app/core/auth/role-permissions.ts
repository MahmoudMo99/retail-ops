import { AuthUserRole } from '../../features/auth/models/auth-user.model';
import { Permission } from './permission';

export const ROLE_PERMISSIONS: Record<AuthUserRole, readonly Permission[]> = {
  admin: [
    'dashboard.view',

    'products.view',
    'products.manage',

    'orders.view',
    'orders.manage',

    'customers.view',

    'inventory.view',
    'inventory.adjust',

    'analytics.view',

    'users.view',
    'users.manage',

    'settings.view',
  ],

  moderator: [
    'dashboard.view',

    'products.view',
    'products.manage',

    'orders.view',
    'orders.manage',

    'customers.view',

    'inventory.view',
    'inventory.adjust',

    'analytics.view',

    'settings.view',
  ],

  user: [
    'dashboard.view',

    'products.view',

    'orders.view',

    'customers.view',

    'inventory.view',

    'analytics.view',

    'settings.view',
  ],
};
