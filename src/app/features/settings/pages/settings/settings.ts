import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthService } from '../../../../core/services/auth';
import { AppLanguage, LanguageService } from '../../../../core/services/language';
import { ThemePreference, ThemeService } from '../../../../core/services/theme';
import { AuthUserRole } from '../../../auth/models/auth-user.model';

@Component({
  selector: 'app-settings',
  imports: [TranslatePipe],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  private readonly router = inject(Router);

  readonly authService = inject(AuthService);

  readonly themeService = inject(ThemeService);

  readonly languageService = inject(LanguageService);

  readonly currentUser = this.authService.currentUser;

  setTheme(theme: ThemePreference): void {
    this.themeService.setTheme(theme);
  }

  setLanguage(language: AppLanguage): void {
    this.languageService.setLanguage(language);
  }

  getRoleKey(role: AuthUserRole): string {
    return `USERS.ROLES.${role.toUpperCase()}`;
  }

  logout(): void {
    this.authService.logout();

    this.router.navigateByUrl('/login');
  }
}
