import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthService } from '../../core/services/auth';
import { AuthUserRole } from '../../features/auth/models/auth-user.model';

interface NavItem {
  label: string;
  icon: string;
  route: string;
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

  readonly navSections: NavSection[] = [
    {
      label: 'NAV.OVERVIEW',
      items: [
        {
          label: 'NAV.DASHBOARD',
          icon: 'pi pi-home',
          route: '/dashboard',
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
        },
        {
          label: 'NAV.ORDERS',
          icon: 'pi pi-shopping-cart',
          route: '/orders',
        },
        {
          label: 'NAV.CUSTOMERS',
          icon: 'pi pi-users',
          route: '/customers',
        },
        {
          label: 'NAV.INVENTORY',
          icon: 'pi pi-warehouse',
          route: '/inventory',
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
        },
        {
          label: 'NAV.SETTINGS',
          icon: 'pi pi-cog',
          route: '/settings',
        },
      ],
    },
  ];

  getRoleKey(role: AuthUserRole): string {
    return `USERS.ROLES.${role.toUpperCase()}`;
  }
}
