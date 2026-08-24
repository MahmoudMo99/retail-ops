import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

import { UserPayload } from '../../models/user-payload.model';
import { AppUser, UserRole } from '../../models/user.model';
@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm {
  private readonly fb = inject(FormBuilder);

  readonly user = input<AppUser | null>(null);
  readonly submitting = input(false);

  readonly submitted = output<UserPayload>();
  readonly cancelled = output<void>();

  readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(7)]],
    role: this.fb.nonNullable.control<UserRole>('user', Validators.required),
  });

  constructor() {
    effect(() => {
      const user = this.user();

      if (user) {
        this.form.reset({
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: user.role,
        });

        return;
      }

      this.form.reset({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        role: 'user',
      });
    });
  }

  hasError(controlName: keyof typeof this.form.controls, errorName: string): boolean {
    const control = this.form.controls[controlName];

    return control.touched && control.hasError(errorName);
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.submitting()) {
      return;
    }

    this.submitted.emit(this.form.getRawValue());
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
