import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminPermission } from '../../admin/constants/admin-permissions';
import { hasPermission } from '../../admin/constants/admin-permissions';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { Role } from '../types/auth-response.types';
import * as SYS_MSG from '../../helpers/SystemMessages';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<AdminPermission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no permissions are required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // Get the user from the request (JWT already validated)
    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new UnauthorizedException(SYS_MSG.AUTHENTICATION_REQUIRED);
    }

    // Check if user has admin role
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException(SYS_MSG.ACCESS_DENIED_ADMIN);
    }

    // Check if user has ANY of the required permissions
    const userPermissions = user.permissions || [];
    const hasRequiredPermission = requiredPermissions.some((permission) =>
      hasPermission(userPermissions, permission),
    );

    if (!hasRequiredPermission) {
      throw new ForbiddenException(
        `${SYS_MSG.ADMIN_PERMISSION_DENIED} ${requiredPermissions.join(', ')}`,
      );
    }

    return true;
  }
}

