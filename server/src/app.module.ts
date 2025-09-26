import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import databaseConfig from './config/database.config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true,load: [databaseConfig],envFilePath: '.env'}),
    DatabaseModule, 
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

/**
 * EndPoints
 * SignUp  POST/auth/signup
 * Login   POST/auth/login
 * Logout  POST/auth/logout
 * Verify otp  POST/auth/verify-otp
 * Resend otp  POST/auth/resend-otp
 * Foget password  POST/auth/forget-password
 * Reset password  POST/auth/reset-password
 * 
 * .config for sms
 * SENDCHAMP_API_KEY=sendchamp_live_$2a$10$FbLROTgE9wNoAAwc..CpBOtPTVOgkJhXydhaqjQhPpp6DNtyVln/m
 * SENDCHAMP_BASE_URL=https://api.sendchamp.com/api/v1
 * SENDCHAMP_SENDER_ID=Sendchamp
 */

