import {
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Permission } from '../../core/auth/permission';
import { AccessControlService } from '../../core/services/access-control';
import { LanguageService } from '../../core/services/language';

interface SearchItem {
  titleKey: string;
  subtitleKey: string;
  icon: string;
  route: string;
  permission: Permission;
}

@Component({
  selector: 'app-global-search',
  imports: [TranslatePipe],
  templateUrl: './global-search.html',
  styleUrl: './global-search.scss',
})
export class GlobalSearch {
  private readonly router = inject(Router);

  private readonly translate = inject(TranslateService);

  private readonly accessControl = inject(AccessControlService);

  private readonly languageService = inject(LanguageService);

  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  readonly visible = signal(false);

  readonly query = signal('');

  readonly selectedIndex = signal(0);

  private readonly allItems: readonly SearchItem[] = [
    {
      titleKey: 'NAV.DASHBOARD',
      subtitleKey: 'TOPBAR.DASHBOARD_SUBTITLE',
      icon: 'pi pi-home',
      route: '/dashboard',
      permission: 'dashboard.view',
    },
    {
      titleKey: 'NAV.PRODUCTS',
      subtitleKey: 'TOPBAR.PRODUCTS_SUBTITLE',
      icon: 'pi pi-box',
      route: '/products',
      permission: 'products.view',
    },
    {
      titleKey: 'NAV.ORDERS',
      subtitleKey: 'TOPBAR.ORDERS_SUBTITLE',
      icon: 'pi pi-shopping-cart',
      route: '/orders',
      permission: 'orders.view',
    },
    {
      titleKey: 'NAV.CUSTOMERS',
      subtitleKey: 'TOPBAR.CUSTOMERS_SUBTITLE',
      icon: 'pi pi-users',
      route: '/customers',
      permission: 'customers.view',
    },
    {
      titleKey: 'NAV.INVENTORY',
      subtitleKey: 'TOPBAR.INVENTORY_SUBTITLE',
      icon: 'pi pi-warehouse',
      route: '/inventory',
      permission: 'inventory.view',
    },
    {
      titleKey: 'NAV.ANALYTICS',
      subtitleKey: 'TOPBAR.ANALYTICS_SUBTITLE',
      icon: 'pi pi-chart-bar',
      route: '/analytics',
      permission: 'analytics.view',
    },
    {
      titleKey: 'NAV.USERS',
      subtitleKey: 'TOPBAR.USERS_SUBTITLE',
      icon: 'pi pi-user-edit',
      route: '/users',
      permission: 'users.view',
    },
    {
      titleKey: 'NAV.SETTINGS',
      subtitleKey: 'TOPBAR.SETTINGS_SUBTITLE',
      icon: 'pi pi-cog',
      route: '/settings',
      permission: 'settings.view',
    },
  ];

  readonly availableItems = computed(() => {
    return this.allItems.filter((item) => this.accessControl.hasPermission(item.permission));
  });

  readonly filteredItems = computed(() => {
    this.languageService.currentLanguage();

    const query = this.query().trim().toLocaleLowerCase();

    const items = this.availableItems();

    if (!query) {
      return items;
    }

    return items.filter((item) => {
      const title = this.translate.instant(item.titleKey).toLocaleLowerCase();

      const subtitle = this.translate.instant(item.subtitleKey).toLocaleLowerCase();

      const route = item.route.replace('/', '').toLocaleLowerCase();

      return title.includes(query) || subtitle.includes(query) || route.includes(query);
    });
  });

  open(): void {
    this.visible.set(true);
    this.query.set('');
    this.selectedIndex.set(0);

    setTimeout(() => {
      this.searchInput()?.nativeElement.focus();
    });
  }

  close(): void {
    this.visible.set(false);
    this.query.set('');
    this.selectedIndex.set(0);
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.query.set(value);
    this.selectedIndex.set(0);
  }

  selectItem(item: SearchItem): void {
    this.close();

    this.router.navigateByUrl(item.route);
  }

  onInputKeydown(event: KeyboardEvent): void {
    const items = this.filteredItems();

    if (event.key === 'ArrowDown') {
      event.preventDefault();

      if (!items.length) {
        return;
      }

      this.selectedIndex.update((index) => (index >= items.length - 1 ? 0 : index + 1));

      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();

      if (!items.length) {
        return;
      }

      this.selectedIndex.update((index) => (index <= 0 ? items.length - 1 : index - 1));

      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();

      const item = items[this.selectedIndex()];

      if (item) {
        this.selectItem(item);
      }

      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();

      this.close();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleGlobalShortcut(event: KeyboardEvent): void {
    const isShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';

    if (!isShortcut) {
      if (event.key === 'Escape' && this.visible()) {
        this.close();
      }

      return;
    }

    event.preventDefault();

    if (this.visible()) {
      this.close();

      return;
    }

    this.open();
  }
}
