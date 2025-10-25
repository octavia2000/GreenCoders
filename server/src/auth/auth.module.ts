import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { IsStrongPasswordConstraint } from './validators/password.validator';
import { UserEntity } from '../database/entities/user.entity';
import { EmailModule } from '../shared/notifications/email.module';
import { SmsModule } from '../shared/notifications/sms.module';
import { PhoneNormalizerService } from '../helpers/phone-normalizer.service';
import { AuthHelperService } from '../helpers/auth-helper.service';
import { authConfig } from '../config/auth.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: authConfig.jwt.secret,
      signOptions: { expiresIn: authConfig.jwt.expiresIn },
    }),
    EmailModule,
    SmsModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    PhoneNormalizerService,
    AuthHelperService,
    IsStrongPasswordConstraint,
  ],
  exports: [AuthService, JwtStrategy, PassportModule, AuthHelperService, PhoneNormalizerService, JwtModule],
})
export class AuthModule {
  // Auth module for handling authentication
}
