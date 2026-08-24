import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { SortIcon, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { debounceTime, distinctUntilChanged, finalize, Subject } from 'rxjs';

import { UserForm } from '../../components/user-form/user-form';
import { UserPayload } from '../../models/user-payload.model';
import { AppUser, UserRole } from '../../models/user.model';
import { UserSortOrder, UsersQuery } from '../../models/users-query.model';
import { UsersService } from '../../services/users';

@Component({
  selector: 'app-users',
  imports: [TableModule, SortIcon, DialogModule, ConfirmDialogModule, TranslatePipe, UserForm],
  providers: [ConfirmationService],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  private readonly usersService = inject(UsersService);

  private readonly confirmationService = inject(ConfirmationService);

  private readonly translate = inject(TranslateService);

  private readonly destroyRef = inject(DestroyRef);

  private readonly searchSubject = new Subject<string>();

  readonly users = signal<AppUser[]>([]);

  readonly total = signal(0);
  readonly loading = signal(false);
  readonly error = signal(false);

  readonly first = signal(0);
  readonly rows = signal(10);
  readonly searchTerm = signal('');

  readonly selectedUser = signal<AppUser | null>(null);

  readonly detailsVisible = signal(false);
  readonly detailsLoading = signal(false);

  readonly formVisible = signal(false);
  readonly formSubmitting = signal(false);
  readonly editingUser = signal<AppUser | null>(null);

  readonly deletingUserId = signal<number | null>(null);

  private sortBy?: string;
  private sortOrder?: UserSortOrder;

  constructor() {
    this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.searchTerm.set(value);
        this.first.set(0);

        this.loadUsers();
      });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.searchSubject.next(value);
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 10);

    if (typeof event.sortField === 'string' && event.sortOrder) {
      this.sortBy = event.sortField;

      this.sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';
    } else {
      this.sortBy = undefined;
      this.sortOrder = undefined;
    }

    this.loadUsers();
  }

  viewUser(id: number): void {
    this.detailsLoading.set(true);
    this.detailsVisible.set(true);
    this.selectedUser.set(null);

    this.usersService
      .getUserById(id)
      .pipe(
        finalize(() => {
          this.detailsLoading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (user) => {
          this.selectedUser.set(user);
        },
        error: () => {
          this.detailsVisible.set(false);
        },
      });
  }

  openAddUser(): void {
    this.editingUser.set(null);
    this.formVisible.set(true);
  }

  openEditUser(user: AppUser): void {
    this.editingUser.set(user);
    this.formVisible.set(true);
  }

  closeUserForm(): void {
    if (this.formSubmitting()) {
      return;
    }

    this.formVisible.set(false);
    this.editingUser.set(null);
  }

  saveUser(payload: UserPayload): void {
    const user = this.editingUser();

    this.formSubmitting.set(true);

    const request$ = user
      ? this.usersService.updateUser(user.id, payload)
      : this.usersService.addUser(payload);

    request$
      .pipe(
        finalize(() => {
          this.formSubmitting.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (savedUser) => {
          if (user) {
            this.users.update((users) =>
              users.map((item) =>
                item.id === user.id
                  ? {
                      ...item,
                      ...savedUser,
                    }
                  : item,
              ),
            );
          } else {
            this.users.update((users) => [savedUser, ...users]);

            this.total.update((total) => total + 1);
          }

          this.formVisible.set(false);
          this.editingUser.set(null);
        },
      });
  }

  confirmDelete(event: Event, user: AppUser): void {
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,

      header: this.translate.instant('USERS.DELETE.TITLE'),

      message: this.translate.instant('USERS.DELETE.MESSAGE', {
        name: `${user.firstName} ${user.lastName}`,
      }),

      icon: 'pi pi-exclamation-triangle',

      acceptLabel: this.translate.instant('USERS.DELETE.CONFIRM'),

      rejectLabel: this.translate.instant('COMMON.CANCEL'),

      acceptButtonStyleClass: 'p-button-danger',

      rejectButtonStyleClass: 'p-button-text',

      accept: () => {
        this.deleteUser(user.id);
      },
    });
  }

  getRoleKey(role: UserRole): string {
    return `USERS.ROLES.${role.toUpperCase()}`;
  }

  getInitials(user: AppUser): string {
    return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
  }

  private deleteUser(id: number): void {
    this.deletingUserId.set(id);

    this.usersService
      .deleteUser(id)
      .pipe(
        finalize(() => {
          this.deletingUserId.set(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.users.update((users) => users.filter((user) => user.id !== id));

          this.total.update((total) => Math.max(total - 1, 0));
        },
      });
  }

  private loadUsers(): void {
    const query: UsersQuery = {
      limit: this.rows(),
      skip: this.first(),
      search: this.searchTerm(),
      sortBy: this.sortBy,
      order: this.sortOrder,
    };

    this.loading.set(true);
    this.error.set(false);

    this.usersService
      .getUsers(query)
      .pipe(
        finalize(() => {
          this.loading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response) => {
          this.users.set(response.users);

          this.total.set(response.total);
        },
        error: () => {
          this.users.set([]);
          this.total.set(0);
          this.error.set(true);
        },
      });
  }
}
