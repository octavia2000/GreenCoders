import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as SYS_MSG from '../../helpers/SystemMessages';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly apiKey: string;
  private readonly senderId: string;
  private readonly baseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get<string>('SENDCHAMP_API_KEY');
    this.senderId = this.configService.get<string>('SENDCHAMP_SENDER_ID');
    this.baseUrl = this.configService.get<string>('SENDCHAMP_BASE_URL');

    if (!this.apiKey || !this.senderId) {
      this.logger.warn('SendChamp credentials not found. Test SMS will be sent.');
    } else {
      this.logger.log('SendChamp SMS service initialized');
    }
  }


  /* 
  =======================================
  Send OTP Method
  ========================================
  */
  async sendOtp(phone: string, otp: string): Promise<{ success: boolean; message: string }> {
    if (!phone || !otp) {
      throw new BadRequestException(SYS_MSG.MISSING_FIELDS);
    }

    const champNumber = this.formatPhoneNumber(phone);
    console.log('📱 SMS Service - Sending OTP:', otp, 'to:', champNumber);
    const message = `GreenCoders
Your verification code is ${otp}
Verify Now
This code will expire in 5 minutes.`;

    // Test mode if credentials not available
    if (!this.apiKey || !this.senderId) {
      this.logger.log(`TEST SMS: Sending OTP ${otp} to ${champNumber}`);
      return { success: true, message: 'Test SMS sent successfully' };
    }

    try {
      const url = `${this.baseUrl}/sms/send`;

      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      const data = {
        to: champNumber,
        message: message,
        sender_name: this.senderId,
        route: 'dnd', // dnd for otps
      };

      const response = await firstValueFrom(
        this.httpService.post(url, data, { headers })
      );

      this.logger.log(`OTP sent successfully to ${champNumber}. Status: ${response.data.status}`);
      return { success: true, message: 'OTP sent successfully' };

    } catch (error) {
      this.logger.error(`Failed to send OTP to ${champNumber}:`, error);
      throw new BadRequestException(SYS_MSG.OTP_SEND_FAILED);
    }
  }

  /* 
  =======================================
  Format Phone Number Method
  ========================================
  */
  private formatPhoneNumber(phoneNumber: string): string {
    if (!phoneNumber) {
      throw new BadRequestException(SYS_MSG.INVALID_PHONE_FORMAT);
    }

    let sendchampNumber = phoneNumber.trim();

    // Handle different Nigerian phone number formats
    if (sendchampNumber.startsWith('234') && sendchampNumber.length === 13) {
      return sendchampNumber; // SendChamp wants 2348012345678
    } else if (sendchampNumber.startsWith('0') && sendchampNumber.length === 11) {
      return '234' + sendchampNumber.substring(1);
    } else if (sendchampNumber.startsWith('+234') && sendchampNumber.length === 14) {
      return sendchampNumber.substring(1);
    }

    this.logger.warn(`Unrecognized phone number format: ${phoneNumber}. Using as-is.`);
    return sendchampNumber;
  }
}


