import { Injectable } from "@nestjs/common";

@Injectable()
export class ContentService{
    onboardingMail(email: string, username: string):{subject: string, htmlContent: string}{
        const subject = `Onboarding mail to GreenCoders`;
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
                <h1 class="header">Welcome to GreenCoders ${username}!!! </h1>
                <p>Thank you for registering with us.</p>
                <p>Your account has been successfully created with the email: <strong>${email}</strong>.</p>
                <p>You are one step closer to shopping for your eco friendly items, 
                kindly verify your phone number and log in to get started</p>
                <p>Start exploring and let us know if you have any questions.</p>
                <br>
                <p>Cheers,<br>GreenCoders Team</p>
            </div>
            </body>
        </html>
        `;
        return {subject, htmlContent}
    }

    passwordMail(email: string, randomPassword: string): {subject:string, htmlContent: string}{
        const subject = 'Reset your Password';
        const htmlContent = `
        <!DOCTYPE html>
        <html>
            <body>
            <p>Hello,</p>
            <p>As requested, here is your new temporary password:</p>
            <h2 style="color: green;">${randomPassword}</h2>
            <p><strong>Reset and change your password with the code above, this code expires in 1 hour</strong></p>
            <br>
            <p>If you did not request this, please contact support immediately.</p>
            </body>
        </html>
        `;
        return {subject, htmlContent}
    }
}