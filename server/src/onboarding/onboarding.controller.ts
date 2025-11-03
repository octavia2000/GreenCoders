import {
  Controller,
  Req,
  Res,
  Post,
  Get,
  Body,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest, Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OnboardingService } from './onboarding.service';
import {
  AuthMiddleware,
  AuthenticatedRequest,
} from '../auth/middleware/auth.middleware';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  RateLimitGuard,
  RateLimit,
  RATE_LIMITS,
} from '../shared/guards/rate-limit.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { PasswordResetDto } from './dto/reset-password.dto';
import { GoogleAuthPayloadDto } from './dto/google-auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  /* 
  =======================================
  API Endpoint for User Registration
  ========================================
  */
  @Post('register')
  @HttpCode(201)
  @UseGuards(RateLimitGuard)
  @RateLimit(RATE_LIMITS.REGISTRATION_ATTEMPTS)
  @ApiOperation({
    summary: 'Register a new user account (Customer, Vendor, or Admin)',
  })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid input, user already exists, or validation error',
  })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiResponse({ status: 429, description: 'Too many registration attempts' })
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.onboardingService.register(registerDto);
  }

  /* 
  =======================================
  API Endpoint for User Login
  ========================================
  */
  @Post('login')
  @HttpCode(200)
  @UseGuards(RateLimitGuard)
  @RateLimit(RATE_LIMITS.LOGIN_ATTEMPTS)
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 429, description: 'Too many login attempts' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.onboardingService.login(loginDto, res);
  }

  /* 
  =======================================
  API Endpoint for User Logout
  ========================================
  */
  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Log out a user' })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(
    @Request() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.onboardingService.logout(req.user.id, res);
  }

  /* 
  =======================================
  API Endpoint for Token Refresh
  ========================================
  */
  @Post('refresh')
  @HttpCode(200)
  @UseGuards(RateLimitGuard)
  @RateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 20, // Allow more refresh requests than login attempts
    message: 'Too many token refresh attempts. Please try again later.',
  })
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @ApiResponse({ status: 429, description: 'Too many refresh attempts' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.onboardingService.refreshToken(refreshTokenDto);
  }

  /* 
  =======================================
  API Endpoint for Verifying OTP
  ========================================
  */
  @Post('verify-otp')
  @HttpCode(200)
  @UseGuards(RateLimitGuard)
  @RateLimit(RATE_LIMITS.STRICT)
  @ApiOperation({ summary: 'Verify 4-digit OTP sent to phone number' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid OTP or expired OTP' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 429, description: 'Too many OTP verification attempts' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.onboardingService.verifyOtp(verifyOtpDto);
  }

  /* 
  =======================================
  API Endpoint for Resending OTP
  ========================================
  */
  @Post('resend-otp')
  @HttpCode(200)
  @UseGuards(RateLimitGuard)
  @RateLimit(RATE_LIMITS.STRICT)
  @ApiOperation({ summary: 'Resend OTP to phone number' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully to phone number' })
  @ApiResponse({ status: 400, description: 'Invalid phone number format or missing phone number' })
  @ApiResponse({ status: 404, description: 'User account not found for the provided phone number' })
  @ApiResponse({ status: 429, description: 'Too many OTP resend attempts' })
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return this.onboardingService.resendOtp(resendOtpDto);
  }

  /* 
  =======================================
  API Endpoint for Password Reset Request
  ========================================
  */
  @Post('forget-password')
  @HttpCode(200)
  @UseGuards(RateLimitGuard)
  @RateLimit(RATE_LIMITS.STRICT)
  @ApiOperation({ summary: 'Request password reset token' })
  @ApiResponse({ status: 200, description: 'Password reset token sent to email' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 429, description: 'Too many password reset requests' })
  async forgotPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.onboardingService.requestResetPassword(forgetPasswordDto);
  }

  /* 
  =======================================
  API Endpoint for Password Reset
  ========================================
  */
  @Post('reset-password')
  @HttpCode(200)
  @UseGuards(RateLimitGuard)
  @RateLimit(RATE_LIMITS.STRICT)
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid reset token or expired' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 429, description: 'Too many password reset attempts' })
  async resetPassword(@Body() passwordResetDto: PasswordResetDto) {
    return this.onboardingService.resetPassword(passwordResetDto);
  }

  /* 
  =======================================
  API Endpoint for Google Authentication
  ========================================
  */
  @Post('google')
  @HttpCode(200)
  @UseGuards(RateLimitGuard)
  @RateLimit(RATE_LIMITS.STRICT)
  @ApiOperation({ summary: 'Authenticate user with Google OAuth' })
  @ApiResponse({ status: 200, description: 'User authenticated successfully with Google' })
  @ApiResponse({ status: 401, description: 'Invalid Google token' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 429, description: 'Too many Google auth attempts' })
  async googleAuth(@Body() googleAuthDto: GoogleAuthPayloadDto, @Res({ passthrough: true }) res: Response) {
    return this.onboardingService.googleAuth(googleAuthDto, res);
  }
}
