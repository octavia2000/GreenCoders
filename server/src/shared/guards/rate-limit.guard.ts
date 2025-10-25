import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import * as SYS_MSG from '../../helpers/SystemMessages';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string;
}

// In-memory store for rate limiting (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const rateLimitConfig = this.reflector.get<RateLimitConfig>(
      'rateLimit',
      context.getHandler(),
    );

    if (!rateLimitConfig) {
      return true; // No rate limit configured
    }

    const clientId = this.getClientIdentifier(request);
    const now = Date.now();
    const windowStart = now - rateLimitConfig.windowMs;

    // Clean up expired entries
    this.cleanupExpiredEntries(windowStart);

    // Get or create rate limit entry for this client
    const rateLimitEntry = rateLimitStore.get(clientId);

    if (!rateLimitEntry || rateLimitEntry.resetTime <= now) {
      // Create new window
      rateLimitStore.set(clientId, {
        count: 1,
        resetTime: now + rateLimitConfig.windowMs,
      });
      return true;
    }

    // Check if limit exceeded
    if (rateLimitEntry.count >= rateLimitConfig.maxRequests) {
      // const resetTime = new Date(rateLimitEntry.resetTime);
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: rateLimitConfig.message || SYS_MSG.TOO_MANY_AUTH_ATTEMPTS,
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil((rateLimitEntry.resetTime - now) / 1000),
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Increment counter
    rateLimitEntry.count++;
    return true;
  }

  private getClientIdentifier(request: Request): string {
    // Use IP address as primary identifier
    const ip = request.ip || request.connection.remoteAddress || 'unknown';

    // For authenticated users, combine IP with user ID for more granular control
    const userId = (request as any).user?.id;
    if (userId) {
      return `${ip}:${userId}`;
    }

    return ip;
  }

  private cleanupExpiredEntries(windowStart: number): void {
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetTime <= windowStart) {
        rateLimitStore.delete(key);
      }
    }
  }
}

// Decorator for applying rate limits
import { SetMetadata } from '@nestjs/common';

export const RateLimit = (config: RateLimitConfig) =>
  SetMetadata('rateLimit', config);

// Predefined rate limit configurations
export const RATE_LIMITS = {
  // Strict limits for sensitive operations
  STRICT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many requests. Please try again later.',
  },

  // Moderate limits for regular operations
  MODERATE: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Rate limit exceeded. Please slow down your requests.',
  },

  // Lenient limits for read operations
  LENIENT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000,
    message: 'Rate limit exceeded. Please try again later.',
  },

  // Custom limits for specific operations
  VENDOR_VERIFICATION: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
    message: 'Too many verification attempts. Please try again later.',
  },

  VENDOR_PROFILE_UPDATE: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 20,
    message: 'Too many profile updates. Please wait before trying again.',
  },

  // Authentication specific rate limits
  LOGIN_ATTEMPTS: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many login attempts. Please try again later.',
  },

  REGISTRATION_ATTEMPTS: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
    message: 'Too many registration attempts. Please try again later.',
  },

  PASSWORD_RESET_ATTEMPTS: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 3,
    message: 'Too many password reset attempts. Please try again later.',
  },

  OTP_ATTEMPTS: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 5,
    message: 'Too many OTP verification attempts. Please try again later.',
  },
} as const;
