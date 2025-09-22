import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SmsService {
  
  private readonly logger = new Logger(SmsService.name);
  private readonly apiKey: string;
  private readonly senderId: string;
  private readonly baseUrl: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService, // HttpService for API calls
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


  async sendOtp(phone: string, otp: string): Promise<void> {
    const champNumber = this.formatPhoneNumber(phone);
    const message = `Your verification code is: ${otp}. Verify Now.This code will expire in 5 minutes.`;

    // Debugging

    // this.logger.debug(`Original: ${phone}, Formatted to: ${champNumber}`);
    //Console message
    if (!this.apiKey || !this.senderId) {
      this.logger.log(`TEST SMS: Sending OTP ${otp} to ${champNumber}`);
      return;
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
      //this.logger.debug('SendChamp response:', response.data);

    } catch (error) {
      this.logger.error(`Failed to send OTP to ${champNumber}:`)
    }
  }

  private formatPhoneNumber(phonenumber: string): string {
    let sendchampNumber = phonenumber

    if (sendchampNumber.startsWith('234') && sendchampNumber.length === 13) {
      return sendchampNumber; // SendChamp wants 2348012345678
    } else if (sendchampNumber.startsWith('0') && sendchampNumber.length === 11) {
      return '234' + sendchampNumber.substring(1);
    } else if (sendchampNumber.startsWith('+234') && sendchampNumber.length === 14) {
      return sendchampNumber.substring(1);
    }

    this.logger.warn(`Unrecognized phone number format: ${phonenumber}. Using as-is.`);
    return sendchampNumber;
  }
}

