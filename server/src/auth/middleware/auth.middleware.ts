import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth.service';
import { Role } from '../types/auth-response.types';
import { authConfig } from '../../config/auth.config';
import * as SYS_MSG from '../../helpers/SystemMessages';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: Role;
    username: string;
  };
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const token = this.extractTokenFromRequest(req);

      if (!token) {
        throw new UnauthorizedException(SYS_MSG.AUTH_TOKEN_MISSING);
      }

      const payload = await this.authService.validateToken(token);
      const user = await this.authService.getUserFromToken(payload);

      // Attach user to request
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        username: user.username,
      };

      next();
    } catch (error) {
      throw new UnauthorizedException(SYS_MSG.TOKEN_VALIDATION_FAILED);
    }
  }

  private extractTokenFromRequest(req: Request): string | null {
    // Try Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Try cookies using auth config
    const cookieToken = req.cookies?.[authConfig.cookie.name];
    if (cookieToken) {
      return cookieToken;
    }

    return null;
  }
}
