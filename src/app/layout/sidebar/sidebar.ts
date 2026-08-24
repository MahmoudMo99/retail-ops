import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthService } from '../../core/services/auth';
import { AuthUserRole } from '../../features/auth/models/auth-user.model';

import { Permission } from '../../core/auth/permission';
import { AccessControlService } from '../../core/services/access-control';
interface NavItem {
  label: string;
  icon: string;
  route: string;
  permission: Permission;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  readonly authService = inject(AuthService);

  readonly currentUser = this.authService.currentUser;

  readonly userInitials = computed(() => {
    const user = this.currentUser();

    if (!user) {
      return '';
    }

    return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
  });

  readonly accessControl = inject(AccessControlService);

  private readonly allNavSections: NavSection[] = [
    {
      label: 'NAV.OVERVIEW',
      items: [
        {
          label: 'NAV.DASHBOARD',
          icon: 'pi pi-home',
          route: '/dashboard',
          permission: 'dashboard.view',
        },
      ],
    },
    {
      label: 'NAV.MANAGEMENT',
      items: [
        {
          label: 'NAV.PRODUCTS',
          icon: 'pi pi-box',
          route: '/products',
          permission: 'products.view',
        },
        {
          label: 'NAV.ORDERS',
          icon: 'pi pi-shopping-cart',
          route: '/orders',
          permission: 'orders.view',
        },
        {
          label: 'NAV.CUSTOMERS',
          icon: 'pi pi-users',
          route: '/customers',
          permission: 'customers.view',
        },
        {
          label: 'NAV.INVENTORY',
          icon: 'pi pi-warehouse',
          route: '/inventory',
          permission: 'inventory.view',
        },
      ],
    },
    {
      label: 'NAV.INSIGHTS',
      items: [
        {
          label: 'NAV.ANALYTICS',
          icon: 'pi pi-chart-bar',
          route: '/analytics',
          permission: 'analytics.view',
        },
      ],
    },
    {
      label: 'NAV.SYSTEM',
      items: [
        {
          label: 'NAV.USERS',
          icon: 'pi pi-user-edit',
          route: '/users',
          permission: 'users.view',
        },
        {
          label: 'NAV.SETTINGS',
          icon: 'pi pi-cog',
          route: '/settings',
          permission: 'settings.view',
        },
      ],
    },
  ];

  readonly navSections = computed(() =>
    this.allNavSections
      .map((section) => ({
        ...section,

        items: section.items.filter((item) => this.accessControl.hasPermission(item.permission)),
      }))
      .filter((section) => section.items.length > 0),
  );

  getRoleKey(role: AuthUserRole): string {
    return `USERS.ROLES.${role.toUpperCase()}`;
  }
}
