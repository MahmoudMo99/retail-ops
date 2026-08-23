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

  private readonly mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  private readonly systemPrefersDark = signal(this.mediaQuery.matches);

  readonly preference = signal<ThemePreference>(this.getInitialTheme());

  readonly resolvedTheme = computed<ResolvedTheme>(() => {
    const preference = this.preference();

    if (preference === 'system') {
      return this.systemPrefersDark() ? 'dark' : 'light';
    }

    return preference;
  });

  readonly isDark = computed(() => this.resolvedTheme() === 'dark');

  constructor() {
    this.mediaQuery.addEventListener('change', this.handleSystemThemeChange);

    this.destroyRef.onDestroy(() => {
      this.mediaQuery.removeEventListener('change', this.handleSystemThemeChange);
    });

    effect(() => {
      const preference = this.preference();
      const resolvedTheme = this.resolvedTheme();

      this.document.documentElement.classList.toggle('app-dark', resolvedTheme === 'dark');

      this.document.documentElement.dataset['theme'] = resolvedTheme;

      this.document.documentElement.style.colorScheme = resolvedTheme;

      localStorage.setItem(this.storageKey, preference);
    });
  }

  toggleTheme(): void {
    this.preference.set(this.isDark() ? 'light' : 'dark');
  }

  setTheme(theme: ThemePreference): void {
    this.preference.set(theme);
  }

  private readonly handleSystemThemeChange = (event: MediaQueryListEvent): void => {
    this.systemPrefersDark.set(event.matches);
  };

  private getInitialTheme(): ThemePreference {
    const savedTheme = localStorage.getItem(this.storageKey);

    if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
      return savedTheme;
    }

    return 'system';
  }
}
