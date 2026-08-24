import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { authInterceptor } from './core/interceptors/auth-interceptor';

import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';

import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { firstValueFrom } from 'rxjs';
import { routes } from './app.routes';
import { AuthService } from './core/services/auth';
import { primeUiLicense } from '../environments/primeui-license.generated';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideAppInitializer(() => {
      const authService = inject(AuthService);

      return firstValueFrom(authService.restoreSession());
    }),

    provideRouter(routes),

    provideHttpClient(withInterceptors([authInterceptor])),

    providePrimeNG({
      license: primeUiLicense,

      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.app-dark',
        },
      },

      ripple: true,
    }),

    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '.json',
      }),
      fallbackLang: 'en',
      lang: 'en',
    }),
  ],
};
