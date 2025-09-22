import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SigninService } from './signin.service';
import { JwtUtils } from './jwt.utils';
import { signinController } from './signin.controller';
import { SmsService } from 'src/users/utils/sms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/users/user.module';
import { UserEntity } from 'src/users/user.entity';
import { SmsModule } from 'src/users/utils/sms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('jwtSecret') || 'secret-key',
        signOptions: { expiresIn: config.get<string>('jwtExpiresIn') || '7d' }, 
      }),
    }), SmsModule
  ],
  providers: [SigninService, JwtUtils,],
  controllers: [signinController],
})
export class SigninModule{}