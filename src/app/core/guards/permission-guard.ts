import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Permission } from '../auth/permission';
import { AccessControlService } from '../services/access-control';

export const permissionGuard: CanActivateFn = (route) => {
  const accessControl = inject(AccessControlService);

  const router = inject(Router);

  const permission = route.data['permission'] as Permission | undefined;

  if (!permission) {
    return true;
  }

  if (accessControl.hasPermission(permission)) {
    return true;
  }

  return router.createUrlTree(['/forbidden']);
};
