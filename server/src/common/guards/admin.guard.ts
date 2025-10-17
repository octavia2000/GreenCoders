import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Role } from '../../users/types/user-response.types';
import * as SYS_MSG from '../../helpers/SystemMessages';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user) {
      throw new UnauthorizedException(SYS_MSG.AUTHENTICATION_REQUIRED);
    }
    
    const ADMIN_ROLE: Role = 'ADMIN';
    if (user.role !== ADMIN_ROLE) {
      throw new ForbiddenException(SYS_MSG.ACCESS_DENIED_ADMIN);
    }
    
    return true;
  }
}

