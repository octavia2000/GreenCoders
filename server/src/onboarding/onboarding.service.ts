import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UserEntity } from '../database/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import {
  BaseResponse,
  LoginResponse,
  RegisterResponse,
  Role,
} from '../auth/types/auth-response.types';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { PasswordResetDto } from './dto/reset-password.dto';
import { GoogleAuthPayloadDto } from './dto/google-auth.dto';
import { EmailService } from '../shared/notifications/email.service';
import { SmsService } from '../shared/notifications/sms.service';
import { PhoneNormalizerService } from '../helpers/phone-normalizer.service';
import { AuthHelperService } from '../helpers/auth-helper.service';
import * as SYS_MSG from '../helpers/SystemMessages';

@Injectable()
export class OnboardingService {
  private readonly logger = new Logger(OnboardingService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
    private readonly phoneNormalizer: PhoneNormalizerService,
    private readonly authHelper: AuthHelperService,
  ) {}

  /* 
  =======================================
  Register a new user
  ========================================
  */
  async register(
    registerDto: RegisterDto,
  ): Promise<BaseResponse<RegisterResponse>> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: registerDto.email },
        { username: registerDto.username },
        { phoneNumber: registerDto.phoneNumber },
      ],
    });

    if (existingUser) {
      if (existingUser.email === registerDto.email) {
        throw new ConflictException(SYS_MSG.USER_ACCOUNT_EXIST);
      }
      if (existingUser.username === registerDto.username) {
        throw new ConflictException(SYS_MSG.USERNAME_ALREADY_TAKEN);
      }
      if (existingUser.phoneNumber === registerDto.phoneNumber) {
        throw new ConflictException(SYS_MSG.PHONE_NUMBER_ALREADY_IN_USE);
      }
    }

    // Create new user
    const user = this.userRepository.create({
      email: registerDto.email,
      password: registerDto.password, // Will be hashed by @BeforeInsert
      username: registerDto.username,
      phoneNumber: registerDto.phoneNumber,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      role: registerDto.role,
    });

    const savedUser = await this.userRepository.save(user);

    // Generate and send OTP after successful registration
    try {
      await this.generateOtp(savedUser.phoneNumber);
      this.logger.log(SYS_MSG.OTP_SENT_SUCCESSFULLY);
    } catch (error) {
      this.logger.error(SYS_MSG.OTP_SEND_FAILED, error);
    }

    // Send welcome email after successful registration
    try {
      this.logger.log(`${SYS_MSG.WELCOME_EMAIL_SENDING}: ${savedUser.email}`);
      await this.emailService.sendOnboardingEmail(
        savedUser.email,
        savedUser.username,
      );
      this.logger.log(SYS_MSG.WELCOME_EMAIL_SENT);
    } catch (error) {
      this.logger.error(`${SYS_MSG.WELCOME_EMAIL_FAILED}: ${error.message}`);
    }

    return {
      statusCode: HttpStatus.CREATED,
      message: SYS_MSG.USER_CREATED_SUCCESSFULLY,
      data: {
        user: {
          id: savedUser.id,
          username: savedUser.username,
          email: savedUser.email,
          isNumberVerified: savedUser.isNumberVerified,
          authMethod: savedUser.authMethod || 'email',
          role: savedUser.role,
          isActive: savedUser.isActive,
          createdAt: savedUser.createdAt?.toISOString(),
        },
      },
    };
  }

  /* 
  =======================================
  Login user
  ========================================
  */
  async login(
    loginDto: LoginDto,
    res: Response,
  ): Promise<BaseResponse<LoginResponse>> {
    // Find user with password field
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: loginDto.email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException(SYS_MSG.INVALID_CREDENTIALS);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(SYS_MSG.INVALID_CREDENTIALS);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException(SYS_MSG.ACCOUNT_DEACTIVATED);
    }

    // Generate tokens
    const tokens = await this.authService.generateTokens(user);

    // Set cookies using AuthService
    this.authService.setAuthCookie(res, tokens.accessToken);

    // Update last login
    await this.authService.updateLastLogin(user.id);

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.LOGIN_SUCCESSFUL,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isNumberVerified: user.isNumberVerified,
          authMethod: user.authMethod,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt?.toISOString(),
        },
      },
    };
  }

  /* 
  =======================================
  Logout user
  ========================================
  */
  async logout(userId: string, res: Response): Promise<BaseResponse<null>> {
    await this.authService.clearUserSession(userId);
    // Clear cookies using AuthService
    this.authService.clearAuthCookie(res);
    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.LOGOUT_SUCCESSFUL,
      data: null,
    };
  }

  /* 
  =======================================
  Refresh access token
  ========================================
  */
  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<BaseResponse<{ accessToken: string }>> {
    const payload = await this.authService.validateToken(
      refreshTokenDto.refreshToken,
    );
    const user = await this.authService.getUserFromToken(payload);

    const accessToken = await this.authService.generateAccessToken(user);

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.LOGIN_SUCCESSFUL,
      data: { accessToken },
    };
  }

  /* 
  =======================================
  Generate OTP
  ========================================
  */
  async generateOtp(
    phoneNumber: string,
  ): Promise<BaseResponse<{ phoneNumber: string; message: string }>> {
    // Normalize phone number before lookup
    const normalizedPhone =
      this.phoneNormalizer.normalizePhoneNumber(phoneNumber);

    const user = await this.userRepository.findOne({
      where: { phoneNumber: normalizedPhone },
    });

    if (!user) {
      throw new NotFoundException(SYS_MSG.USER_ACCOUNT_DOES_NOT_EXIST);
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5min
    user.phoneOtp = otp;
    user.otpExpiresAt = expiresAt;
    await this.userRepository.save(user);

    this.smsService.sendOtp(normalizedPhone, otp);

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.OTP_SENT_SUCCESSFULLY,
      data: {
        phoneNumber: normalizedPhone,
        message: `${SYS_MSG.OTP_SENT_TO_PHONE} : ${normalizedPhone}`,
      },
    };
  }

  /* 
  =======================================
  Verify OTP
  ========================================
  */
  async verifyOtp(
    verifyOtpDto: VerifyOtpDto,
  ): Promise<BaseResponse<{ phoneNumber: string; verified: boolean }>> {
    const normalizedPhone = this.phoneNormalizer.normalizePhoneNumber(
      verifyOtpDto.phoneNumber,
    );
    const user = await this.userRepository.findOne({
      where: { phoneNumber: normalizedPhone },
    });

    if (!user) {
      throw new NotFoundException(SYS_MSG.USER_ACCOUNT_DOES_NOT_EXIST);
    }

    if (user.phoneOtp !== verifyOtpDto.otp || new Date() > user.otpExpiresAt) {
      throw new BadRequestException(SYS_MSG.OTP_INVALID_OR_EXPIRED);
    }

    user.isNumberVerified = true;
    user.phoneOtp = null;
    user.otpExpiresAt = null;
    await this.userRepository.save(user);

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.OTP_VALIDATED_SUCCESSFULLY,
      data: {
        phoneNumber: normalizedPhone,
        verified: true,
      },
    };
  }

  /* 
  =======================================
  Resend OTP
  ========================================
  */
  async resendOtp(
    resendOtpDto: ResendOtpDto,
  ): Promise<BaseResponse<{ phoneNumber: string; message: string }>> {
    const response = await this.generateOtp(resendOtpDto.phoneNumber);
    return response;
  }

  /* 
  =======================================
  Request Password Reset
  ========================================
  */
  async requestResetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<BaseResponse<{ message: string }>> {
    const user = await this.userRepository.findOne({ where: { email: forgetPasswordDto.email } });
    if (!user) {
      throw new NotFoundException(SYS_MSG.USER_ACCOUNT_DOES_NOT_EXIST);
    }
    
    // Generate 4-digit OTP for password reset
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    user.resetPassword = otpCode;
    user.resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await this.userRepository.save(user);

    // Send OTP via email instead of random password
    await this.emailService.sendPasswordResetOtp(user.email, otpCode);

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.PASSWORD_RESET_TOKEN_SENT_SUCCESSFULLY,
      data: {
        message: SYS_MSG.PASSWORD_RESET_TOKEN_SENT_SUCCESSFULLY,
      },
    };
  }

  /* 
  =======================================
  Reset Password
  ========================================
  */
  async resetPassword(passwordResetDto: PasswordResetDto): Promise<BaseResponse<{ message: string }>> {
    const user = await this.userRepository.findOne({ where: { email: passwordResetDto.email } });
    if (!user) {
      throw new NotFoundException(SYS_MSG.USER_ACCOUNT_DOES_NOT_EXIST);
    }

    if (user.resetPassword !== passwordResetDto.otpCode 
        || !user.resetPasswordExpiresAt || new Date() > user.resetPasswordExpiresAt) {
      throw new BadRequestException(SYS_MSG.OTP_INVALID_OR_EXPIRED);
    }

    // Set new password will be hashed by @BeforeUpdate hook in UserEntity
    user.password = passwordResetDto.newPassword;
    user.resetPassword = null;
    user.resetPasswordExpiresAt = null;

    await this.userRepository.save(user);

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.PASSWORD_RESET_SUCCESSFUL,
      data: {
        message: SYS_MSG.PASSWORD_RESET_SUCCESSFUL,
      },
    };
  }

  /* 
  =======================================
  Google Authentication
  ========================================
  */
  async googleAuth(googleAuthDto: GoogleAuthPayloadDto, res: Response): Promise<BaseResponse<LoginResponse>> {
    const idToken = googleAuthDto.id_token;
    if (!idToken) {
      throw new BadRequestException(SYS_MSG.INVALID_CREDENTIALS);
    }

    try {
      const request = await fetch(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`,
      );
      const verifyTokenResponse = await request.json();

      // Check if the response contains an error
      if (verifyTokenResponse.error || verifyTokenResponse.error_description) {
        throw new BadRequestException(SYS_MSG.INVALID_CREDENTIALS);
      }

      const { email: userEmail } = verifyTokenResponse;

      // Validate that we have the required email
      if (!userEmail) {
        throw new BadRequestException(SYS_MSG.INVALID_CREDENTIALS);
      }

      const user = await this.validateOrCreateGoogleUser(userEmail);
      
      // Generate tokens
      const tokens = await this.authService.generateTokens(user);

      // Set cookies using AuthService
      this.authService.setAuthCookie(res, tokens.accessToken);

      // Update last login
      await this.authService.updateLastLogin(user.id);

      return {
        statusCode: HttpStatus.OK,
        message: SYS_MSG.LOGIN_SUCCESSFUL,
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            isNumberVerified: user.isNumberVerified,
            authMethod: user.authMethod,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt?.toISOString(),
          },
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(SYS_MSG.GOOGLE_AUTH_ERROR, error);
      throw new BadRequestException(SYS_MSG.INTERNAL_SERVER_ERROR);
    }
  }

  /* 
  =======================================
  Validate or Create User for Google OAuth
  ========================================
  */
  private async validateOrCreateGoogleUser(email: string): Promise<UserEntity> {
    if (!email) {
      throw new BadRequestException(SYS_MSG.INVALID_CREDENTIALS);
    }
    
    let user = await this.userRepository.findOne({
      where: { email },
    });
    
    if (!user) {
      const baseUsername = email.split('@')[0];
      const finalUsername = await this.authHelper.generateUniqueUsername(baseUsername);

      // Generate a secure password for Google users
      const googlePassword = this.authHelper.generateGooglePassword(email);

      // Create user first
      user = this.userRepository.create({
        email,
        username: finalUsername,
        password: googlePassword, 
        phoneNumber: '', // Optional for Google users
        isNumberVerified: false, // Google users don't verify phone
        authMethod: 'google',
        role: Role.CUSTOMER,
      });
      await this.userRepository.save(user);
    }

    return user;
  }
}
