import { DOCUMENT } from '@angular/common';
import { computed, DestroyRef, effect, inject, Injectable, signal } from '@angular/core';

export type ThemePreference = 'light' | 'dark' | 'system';

export type ResolvedTheme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  private readonly destroyRef = inject(DestroyRef);

  private readonly storageKey = 'retailops-theme';

  private readonly mediaQuery = this.document.defaultView?.matchMedia(
    '(prefers-color-scheme: dark)',
  );

  private readonly systemDark = signal(this.mediaQuery?.matches ?? false);

  readonly preference = signal<ThemePreference>(this.getInitialPreference());

  readonly resolvedTheme = computed<ResolvedTheme>(() => {
    const preference = this.preference();

    if (preference === 'system') {
      return this.systemDark() ? 'dark' : 'light';
    }

    return preference;
  });

  constructor() {
    const listener = (event: MediaQueryListEvent) => {
      this.systemDark.set(event.matches);
    };

    this.mediaQuery?.addEventListener('change', listener);

    this.destroyRef.onDestroy(() => {
      this.mediaQuery?.removeEventListener('change', listener);
    });

    effect(() => {
      const preference = this.preference();

      const theme = this.resolvedTheme();

      const root = this.document.documentElement;

      root.classList.toggle('app-dark', theme === 'dark');

      root.dataset['theme'] = theme;
      root.style.colorScheme = theme;

      this.document.defaultView?.localStorage.setItem(this.storageKey, preference);
    });
  }

  setTheme(preference: ThemePreference): void {
    this.preference.set(preference);
  }

  toggleTheme(): void {
    this.preference.set(this.resolvedTheme() === 'dark' ? 'light' : 'dark');
  }

  private getInitialPreference(): ThemePreference {
    const stored = this.document.defaultView?.localStorage.getItem(this.storageKey);

    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }

    return 'system';
  }
}
