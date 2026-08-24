import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import {
  catchError,
  finalize,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthTokens } from '../../features/auth/models/auth-tokens.model';
import { AuthUser } from '../../features/auth/models/auth-user.model';
import { LoginCredentials } from '../../features/auth/models/login-credentials.model';
import { LoginResponse } from '../../features/auth/models/login-response.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private readonly accessTokenKey = 'retailops-access-token';

  private readonly refreshTokenKey = 'retailops-refresh-token';

  private refreshRequest$: Observable<string> | null = null;

  readonly currentUser = signal<AuthUser | null>(null);

  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');

  readonly isModerator = computed(() => this.currentUser()?.role === 'moderator');

  login(credentials: LoginCredentials): Observable<AuthUser> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, {
        ...credentials,
        expiresInMins: 30,
      })
      .pipe(
        tap((response) => {
          this.storeTokens({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });
        }),
        switchMap(() => this.getCurrentUser()),
        tap((user) => {
          this.currentUser.set(user);
        }),
        catchError((error) => {
          this.clearSession();

          return throwError(() => error);
        }),
      );
  }

  getCurrentUser(): Observable<AuthUser> {
    if (!this.getAccessToken()) {
      return throwError(() => new Error('No access token available'));
    }

    return this.http.get<AuthUser>(`${this.apiUrl}/me`);
  }

  restoreSession(): Observable<AuthUser | null> {
    if (!this.getAccessToken()) {
      this.currentUser.set(null);

      return of(null);
    }

    return this.getCurrentUser().pipe(
      tap((user) => {
        this.currentUser.set(user);
      }),
      catchError(() => {
        this.clearSession();

        return of(null);
      }),
    );
  }

  refreshAccessToken(): Observable<string> {
    if (this.refreshRequest$) {
      return this.refreshRequest$;
    }

    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.clearSession();

      return throwError(() => new Error('No refresh token available'));
    }

    this.refreshRequest$ = this.http
      .post<AuthTokens>(`${this.apiUrl}/refresh`, {
        refreshToken,
        expiresInMins: 30,
      })
      .pipe(
        tap((tokens) => {
          this.storeTokens(tokens);
        }),
        map((tokens) => tokens.accessToken),
        finalize(() => {
          this.refreshRequest$ = null;
        }),
        shareReplay({
          bufferSize: 1,
          refCount: false,
        }),
      );

    return this.refreshRequest$;
  }

  logout(): void {
    this.clearSession();
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  private storeTokens(tokens: AuthTokens): void {
    localStorage.setItem(this.accessTokenKey, tokens.accessToken);

    localStorage.setItem(this.refreshTokenKey, tokens.refreshToken);
  }

  private clearSession(): void {
    localStorage.removeItem(this.accessTokenKey);

    localStorage.removeItem(this.refreshTokenKey);

    this.currentUser.set(null);
  }
}
