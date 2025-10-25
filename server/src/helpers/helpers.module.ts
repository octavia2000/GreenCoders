import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserEntity } from '../database/entities/user.entity';
import { AuthHelperService } from './auth-helper.service';
import { PhoneNormalizerService } from './phone-normalizer.service';
import { HelperService } from './helper.service';
import { authConfig } from '../config/auth.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: authConfig.jwt.secret,
      signOptions: { expiresIn: authConfig.jwt.expiresIn },
    }),
  ],
  providers: [AuthHelperService, PhoneNormalizerService, HelperService],
  exports: [AuthHelperService, PhoneNormalizerService, HelperService],
})
export class HelpersModule {}
