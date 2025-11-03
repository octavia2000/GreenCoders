import { Injectable } from '@nestjs/common';

@Injectable()
export class InputSanitizationService {
  /**
   * Sanitizes search query input to prevent injection attacks
   * @param input - The input string to sanitize
   * @returns Sanitized string
   */
  sanitizeSearchQuery(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    // Remove potentially dangerous characters
    let sanitized = input
      .replace(/[<>'"&]/g, '') // Remove HTML/XML characters
      .replace(/[;()]/g, '') // Remove SQL injection characters
      .replace(/[{}[\]]/g, '') // Remove JSON/object characters
      .replace(/[|&$`]/g, '') // Remove shell injection characters
      .replace(/[\\]/g, '') // Remove backslashes
      .trim();

    // Limit length to prevent DoS
    if (sanitized.length > 100) {
      sanitized = sanitized.substring(0, 100);
    }

    // Remove multiple spaces and normalize
    sanitized = sanitized.replace(/\s+/g, ' ');

    return sanitized;
  }

  /**
   * Sanitizes email input
   * @param email - Email to sanitize
   * @returns Sanitized email
   */
  sanitizeEmail(email: string): string {
    if (!email || typeof email !== 'string') {
      return '';
    }

    return email
      .toLowerCase()
      .trim()
      .replace(/[<>'"&;(){}[\]|&$`\\]/g, '')
      .substring(0, 254); // RFC 5321 limit
  }

  /**
   * Sanitizes phone number input
   * @param phone - Phone number to sanitize
   * @returns Sanitized phone number
   */
  sanitizePhoneNumber(phone: string): string {
    if (!phone || typeof phone !== 'string') {
      return '';
    }

    // Keep only digits, +, -, (, ), and spaces
    return phone
      .replace(/[^0-9+\-() ]/g, '')
      .trim()
      .substring(0, 20);
  }

  /**
   * Sanitizes general text input
   * @param text - Text to sanitize
   * @param maxLength - Maximum length (default: 1000)
   * @returns Sanitized text
   */
  sanitizeText(text: string, maxLength: number = 1000): string {
    if (!text || typeof text !== 'string') {
      return '';
    }

    return text
      .replace(/[<>'"&;(){}[\]|&$`\\]/g, '')
      .trim()
      .substring(0, maxLength)
      .replace(/\s+/g, ' ');
  }

  /**
   * Sanitizes URL input
   * @param url - URL to sanitize
   * @returns Sanitized URL
   */
  sanitizeUrl(url: string): string {
    if (!url || typeof url !== 'string') {
      return '';
    }

    // Basic URL validation and sanitization
    try {
      const urlObj = new URL(url);

      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return '';
      }

      return urlObj.toString();
    } catch {
      return '';
    }
  }

  /**
   * Sanitizes numeric input
   * @param input - Input to sanitize
   * @returns Sanitized number or null
   */
  sanitizeNumber(input: string | number): number | null {
    if (typeof input === 'number') {
      return isNaN(input) ? null : input;
    }

    if (!input || typeof input !== 'string') {
      return null;
    }

    const cleaned = input.replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(cleaned);

    return isNaN(parsed) ? null : parsed;
  }

  /**
   * Sanitizes boolean input
   * @param input - Input to sanitize
   * @returns Sanitized boolean
   */
  sanitizeBoolean(input: any): boolean {
    if (typeof input === 'boolean') {
      return input;
    }

    if (typeof input === 'string') {
      const lower = input.toLowerCase().trim();
      return ['true', '1', 'yes', 'on'].includes(lower);
    }

    if (typeof input === 'number') {
      return input !== 0;
    }

    return false;
  }

  /**
   * Sanitizes array input
   * @param input - Input to sanitize
   * @param maxItems - Maximum number of items (default: 50)
   * @returns Sanitized array
   */
  sanitizeArray(input: any[], maxItems: number = 50): string[] {
    if (!Array.isArray(input)) {
      return [];
    }

    return input
      .slice(0, maxItems)
      .filter((item) => typeof item === 'string')
      .map((item) => this.sanitizeText(item, 100));
  }
}
