import { Component, computed, DestroyRef, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter } from 'rxjs';

import { AuthService } from '../../core/services/auth';
import { LanguageService } from '../../core/services/language';
import { ThemeService } from '../../core/services/theme';
import { AuthUserRole } from '../../features/auth/models/auth-user.model';

@Component({
  selector: 'app-topbar',
  imports: [TranslatePipe],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  private readonly router = inject(Router);

  private readonly destroyRef = inject(DestroyRef);

  readonly authService = inject(AuthService);

  readonly languageService = inject(LanguageService);

  readonly themeService = inject(ThemeService);

  readonly menuToggle = output<void>();

  readonly currentUser = this.authService.currentUser;

  readonly titleKey = signal('NAV.DASHBOARD');

  readonly subtitleKey = signal('TOPBAR.DASHBOARD_SUBTITLE');

  readonly userInitials = computed(() => {
    const user = this.currentUser();

    if (!user) {
      return '';
    }

    return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
  });

  constructor() {
    this.updateRouteData();

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.updateRouteData();
      });
  }

  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  getRoleKey(role: AuthUserRole): string {
    return `USERS.ROLES.${role.toUpperCase()}`;
  }

  logout(): void {
    this.authService.logout();

    this.router.navigateByUrl('/login');
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
