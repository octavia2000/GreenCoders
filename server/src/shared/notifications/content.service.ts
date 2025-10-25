import { Injectable } from '@nestjs/common';
import * as SYS_MSG from '../../helpers/SystemMessages';

@Injectable()
export class ContentService {
  /* 
  =======================================
  Onboarding Email Content
  ========================================
  */
  onboardingMail(
    email: string,
    username: string,
  ): { subject: string; htmlContent: string } {
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
  otpMail(
    username: string,
    otp: string,
  ): { subject: string; htmlContent: string } {
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

  /* 
  =======================================
  Admin Invitation Email Content
  ========================================
  */
  adminInvitationMail(
    email: string,
    adminType: string,
    invitationToken: string,
    invitedByName: string,
    department?: string,
    message?: string,
  ): { subject: string; htmlContent: string } {
    const subject = `Admin Invitation - GreenCoders Platform`;
    const adminTypeDisplay = adminType.replace('_', ' ').toUpperCase();
    const setupUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/setup?token=${invitationToken}&email=${email}`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { 
              display: inline-block; 
              background-color: #007bff; 
              color: white; 
              padding: 12px 30px; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
              font-weight: bold;
            }
            .button:hover { background-color: #0056b3; }
            .admin-type { 
              background-color: #e9ecef; 
              padding: 10px; 
              border-radius: 5px; 
              margin: 15px 0;
              font-weight: bold;
              color: #495057;
            }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 14px; color: #6c757d; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Admin Invitation</h1>
              <p>You've been invited to join GreenCoders Admin Team</p>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>You have been invited by <strong>${invitedByName}</strong> to join the GreenCoders platform as an administrator.</p>
              
              <div class="admin-type">
                Admin Type: ${adminTypeDisplay}
                ${department ? `<br>Department: ${department}` : ''}
              </div>
              
              ${message ? `<p><strong>Personal Message:</strong><br>${message}</p>` : ''}
              
              <p>To complete your admin setup, please click the button below:</p>
              
              <a href="${setupUrl}" class="button">Complete Admin Setup</a>
              
              <p><strong>What happens next?</strong></p>
              <ul>
                <li>You'll be taken to a secure setup page</li>
                <li>Create your admin password</li>
                <li>Start managing the platform with your assigned permissions</li>
              </ul>
              
              <p><strong>Important:</strong></p>
              <ul>
                <li>This invitation expires in 7 days</li>
                <li>Keep your login credentials secure</li>
                <li>Contact the admin team if you have any questions</li>
              </ul>
              
              <div class="footer">
                <p>If you can't click the button above, copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #007bff;">${setupUrl}</p>
                <br>
                <p>Best regards,<br>GreenCoders Admin Team</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
    return { subject, htmlContent };
  }
}
