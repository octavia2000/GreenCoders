import { Controller, Post, Body} from '@nestjs/common';
import { OtpService } from './otp.service';

@Controller('auth')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('verify-otp')
  async verifyOtp(@Body() body: { phoneNumber: string; otp: string }) {
    return this.otpService.verifyOtp(body.phoneNumber, body.otp);
  }

  @Post('resend-otp')
  async resendOtp(@Body('phoneNumber') phoneNumber: string): Promise<{ message: string }> {
    await this.otpService.resendOtp(phoneNumber);
    return { message: 'OTP sent successfully' };
  }

}
