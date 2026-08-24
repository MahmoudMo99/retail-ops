import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/services/auth';
import { LanguageService } from '../../../../core/services/language';
import { ThemeService } from '../../../../core/services/theme';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder);

  private readonly router = inject(Router);

  private readonly authService = inject(AuthService);

  readonly languageService = inject(LanguageService);

  readonly themeService = inject(ThemeService);

  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(false);

  readonly loginError = signal(false);

  readonly passwordVisible = signal(false);

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  hasError(controlName: keyof typeof this.form.controls, errorName: string): boolean {
    const control = this.form.controls[controlName];

    return control.touched && control.hasError(errorName);
  }

  togglePassword(): void {
    this.passwordVisible.update((visible) => !visible);
  }

  submit(): void {
    this.form.markAllAsTouched();
    this.loginError.set(false);

    if (this.form.invalid || this.loading()) {
      return;
    }

    this.loading.set(true);

    this.authService
      .login(this.form.getRawValue())
      .pipe(
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: () => {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

          this.router.navigateByUrl(returnUrl || '/dashboard');
        },
        error: () => {
          this.loginError.set(true);
        },
      });
  }
}
