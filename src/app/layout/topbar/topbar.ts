import {
  Component,
  computed,
  DestroyRef,
  HostListener,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter } from 'rxjs';

import { AuthService } from '../../core/services/auth';
import { LanguageService } from '../../core/services/language';
import { NotificationsService } from '../../core/services/notifications';
import { ThemeService } from '../../core/services/theme';
import { AuthUserRole } from '../../features/auth/models/auth-user.model';
import { GlobalSearch } from '../global-search/global-search';
import { NotificationCenter } from '../notification-center/notification-center';

@Component({
  selector: 'app-topbar',
  imports: [TranslatePipe, GlobalSearch, NotificationCenter],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  private readonly router = inject(Router);

  private readonly destroyRef = inject(DestroyRef);

  private readonly globalSearch = viewChild(GlobalSearch);

  readonly authService = inject(AuthService);

  readonly languageService = inject(LanguageService);

  readonly themeService = inject(ThemeService);

  readonly notificationsService = inject(NotificationsService);

  readonly menuToggle = output<void>();

  readonly currentUser = this.authService.currentUser;

  readonly titleKey = signal('NAV.DASHBOARD');

  readonly subtitleKey = signal('TOPBAR.DASHBOARD_SUBTITLE');

  readonly notificationsOpen = signal(false);

  readonly profileMenuOpen = signal(false);

  readonly userInitials = computed(() => {
    const user = this.currentUser();

    if (!user) {
      return '';
    }

    return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
  });

  constructor() {
    this.updateRouteData();

    this.notificationsService.load();

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.updateRouteData();

        this.closeNotifications();
        this.closeProfileMenu();
      });
  }

  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  openGlobalSearch(): void {
    this.closeNotifications();
    this.closeProfileMenu();

    this.globalSearch()?.open();
  }

  toggleNotifications(): void {
    this.closeProfileMenu();

    this.notificationsOpen.update((open) => !open);

    if (this.notificationsOpen()) {
      this.notificationsService.load();
    }
  }

  closeNotifications(): void {
    this.notificationsOpen.set(false);
  }

  toggleProfileMenu(): void {
    this.closeNotifications();

    this.profileMenuOpen.update((open) => !open);
  }

  closeProfileMenu(): void {
    this.profileMenuOpen.set(false);
  }

  goToSettings(): void {
    this.closeProfileMenu();

    this.router.navigateByUrl('/settings');
  }

  getRoleKey(role: AuthUserRole): string {
    return `USERS.ROLES.${role.toUpperCase()}`;
  }

  logout(): void {
    this.closeNotifications();
    this.closeProfileMenu();

    this.authService.logout();

    this.router.navigateByUrl('/login');
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeProfileMenu();
  }

  private updateRouteData(): void {
    let route = this.router.routerState.snapshot.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    this.titleKey.set(route.data['topbarTitle'] ?? 'NAV.DASHBOARD');

    this.subtitleKey.set(route.data['topbarSubtitle'] ?? 'TOPBAR.DASHBOARD_SUBTITLE');
  }
}
