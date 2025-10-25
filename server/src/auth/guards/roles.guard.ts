import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../types/auth-response.types';
import { ROLES_KEY } from '../decorators/roles.decorator';
import * as SYS_MSG from '../../helpers/SystemMessages';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(), // Method-level decorator
      context.getClass(), // Class-level decorator
    ]);

    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    // Get the user from the request (JWT already validated)
    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new UnauthorizedException(SYS_MSG.AUTHENTICATION_REQUIRED);
    }
    // Check if user has ANY of the required roles
    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw new ForbiddenException(
        `${SYS_MSG.ACCESS_DENIED_ROLE} ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
