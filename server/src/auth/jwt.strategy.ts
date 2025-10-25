import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { authConfig } from '../config/auth.config';
import type { Role } from './types/auth-response.types';
import * as SYS_MSG from '../helpers/SystemMessages';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: any) => {
          if (req?.cookies) {
            return req.cookies[authConfig.cookie.name];
          }
          return null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'your-secret-key',
    });
  }

  async validate(payload: { sub: string; email: string; role?: Role }) {
    const validationResult = await this.authService.validateUserById(
      payload.sub,
    );

    if (!validationResult.isValid || !validationResult.user) {
      throw new UnauthorizedException(SYS_MSG.TOKEN_VALIDATION_FAILED);
    }
    return validationResult.user;
  }
}
