import { Component, DestroyRef, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter } from 'rxjs';

import { LanguageService } from '../../core/services/language';
import { ThemeService } from '../../core/services/theme';

@Component({
  selector: 'app-topbar',
  imports: [TranslatePipe],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly menuToggle = output<void>();

  readonly languageService = inject(LanguageService);
  readonly themeService = inject(ThemeService);

  readonly titleKey = signal('NAV.DASHBOARD');

  readonly subtitleKey = signal('TOPBAR.DASHBOARD_SUBTITLE');

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

  private updateRouteData(): void {
    let route = this.router.routerState.snapshot.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    this.titleKey.set(route.data['topbarTitle'] ?? 'NAV.DASHBOARD');

    this.subtitleKey.set(route.data['topbarSubtitle'] ?? 'TOPBAR.DASHBOARD_SUBTITLE');
  }
}
