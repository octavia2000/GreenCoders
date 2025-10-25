import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';
import { UserEntity } from '../database/entities/user.entity';
import { Role } from '../auth/types/auth-response.types';
import { authConfig } from '../config/auth.config';
import * as SYS_MSG from './SystemMessages';

@Injectable()
export class AuthHelperService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  /* 
  =======================================
  Token Extraction Methods
  ========================================
  */

  /* Extracts JWT token from Authorization header */
  extractTokenFromHeader(authHeader: string): string {
    if (!authHeader) throw new BadRequestException(SYS_MSG.AUTH_HEADER_MISSING);
    const token = authHeader.split(' ')[1];
    if (!token) throw new BadRequestException(SYS_MSG.ACCESS_TOKEN_MISSING);
    return token;
  }

  /* Extracts JWT token from HTTP-only cookie */
  extractTokenFromCookie(request: Request): string {
    const token = request.cookies?.[authConfig.cookie.name];
    if (!token) {
      throw new BadRequestException(SYS_MSG.AUTH_TOKEN_MISSING);
    }
    return token;
  }

  /* 
  =======================================
  JWT Token Generation
  ========================================
  */

  /* Generates JWT token for authenticated user */
  generateToken(user: UserEntity): string {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role as Role,
    });
  }

  /* 
  =======================================
  Username Generation Methods
  ========================================
  */

  /* Generates unique username from base string */
  async generateUniqueUsername(baseUsername: string): Promise<string> {
    let counter = 1;
    let finalUsername = baseUsername;

    while (
      await this.userRepository.findOne({ where: { username: finalUsername } })
    ) {
      finalUsername = `${baseUsername}${counter}`;
      counter++;
    }
    return finalUsername;
  }

  /* Generates unique username from email address */
  async generateUsernameFromEmail(email: string): Promise<string> {
    const emailPrefix = email.split('@')[0];
    const cleanPrefix = emailPrefix.toLowerCase().replace(/[^a-z0-9]/g, '');

    const baseUsername = cleanPrefix;
    let counter = 1;
    let finalUsername = baseUsername;

    while (
      await this.userRepository.findOne({ where: { username: finalUsername } })
    ) {
      finalUsername = `${baseUsername}${counter}`;
      counter++;
    }

    return finalUsername;
  }

  /* 
  =======================================
  Google Auth Helper Methods
  ========================================
  */

  /* Generates secure password for Google OAuth users */
  generateGooglePassword(email: string): string {
    const timestamp = Date.now().toString();
    const randomSalt = Math.random().toString(36).substring(2, 15);
    return `${email}:google:${timestamp}:${randomSalt}`;
  }
}
