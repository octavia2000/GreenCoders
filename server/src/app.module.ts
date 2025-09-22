import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { OtpModule } from './users/verifyNumber/otp.module';
import { SigninModule } from './users/auth/signinAuth/signin.module';
import { SignupModule } from './users/auth/signupAuth/signup.module';
import { PasswordModule } from './users/passwordRecovery/password.modulee';
import databaseConfig from './config/database.config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule.forRoot({isGlobal: true,load: [databaseConfig],envFilePath: '.env'}),
            DatabaseModule, OtpModule,SigninModule,SignupModule,PasswordModule,],
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
