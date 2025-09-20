import { Module } from '@nestjs/common';
import { signUpService } from './signup.service';
import { SignupController } from './signup.controller';
import { UserModule } from 'src/users/user.module';
import { OtpModule } from 'src/users/verifyNumber/otp.module';
import { EmailModule } from 'src/users/utils/emailmodule';
import { SmsModule } from 'src/users/utils/sms.module';

@Module({
  imports: [UserModule,OtpModule,EmailModule,SmsModule],
  providers: [signUpService],
  controllers: [SignupController],
})
export class SignupModule {}

