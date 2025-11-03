import { SetMetadata } from '@nestjs/common';
import { AdminPermission } from '../../admin/constants/admin-permissions';

export const PERMISSIONS_KEY = 'permissions';

// Decorator that accepts both individual permissions and permission arrays
export const RequirePermissions = (...permissionsOrArrays: (AdminPermission | AdminPermission[])[]) => {
  const flattenedPermissions = permissionsOrArrays.flat();
  return SetMetadata(PERMISSIONS_KEY, flattenedPermissions);
};

