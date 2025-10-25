import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '../types/auth-response.types';
import * as SYS_MSG from '../../helpers/SystemMessages';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException(SYS_MSG.AUTHENTICATION_REQUIRED);
    }

    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException(SYS_MSG.ACCESS_DENIED_ADMIN);
    }

    return true;
  }
}
