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
  async sendOnboardingEmail(
    email: string,
    username: string,
  ): Promise<{ success: boolean; message: string }> {
    if (!email || !username) {
      throw new BadRequestException(SYS_MSG.MISSING_FIELDS);
    }

    const from = `"${this.configService.get('MAIL_FROM_NAME')}" <${this.configService.get('GMAIL_APP_USER')}>`;
    const eContent = this.emailContent.onboardingMail(email, username);

    try {
      await this.transporter.sendMail({
        from: from,
        to: email,
        subject: eContent.subject,
        html: eContent.htmlContent,
      });

      this.logger.log(`Onboarding email sent successfully to: ${email}`);
      return { success: true, message: SYS_MSG.ONBOARDING_EMAIL_SENT };
    } catch (error) {
      this.logger.error(`Failed to send onboarding email to: ${email}`, error);
      throw new BadRequestException(SYS_MSG.EMAIL_SENDING_FAILED);
    }
  }

  /* 
  =======================================
  Send OTP Email Method
  ========================================
  */
  async sendOtpEmail(
    user: { email: string; username?: string },
    otp: string,
  ): Promise<{ success: boolean; message: string }> {
    if (!user?.email || !otp) {
      throw new BadRequestException(SYS_MSG.MISSING_FIELDS);
    }

    const from = `"${this.configService.get('MAIL_FROM_NAME')}" <${this.configService.get('GMAIL_APP_USER')}>`;
    const otpContent = this.emailContent.otpMail(user.username || 'User', otp);

    try {
      await this.transporter.sendMail({
        from,
        to: user.email,
        subject: otpContent.subject,
        html: otpContent.htmlContent,
      });

      this.logger.log(`OTP email sent successfully to: ${user.email}`);
      return { success: true, message: SYS_MSG.OTP_EMAIL_SENT };
    } catch (error) {
      this.logger.error(`Failed to send OTP email to: ${user.email}`, error);
      throw new BadRequestException(SYS_MSG.OTP_EMAIL_FAILED);
    }
  }

  /* 
  =======================================
  Send Password Reset OTP Method
  ========================================
  */
  async sendPasswordResetOtp(
    email: string,
    otpCode: string,
  ): Promise<{ success: boolean; message: string }> {
    if (!email || !otpCode) {
      throw new BadRequestException(SYS_MSG.MISSING_FIELDS);
    }

    const from = `"${this.configService.get('MAIL_FROM_NAME')}" <${this.configService.get('GMAIL_APP_USER')}>`;
    const resetContent = this.emailContent.passwordResetMail(otpCode);

    try {
      await this.transporter.sendMail({
        from,
        to: email,
        subject: resetContent.subject,
        html: resetContent.htmlContent,
      });

      this.logger.log(
        `Password reset OTP email sent successfully to: ${email}`,
      );
      return { success: true, message: SYS_MSG.PASSWORD_RESET_OTP_EMAIL_SENT };
    } catch (error) {
      this.logger.error(
        `Failed to send password reset OTP email to: ${email}`,
        error,
      );
      throw new BadRequestException(SYS_MSG.EMAIL_SENDING_FAILED);
    }
  }

  /* 
  =======================================
  Send Admin Invitation Email Method
  ========================================
  */
  async sendAdminInvitationEmail(
    email: string,
    adminType: string,
    invitationToken: string,
    invitedByName: string,
    department?: string,
    message?: string,
  ): Promise<{ success: boolean; message: string }> {
    if (!email || !adminType || !invitationToken || !invitedByName) {
      throw new BadRequestException(SYS_MSG.MISSING_FIELDS);
    }

    const from = `"${this.configService.get('MAIL_FROM_NAME')}" <${this.configService.get('GMAIL_APP_USER')}>`;
    const eContent = this.emailContent.adminInvitationMail(
      email,
      adminType,
      invitationToken,
      invitedByName,
      department,
      message,
    );

    try {
      await this.transporter.sendMail({
        from: from,
        to: email,
        subject: eContent.subject,
        html: eContent.htmlContent,
      });

      this.logger.log(`Admin invitation email sent successfully to: ${email}`);
      return { success: true, message: 'Admin invitation email sent successfully' };
    } catch (error) {
      this.logger.error(`Failed to send admin invitation email to: ${email}`, error);
      throw new BadRequestException(SYS_MSG.EMAIL_SENDING_FAILED);
    }
  }
}
