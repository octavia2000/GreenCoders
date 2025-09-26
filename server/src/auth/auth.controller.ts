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
import { LogUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordResetDto } from './dto/reset-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { GoogleAuthPayloadDto } from './dto/google-auth.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import * as SYS_MSG from '../helpers/SystemMessages';
import { authConfig } from '../config/auth.config';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /** API Endpoint for User Registration */
  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully and 4-digit OTP sent to phone' })
  @ApiResponse({ status: 400, description: 'Invalid input or user already exists' })
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  /** API Endpoint for User Login */
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 400, description: 'Phone number not verified' })
  async login(@Body() logUserDto: LogUserDto, @Res({ passthrough: true }) res: Response) {
    const response = await this.authService.login(logUserDto);

    // Generate token and set cookie (since service doesn't return token in response)
    const token = this.authService.generateToken(response.data.user);
    this.setAuthCookie(res, token);

    return response;
  }

  /** API Endpoint for Google Authentication */
  @Post('google')
  @HttpCode(200)
  @ApiOperation({ summary: 'Authenticate user with Google OAuth' })
  @ApiResponse({ status: 200, description: 'User authenticated successfully with Google' })
  @ApiResponse({ status: 401, description: 'Invalid Google token' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async googleAuth(@Body() body: GoogleAuthPayloadDto, @Res({ passthrough: true }) res: Response) {
    const response = await this.authService.googleAuth(body);

    // Generate token and set cookie (since service doesn't return token in response)
    const token = this.authService.generateToken(response.data.user);
    this.setAuthCookie(res, token);

    return response;
  }

  /** API Endpoint for User Logout */
  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Log out a user' })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  async logout(@Res({ passthrough: true }) res: Response) {
    this.clearAuthCookie(res);
    return this.authService.logout();
  }

  /** API Endpoint for OTP Verification */
  @Post('verify-otp')
  @HttpCode(200)
  @ApiOperation({ summary: 'Verify 4-digit OTP sent to phone number' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid OTP or expired OTP' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto.phoneNumber, verifyOtpDto.otp);
  }

  /** API Endpoint for Resending OTP */
  @Post('resend-otp')
  @HttpCode(200)
  @ApiOperation({ summary: 'Resend OTP to phone number'})
  @ApiResponse({ status: 200, description: 'OTP sent successfully to phone number'})
  @ApiResponse({ status: 400, description: 'Invalid phone number format or missing phone number'})
  @ApiResponse({ status: 404, description: 'User account not found for the provided phone number'})
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
  @ApiOperation({ summary: 'Validate access token from Authorization header' })
  @ApiResponse({ status: 200, description: 'Token validated successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  @ApiResponse({ status: 400, description: 'Authorization header missing' })
  async validateToken(@Req() request: Request) {
    const authHeader = request.headers['authorization'];
    return this.authService.validateTokenFromRequest(authHeader);
  }

  private setAuthCookie(res: Response, token: string) {
    res.cookie(authConfig.cookie.name, token, authConfig.cookie.options);
  }

  private clearAuthCookie(res: Response) {
    res.clearCookie(authConfig.cookie.name, authConfig.cookie.options);
  }
}