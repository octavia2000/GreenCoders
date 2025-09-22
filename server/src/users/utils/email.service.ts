import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ContentService } from './content.service';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService,
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
  async sendOnboardingEmail(email: string, username: string) {
    const from = `"${this.configService.get('MAIL_FROM_NAME')}" <${this.configService.get('GMAIL_APP_USER')}>`;
    
    const eContent = this.emailContent.onboardingMail(email, username)
    
    try {
      const info = await this.transporter.sendMail({
        from: from,
        to: email,
        subject: eContent.subject,
        html: eContent.htmlContent,
      });
      console.log('Onboarding email sent successfully to:', email, );
    } catch (error) {
      console.error('Failed to send onboarding email to:', email, error);
      throw new Error(`Failed to send onboarding email: ${error.message}`);
    }
  }

  async sendRandomPassword(email: string, randomPassword: string) {
    const from = `"${this.configService.get('MAIL_FROM_NAME')}" <${this.configService.get('GMAIL_APP_USER')}>`;
    
    const pContent = this.emailContent.passwordMail(email,randomPassword)
    try {
      const info = await this.transporter.sendMail({
        from: from,
        to: email,
        subject: pContent.subject,
        html: pContent.htmlContent,
      });
      console.log('Password email sent successfully to:', email);
    } catch (error) {
      console.error('Failed to send password email to:', email, error);
      throw new Error(`Failed to send password email: ${error.message}`);
    }
  }
}

