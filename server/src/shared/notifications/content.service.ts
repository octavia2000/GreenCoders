import { Injectable } from "@nestjs/common";
import * as SYS_MSG from '../../helpers/SystemMessages';

@Injectable()
export class ContentService {
  /* 
  =======================================
  Onboarding Email Content
  ========================================
  */
  onboardingMail(email: string, username: string): { subject: string; htmlContent: string } {
    const subject = SYS_MSG.WELCOME_EMAIL_SUBJECT;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { color: #333; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="header">Welcome to GreenCoders, ${username}!</h1>
            <p>Thank you for registering with us.</p>
            <p>Your account has been successfully created with the email: <strong>${email}</strong>.</p>
            <p>You are one step closer to shopping for your eco-friendly items. 
            Kindly verify your phone number and log in to get started.</p>
            <p>Start exploring and let us know if you have any questions.</p>
            <br>
            <p>Cheers,<br>GreenCoders Team</p>
          </div>
        </body>
      </html>
    `;
    return { subject, htmlContent };
  }

  /* 
  =======================================
  OTP Email Content
  ========================================
  */
  otpMail(username: string, otp: string): { subject: string; htmlContent: string } {
    const subject = SYS_MSG.OTP_EMAIL_SUBJECT;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .otp-box { background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { color: #28a745; font-size: 32px; font-weight: bold; letter-spacing: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Email Verification</h2>
            <p>Hello ${username || 'there'},</p>
            <p>Your verification code is:</p>
            <div class="otp-box">
              <span class="otp-code">${otp}</span>
            </div>
            <p><strong>Important:</strong></p>
            <ul>
              <li>This code expires in 5 minutes</li>
              <li>Do not share this code with anyone</li>
            </ul>
            <p>If you didn't request this code, please ignore this email.</p>
            <br>
            <p>Best regards,<br>GreenCoders Team</p>
          </div>
        </body>
      </html>
    `;
    return { subject, htmlContent };
  }

  /* 
  =======================================
  Password Reset OTP Email Content
  ========================================
  */
  passwordResetMail(otpCode: string): { subject: string; htmlContent: string } {
    const subject = SYS_MSG.PASSWORD_RESET_EMAIL_SUBJECT;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .otp-box { background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { color: #007bff; font-size: 32px; font-weight: bold; letter-spacing: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>Hello,</p>
            <p>You have requested to reset your password. Use the verification code below to complete the process:</p>
            <div class="otp-box">
              <span class="otp-code">${otpCode}</span>
            </div>
            <p><strong>Important:</strong></p>
            <ul>
              <li>This code expires in 15 minutes</li>
              <li>Do not share this code with anyone</li>
              <li>If you didn't request this reset, please ignore this email</li>
            </ul>
            <p>If you have any questions, please contact our support team.</p>
            <br>
            <p>Best regards,<br>GreenCoders Team</p>
          </div>
        </body>
      </html>
    `;
    return { subject, htmlContent };
  }
}