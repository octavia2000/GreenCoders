import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserEntity } from '../users/entities/user.entity';
import { EmailModule } from '../shared/notifications/email.module';
import { SmsModule } from '../shared/notifications/sms.module';
import { PhoneNormalizerService } from '../shared/phone-normalizer.service';
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
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PhoneNormalizerService],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {
  // Auth module for handling authentication
}
