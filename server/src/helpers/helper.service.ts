import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class HelperService {
  /* 
  =======================================
  Random String Generation (Cryptographically Secure)
  ========================================
  */

  /* Generate cryptographically secure random string */
  generateRandomString(length: number): string {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }

  /* Generate cryptographically secure random number */
  generateRandomNumber(length: number): string {
    const digits = '0123456789';
    let result = '';
    const bytes = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
      result += digits[bytes[i] % 10];
    }
    return result;
  }

  /* 
  =======================================
  String Utilities
  ========================================
  */

  /* Sanitize string for safe database storage */
  sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  /* Generate URL-friendly slug from text */
  generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /* Capitalize first letter of each word */
  capitalizeWords(text: string): string {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  /* 
  =======================================
  Validation Utilities (Currently using DTOs for primary validation)
  ========================================
  */

  /* Basic email format validation */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /* Basic phone number format validation (E.164) */
  isValidPhoneNumber(phoneNumber: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
  }
}
