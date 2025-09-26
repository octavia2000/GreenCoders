import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ContentService } from './content.service';
import * as SYS_MSG from '../../helpers/SystemMessages';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    private readonly emailContent: ContentService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('GMAIL_APP_USER'),
        pass: this.configService.get<string>('GMAIL_APP_PASSWORD'),
      },
    });
  }
  /* 
  =======================================
  Send Onboarding Email Method
  ========================================
  */
  async sendOnboardingEmail(email: string, username: string): Promise<{ success: boolean; message: string }> {
    if (!email || !username) {
      throw new BadRequestException(SYS_MSG.MISSING_FIELDS);
    }

    const from = `"${this.configService.get('MAIL_FROM_NAME')}" <${this.configService.get('GMAIL_APP_USER')}>`;
    const eContent = this.emailContent.onboardingMail(email, username);
    
    try {
      const info = await this.transporter.sendMail({
        from: from,
        to: email,
        subject: eContent.subject,
        html: eContent.htmlContent,
      });
      
      this.logger.log(`Onboarding email sent successfully to: ${email}`);
      return { success: true, message: 'Onboarding email sent successfully' };
    } catch (error) {
      this.logger.error(`Failed to send onboarding email to: ${email}`, error);
      throw new BadRequestException(SYS_MSG.EMAIL_SENDING_FAILED);
    }
  }

  /* 
  =======================================
  Send Random Password Method
  ========================================
  */
  async sendRandomPassword(email: string, randomPassword: string): Promise<{ success: boolean; message: string }> {
    if (!email || !randomPassword) {
      throw new BadRequestException(SYS_MSG.MISSING_FIELDS);
    }

    const from = `"${this.configService.get('MAIL_FROM_NAME')}" <${this.configService.get('GMAIL_APP_USER')}>`;
    const pContent = this.emailContent.passwordMail(email, randomPassword);
    
    try {
      const info = await this.transporter.sendMail({
        from: from,
        to: email,
        subject: pContent.subject,
        html: pContent.htmlContent,
      });
      
      this.logger.log(`Password email sent successfully to: ${email}`);
      return { success: true, message: 'Password email sent successfully' };
    } catch (error) {
      this.logger.error(`Failed to send password email to: ${email}`, error);
      throw new BadRequestException(SYS_MSG.EMAIL_SENDING_FAILED);
    }
  }

  /* 
  =======================================
  Send OTP Email Method
  ========================================
  */
  async sendOtpEmail(user: { email: string; username?: string }, otp: string): Promise<{ success: boolean; message: string }> {
    if (!user?.email || !otp) {
      throw new BadRequestException(SYS_MSG.MISSING_FIELDS);
    }

    const from = `"${this.configService.get('MAIL_FROM_NAME')}" <${this.configService.get('GMAIL_APP_USER')}>`;
    const subject = 'Verify your email - 4-digit OTP';
    const html = `<p>Hello ${user.username || ''},</p><p>Your 4-digit verification code is <b>${otp}</b>. It expires in 5 minutes.</p>`;
    
    try {
      await this.transporter.sendMail({ 
        from, 
        to: user.email, 
        subject, 
        html 
      });
      
      this.logger.log(`4-digit OTP email sent successfully to: ${user.email}`);
      return { success: true, message: '4-digit OTP email sent successfully' };
    } catch (error) {
      this.logger.error(`Failed to send OTP email to: ${user.email}`, error);
      throw new BadRequestException(SYS_MSG.OTP_EMAIL_FAILED);
    }
  }
}



