import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

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
  readonly navSections: NavSection[] = [
    {
      label: 'NAV.OVERVIEW',
      items: [
        {
          label: 'NAV.DASHBOARD',
          icon: 'pi pi-th-large',
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
}
