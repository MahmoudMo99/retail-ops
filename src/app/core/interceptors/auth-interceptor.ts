import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);

  const router = inject(Router);

  const isLoginRequest = request.url.endsWith('/auth/login');

  const isRefreshRequest = request.url.endsWith('/auth/refresh');

  const shouldSkipAuth = isLoginRequest || isRefreshRequest;

  const accessToken = authService.getAccessToken();

  const authenticatedRequest =
    accessToken && !shouldSkipAuth
      ? request.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      : request;

  return next(authenticatedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || shouldSkipAuth) {
        return throwError(() => error);
      }

      if (!authService.getRefreshToken()) {
        authService.logout();

        redirectToLogin(router);

        return throwError(() => error);
      }

      return authService.refreshAccessToken().pipe(
        switchMap((newAccessToken) => {
          const retryRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          });

          return next(retryRequest);
        }),
        catchError((refreshError) => {
          authService.logout();

          redirectToLogin(router);

          return throwError(() => refreshError);
        }),
      );
    }),
  );
};

function redirectToLogin(router: Router): void {
  if (router.url.startsWith('/login')) {
    return;
  }

  const returnUrl = router.url;

  router.navigate(['/login'], {
    queryParams: {
      returnUrl,
    },
  });
}
