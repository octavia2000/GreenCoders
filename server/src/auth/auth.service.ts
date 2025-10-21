import {
  Injectable,
  Logger,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './user/entities.ts/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PasswordResetDto } from './dto/reset-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { GoogleAuthPayloadDto } from './dto/google-auth.dto';
import { EmailService } from '../shared/notifications/email.service';
import { SmsService } from '../shared/notifications/sms.service';
import { PhoneNormalizerService } from '../helpers/phone-normalizer.service';
import { AuthHelperService } from '../helpers/auth-helper.service';
import * as SYS_MSG from '../helpers/SystemMessages';
import {
  BaseResponse,
  LoginResponse,
  RegisterResponse,
  OtpResponse,
  OtpVerificationResponse,
  PasswordResetResponse,
  WelcomeEmailResponse,
  TokenValidationResponse,
  Role,
  AuthUserResponse,
  RequestResetPasswordResponse,
} from './types/auth-response.types';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
    private readonly phoneNormalizer: PhoneNormalizerService,
    private readonly authHelper: AuthHelperService,
  ) {}


  /* 
  =======================================
  User Registration Method
  ========================================
  */
  async register(registerDto: RegisterDto): Promise<BaseResponse<RegisterResponse>> {
    const { email, password, phoneNumber, role } = registerDto;
    
    if (!email || !password || !phoneNumber || !role) {
      throw new BadRequestException(SYS_MSG.MISSING_FIELDS);
    }
    const normalizedPhone = this.phoneNormalizer.normalizePhoneNumber(phoneNumber);
    // Check for existing user
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException(SYS_MSG.USER_ACCOUNT_EXIST);
    }
    const existingPhone = await this.userRepository.findOne({
      where: { phoneNumber: normalizedPhone },
    });
    if (existingPhone) {
      throw new BadRequestException(SYS_MSG.PHONE_NUMBER_ALREADY_IN_USE);
    }
    // Generate username from email
    const username = await this.authHelper.generateUsernameFromEmail(email);

    // Create new user
    const newUser = this.userRepository.create({
      email,
      password,
      username,
      phoneNumber: normalizedPhone,
      role: role as Role,
    });
    const user = await this.userRepository.save(newUser);
    // Generate and send OTP
    try {
      await this.generateOtp(user.phoneNumber);
      this.logger.log(SYS_MSG.OTP_SENT_SUCCESSFULLY);
    } catch (error) {
      this.logger.error(SYS_MSG.OTP_SEND_FAILED, error);
    }

    return {
      statusCode: HttpStatus.CREATED,
      message: SYS_MSG.USER_CREATED_SUCCESSFULLY,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isNumberVerified: user.isNumberVerified,
          authMethod: user.authMethod || 'email',
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt?.toISOString(),
        },
      },
    };
  }

  /* 
  =======================================
  User Login Method
  ========================================
  */
  async login(loginDto: LoginDto): Promise<BaseResponse<LoginResponse>> {
    const { email, password } = loginDto;
    const fieldsInDto = Object.keys(loginDto);
    if (fieldsInDto.length !== 2 || !email || !password) {
      throw new BadRequestException(SYS_MSG.INVALID_FIELDS);
    }
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException(SYS_MSG.USER_ACCOUNT_DOES_NOT_EXIST);
    // Prevent Google users from logging in with email/password
    if (user.authMethod === 'google') {
      throw new BadRequestException(SYS_MSG.GOOGLE_AUTH_REQUIRED);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException(SYS_MSG.INVALID_PASSWORD);
    }
    if (!user.isNumberVerified && user.authMethod === 'email') {
      // Only require phone verification for email-based users
      // Google users don't need phone verification
      await this.generateOtp(user.phoneNumber);
      throw new BadRequestException({
        message: SYS_MSG.PHONE_NOT_VERIFIED,
        phoneNumber: user.phoneNumber
      });
    }
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
  Google Auth Method
  ========================================
  */
  async googleAuth(googleAuthPayload: GoogleAuthPayloadDto): Promise<BaseResponse<LoginResponse>> {
    const idToken = googleAuthPayload.id_token;
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
  private async validateOrCreateGoogleUser(
    email: string,
  ): Promise<UserEntity> {
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
        role: 'customer' as Role,
      });
      await this.userRepository.save(user);
    }

    return user;
  }

  /* 
  =======================================
  Token Validation Methods
  ========================================
  */
  
  /* Validates token from HTTP request cookies used by: /validate-token endpoint */
  async validateTokenFromRequest(request: Request): Promise<BaseResponse<AuthUserResponse>> {
    const token = this.authHelper.extractTokenFromCookie(request);
    const validationResult = await this.validateToken(token);
    
    if (!validationResult.isValid || !validationResult.user) {
      throw new BadRequestException(SYS_MSG.INVALID_CREDENTIALS);
    }
    
    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.TOKEN_VALIDATION_SUCCESSFUL,
      data: validationResult.user as AuthUserResponse,
    };
  }

  /* Core token validation logic (reusable) used by: validateTokenFromRequest(), JwtStrategy, and other services. 
   Verifies JWT signature, decodes payload, and validates user exists.
   */
  async validateToken(accessToken: string): Promise<TokenValidationResponse> {
    try {
      const decoded = await this.jwtService.verifyAsync(accessToken);
      if (!decoded || !decoded.sub) {
        this.logger.log(SYS_MSG.TOKEN_VALIDATION_FAILED);
        return { isValid: false, user: null };
      }

      const user = await this.userRepository.findOne({
        where: { id: decoded.sub },
      });

      if (!user) {
        this.logger.log(SYS_MSG.USER_NOT_FOUND_IN_DB);
        return { isValid: false, user: null };
      }

      return {
        isValid: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          isNumberVerified: user.isNumberVerified,
          role: user.role,
          isActive: user.isActive,
        },
      };
    } catch (error) {
      this.logger.error(SYS_MSG.TOKEN_VALIDATION_ERROR, error);
      return { isValid: false, user: null };
    }
  }

  /* 
  =======================================
  Validate User by ID (for JWT Strategy)
  ========================================
  */
  async validateUserById(userId: string): Promise<TokenValidationResponse> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        this.logger.log(SYS_MSG.USER_NOT_FOUND_IN_DB);
        return { isValid: false, user: null };
      }

      return {
        isValid: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          isNumberVerified: user.isNumberVerified,
          role: user.role,
          isActive: user.isActive,
        },
      };
    } catch (error) {
      this.logger.error('Error validating user by ID:', error);
      return { isValid: false, user: null };
    }
  }

  /* 
  =======================================
  Generate JWT Token Method
  ========================================
  */
  generateToken(user: AuthUserResponse): string {
    return this.authHelper.generateToken(user);
  }

  /* 
  =======================================
  User Logout Method
  ========================================
  */
  async logout(): Promise<BaseResponse<null>> {
    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.LOGOUT_SUCCESSFUL,
      data: null,
    };
  }

  /* 
  =======================================
  OTP Generation Method
  ========================================
  */
  async generateOtp(phoneNumber: string): Promise<BaseResponse<OtpResponse>> {
    // Normalize phone number before lookup
    const normalizedPhone = this.phoneNormalizer.normalizePhoneNumber(phoneNumber);
    
    const user = await this.userRepository.findOne({ 
      where: { phoneNumber: normalizedPhone } 
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
        message: `{SYS_MSG.OTP_SENT_TO_PHONE} : ${normalizedPhone}`,
      },
    };
  }
  
  /* 
  =======================================
  OTP Verification Method
  ========================================
  */
  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<BaseResponse<OtpVerificationResponse>> {
    const normalizedPhone = this.phoneNormalizer.normalizePhoneNumber(verifyOtpDto.phoneNumber);    
    const user = await this.userRepository.findOne({ 
      where: { phoneNumber: normalizedPhone }
    });
    if (!user) throw new NotFoundException(SYS_MSG.USER_ACCOUNT_DOES_NOT_EXIST);

    if (user.phoneOtp !== verifyOtpDto.otp || new Date() > user.otpExpiresAt) {
      throw new BadRequestException(SYS_MSG.OTP_INVALID_OR_EXPIRED);
    }
    user.isNumberVerified = true;
    user.phoneOtp = null;
    user.otpExpiresAt = null;
    await this.userRepository.save(user);
    
    // Send welcome email after successful phone verification
    try {
      console.log(SYS_MSG.WELCOME_EMAIL_SENDING, user.email);
      await this.emailService.sendOnboardingEmail(user.email, user.username);
      console.log(SYS_MSG.WELCOME_EMAIL_SENT);
    } catch (error) {
      console.log(SYS_MSG.WELCOME_EMAIL_FAILED, error.message);
    }
    
    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.OTP_VALIDATED_SUCCESSFULLY,
      data: {
        phoneNumber: normalizedPhone,
        verified: true
      },
    };
  }

  /* 
  =======================================
  Resend OTP Method
  ========================================
  */
  async resendOtp(phoneNumber: string): Promise<BaseResponse<OtpResponse>> {
    const response = await this.generateOtp(phoneNumber);
    return response;
  }

  /* 
  =======================================
  Send Welcome Email Method
  ========================================
  */
  async sendWelcomeEmail(user: UserEntity): Promise<BaseResponse<WelcomeEmailResponse>> {
    await this.emailService.sendOnboardingEmail(user.email, user.username);
    
    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.WELCOME_EMAIL_SENT_SUCCESSFULLY,
      data: {
        message: `${SYS_MSG.WELCOME_EMAIL_SENT} : ${user.email}`,
      },
    };
  }


  /* 
  =======================================
  Request Reset Password Method
  ========================================
  */
  async requestResetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<BaseResponse<RequestResetPasswordResponse>> {
    const user = await this.userRepository.findOne({ where: {email:forgetPasswordDto.email} });
    if (!user) throw new NotFoundException(SYS_MSG.USER_ACCOUNT_DOES_NOT_EXIST);
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
        message: `${SYS_MSG.PASSWORD_RESET_TOKEN_SENT} : ${user.email}`,
      },
    };
  }

  /* 
  =======================================
  Password Reset Method
  ========================================
  */
  async resetPassword(passwordResetDto: PasswordResetDto): Promise<BaseResponse<PasswordResetResponse>> {
    const user = await this.userRepository.findOne({ where: { email: passwordResetDto.email } });
    if (!user) throw new NotFoundException(SYS_MSG.USER_ACCOUNT_DOES_NOT_EXIST);

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
        email: user.email,
        message: SYS_MSG.PASSWORD_RESET_SUCCESSFUL,
      },
    };
  }

}