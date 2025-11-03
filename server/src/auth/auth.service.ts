import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { UserEntity } from '../database/entities/user.entity';
import { TokenPayload, TokenResponse } from '../auth/types/auth-response.types';
import { authConfig } from '../config/auth.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /* 
  =======================================
  Generate Access Token
  ========================================
  */
  async generateAccessToken(user: UserEntity): Promise<string> {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      username: user.username,
    };

    return this.jwtService.sign(payload, {
      expiresIn: authConfig.jwt.expiresIn,
    });
  }

  /* 
  =======================================
  Generate Token Response
  ========================================
  */
  async generateTokens(user: UserEntity): Promise<TokenResponse> {
    const accessToken = await this.generateAccessToken(user);
    return { accessToken };
  }

  /* 
  =======================================
  Validate Token
  ========================================
  */
  async validateToken(token: string): Promise<TokenPayload> {
    try {
      const payload = this.jwtService.verify(token) as TokenPayload;
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  /* 
  =======================================
  Get User From Token
  ========================================
  */
  async getUserFromToken(payload: TokenPayload): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  /* 
  =======================================
  Validate User By ID
  ========================================
  */
  async validateUserById(
    userId: string,
  ): Promise<{ isValid: boolean; user?: UserEntity }> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user || !user.isActive) {
        return { isValid: false };
      }

      return { isValid: true, user };
    } catch (error) {
      return { isValid: false };
    }
  }

  /* 
  =======================================
  Clear User Session
  ========================================
  */
  async clearUserSession(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      lastLoginAt: null,
    });
  }

  /* 
  =======================================
  Update Last Login
  ========================================
  */
  async updateLastLogin(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      lastLoginAt: new Date(),
    });
  }

  /* 
  =======================================
  Cookie Management Methods
  ========================================
  */

  /**
   * Set authentication cookie in response
   */
  setAuthCookie(res: Response, accessToken: string): void {
    res.cookie(authConfig.cookie.name, accessToken, authConfig.cookie.options);
  }

  /**
   * Clear authentication cookie from response
   */
  clearAuthCookie(res: Response): void {
    res.clearCookie(authConfig.cookie.name, authConfig.cookie.options);
  }
}
