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
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

import { UserEntity } from '../users/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LogUserDto } from './dto/login-user.dto';
import { PasswordResetDto } from './dto/reset-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { GoogleAuthPayloadDto } from './dto/google-auth.dto';
import { EmailService } from '../shared/notifications/email.service';
import { SmsService } from '../shared/notifications/sms.service';
import { PhoneNormalizerService } from '../shared/phone-normalizer.service';
import * as SYS_MSG from '../helpers/SystemMessages';
import {
  BaseResponse,
  UserResponse,
  LoginResponse,
  RegisterResponse,
  OtpResponse,
  OtpVerificationResponse,
  PasswordResetResponse,
  TokenValidationResponse,
} from '../shared/types/user-response.types';

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
  ) {}

  /* 
  =======================================
  Auth Header/Token Method
  ========================================
  */
  extractTokenFromHeader(authHeader: string): string {
    if (!authHeader) throw new BadRequestException(SYS_MSG.AUTH_HEADER_MISSING);
    const token = authHeader.split(' ')[1];
    if (!token) throw new BadRequestException(SYS_MSG.ACCESS_TOKEN_MISSING);
    return token;
  }

  /* 
  =======================================
  User Registration Method
  ========================================
  */
  async register(createUserDto: CreateUserDto): Promise<BaseResponse<RegisterResponse>> {
    const { email, password, phoneNumber } = createUserDto;
    if (!email || !password || !phoneNumber) {
      throw new BadRequestException(SYS_MSG.MISSING_FIELDS);
    }
    const normalizedPhone = this.phoneNormalizer.normalizePhoneNumber(phoneNumber);
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
    // Generate unique username from email prefix
    const baseUsername = email.split('@')[0];
    const finalUsername = await this.generateUniqueUsername(baseUsername);

    // Create new user with normalized phone and generated username
    const newUser = this.userRepository.create({
      email,
      password,
      username: finalUsername,
      phoneNumber: normalizedPhone,
    });
    const user = await this.userRepository.save(newUser);
    const otpResult = await this.generateOtp(user.phoneNumber);
    console.log(SYS_MSG.OTP_SENT_SUCCESSFULLY);

    return {
      statusCode: HttpStatus.CREATED,
      message: SYS_MSG.USER_CREATED_SUCCESSFULLY,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isNumberVerified: user.isNumberVerified,
        },
        message: SYS_MSG.OTP_SENT_SUCCESSFULLY,
      },
    };
  }

  /* 
  =======================================
  User Login Method
  ========================================
  */
  async login(logUserDto: LogUserDto): Promise<BaseResponse<LoginResponse>> {
    const { email, password } = logUserDto;
    const fieldsInDto = Object.keys(logUserDto);
    if (fieldsInDto.length !== 2 || !email || !password) {
      throw new BadRequestException(SYS_MSG.INVALID_FIELDS);
    }
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException(SYS_MSG.USER_ACCOUNT_DOES_NOT_EXIST);
    }
    
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
        },
      },
    };
  }

  /* 
  =======================================
  Validate Token Method
  ========================================
  */
  async validateTokenFromRequest(authHeader: string): Promise<BaseResponse<UserResponse>> {
    if (!authHeader) {
      throw new BadRequestException(SYS_MSG.AUTH_HEADER_MISSING);
    }
    
    const token = this.extractTokenFromHeader(authHeader);
    const validationResult = await this.validateToken(token);
    
    if (!validationResult.isValid || !validationResult.user) {
      throw new BadRequestException(SYS_MSG.INVALID_CREDENTIALS);
    }
    
    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.TOKEN_VALIDATION_SUCCESSFUL,
      data: validationResult.user,
    };
  }

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
        },
      };
    } catch (error) {
      this.logger.error(SYS_MSG.TOKEN_VALIDATION_ERROR, error);
      return { isValid: false, user: null };
    }
  }

  /* 
  =======================================
  Generate JWT Token Method
  ========================================
  */
  generateToken(user: UserResponse): string {
    return this.jwtService.sign({ sub: user.id, email: user.email });
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
  async verifyOtp(phoneNumber: string, otp: string): Promise<BaseResponse<OtpVerificationResponse>> {
    const normalizedPhone = this.phoneNormalizer.normalizePhoneNumber(phoneNumber);
    const user = await this.userRepository.findOne({ 
      where: { phoneNumber: normalizedPhone }
    });
    if (!user) throw new NotFoundException(SYS_MSG.USER_ACCOUNT_DOES_NOT_EXIST);

    if (user.phoneOtp !== otp || new Date() > user.otpExpiresAt) {
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
  async sendWelcomeEmail(user: UserEntity): Promise<BaseResponse<{ message: string }>> {
    await this.emailService.sendOnboardingEmail(user.email, user.username);
    
    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.WELCOME_EMAIL_SENT_SUCCESSFULLY,
      data: {
        message: SYS_MSG.WELCOME_EMAIL_SENT_SUCCESSFULLY,
      },
    };
  }

  /* 
  =======================================
  Password Recovery Method
  ========================================
  */
  async requestResetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<BaseResponse<PasswordResetResponse>> {
    const user = await this.userRepository.findOne({ where: {email:forgetPasswordDto.email} });
    if (!user) throw new NotFoundException(SYS_MSG.USER_ACCOUNT_DOES_NOT_EXIST);

    const randomPassword = randomBytes(8).toString('hex')
    user.resetPassword = randomPassword
    user.resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.userRepository.save(user);

    await this.emailService.sendRandomPassword(user.email, randomPassword);

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.FORGOT_PASSWORD_SUCCESS,
      data: {
        email: user.email,
        message: SYS_MSG.PASSWORD_RESET_TOKEN_SENT,
      },
    };
  }

  /* 
  =======================================
  Password Reset Method
  ========================================
  */
  async resetPassword(passwordResetDto: PasswordResetDto): Promise<BaseResponse<{ message: string }>> {
    const user = await this.userRepository.findOne({ where: { email: passwordResetDto.email } });
    if (!user) throw new NotFoundException('User not found');

    if (user.resetPassword !== passwordResetDto.randomPassword 
        || !user.resetPasswordExpiresAt || new Date() > user.resetPasswordExpiresAt) {
    throw new BadRequestException(SYS_MSG.INVALID_CREDENTIALS);
    }

    user.password = passwordResetDto.newPassword;

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(passwordResetDto.newPassword, salt);

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
      const finalUsername = await this.generateUniqueUsername(baseUsername);

      // Generate a secure password for Google users
      const googlePassword = this.generateGooglePassword(email);

      // Create user first
      user = this.userRepository.create({
        email,
        username: finalUsername,
        password: googlePassword, 
        phoneNumber: '', // Optional for Google users
        isNumberVerified: false, // Google users don't verify phone
        authMethod: 'google',
      });
      await this.userRepository.save(user);
    }

    return user;
  }

  /**
   * Generate a secure password for Google users
   * Uses email + random salt + timestamp for uniqueness
   */
  private generateGooglePassword(email: string): string {
    const timestamp = Date.now().toString();
    const randomSalt = Math.random().toString(36).substring(2, 15);
    return `${email}:google:${timestamp}:${randomSalt}`;
  }

  /* 
  =======================================
  Generate Unique Username
  ========================================
  */
  private async generateUniqueUsername(baseUsername: string): Promise<string> {
    let counter = 1;
    let finalUsername = baseUsername;
    
    while (await this.userRepository.findOne({ where: { username: finalUsername } })) {
      finalUsername = `${baseUsername}${counter}`;
      counter++;
    }
    return finalUsername;
  }

}