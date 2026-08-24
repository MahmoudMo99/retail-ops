import { computed, inject, Injectable } from '@angular/core';

import { Permission } from '../auth/permission';
import { ROLE_PERMISSIONS } from '../auth/role-permissions';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root',
})
export class AccessControlService {
  private readonly authService = inject(AuthService);

  readonly permissions = computed<readonly Permission[]>(() => {
    const role = this.authService.currentUser()?.role;

    if (!role) {
      return [];
    }

    return ROLE_PERMISSIONS[role];
  });

  hasPermission(permission: Permission): boolean {
    return this.permissions().includes(permission);
  }

  hasAnyPermission(permissions: readonly Permission[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission));
  }

  hasAllPermissions(permissions: readonly Permission[]): boolean {
    return permissions.every((permission) => this.hasPermission(permission));
  }
}
