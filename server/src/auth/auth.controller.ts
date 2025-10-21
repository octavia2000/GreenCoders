import {
  Controller,
  Req,
  Res,
  Post,
  Get,
  Body,
  HttpCode,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthHelperService } from '../helpers/auth-helper.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PasswordResetDto } from './dto/reset-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { GoogleAuthPayloadDto } from './dto/google-auth.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authHelper: AuthHelperService,
  ) { }

    /* 
  =======================================
  API Endpoint for User Registration
  ========================================
  */
  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register a new user account (Customer, Vendor, or Admin)' })
  @ApiResponse({ status: 201, description: 'User registered successfully and 4-digit OTP sent to phone' })
  @ApiResponse({ status: 400, description: 'Invalid input, user already exists, or invalid access code' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

    /* 
  =======================================
  API Endpoint for User Login
  ========================================
  */
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 400, description: 'Phone number not verified' })
  async login(@Body() logUserDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const response = await this.authService.login(logUserDto);
    const token = this.authService.generateToken(response.data.user);
    this.authHelper.setAuthCookie(res, token);

    return response;
  }

    /* 
  =======================================
  API Endpoint for Google Authentication
  ========================================
  */
  @Post('google')
  @HttpCode(200)
  @ApiOperation({ summary: 'Authenticate user with Google OAuth' })
  @ApiResponse({ status: 200, description: 'User authenticated successfully with Google' })
  @ApiResponse({ status: 401, description: 'Invalid Google token' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async googleAuth(@Body() body: GoogleAuthPayloadDto, @Res({ passthrough: true }) res: Response) {
    const response = await this.authService.googleAuth(body);
    const token = this.authService.generateToken(response.data.user);
    this.authHelper.setAuthCookie(res, token);

    return response;
  }

    /* 
  =======================================
  API Endpoint for User Logout
  ========================================
  */
  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Log out a user' })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authHelper.clearAuthCookie(res);
    return this.authService.logout();
  }

    /* 
  =======================================
  API Endpoint for Verifying OTP
  ========================================
  */
  @Post('verify-otp')
  @HttpCode(200)
  @ApiOperation({ summary: 'Verify 4-digit OTP sent to phone number' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid OTP or expired OTP' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

   /* 
  =======================================
  API Endpoint for Resending OTP
  ========================================
  */
  @Post('resend-otp')
  @HttpCode(200)
  @ApiOperation({ summary: 'Resend OTP to phone number' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully to phone number' })
  @ApiResponse({ status: 400, description: 'Invalid phone number format or missing phone number' })
  @ApiResponse({ status: 404, description: 'User account not found for the provided phone number' })
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return this.authService.resendOtp(resendOtpDto.phoneNumber);
  }

  /** API Endpoint for Password Reset Request */
  @Post('forget-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Request password reset token' })
  @ApiResponse({ status: 200, description: 'Password reset token sent to email' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async forgotPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.authService.requestResetPassword(forgetPasswordDto);
  }

  /** API Endpoint for Password Reset */
  @Post('reset-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid reset token or expired' })
  async resetPassword(@Body() passwordResetDto: PasswordResetDto) {
    return this.authService.resetPassword(passwordResetDto);
  }

  /** API Endpoint to validate a token */
  @Get('validate-token')
  @HttpCode(200)
  @ApiOperation({ summary: 'Validate access token from cookie' })
  @ApiResponse({ status: 200, description: 'Token validated successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  @ApiResponse({ status: 400, description: 'Authentication token not found' })
  async validateToken(@Req() request: Request) {
    return this.authService.validateTokenFromRequest(request);
  }

}