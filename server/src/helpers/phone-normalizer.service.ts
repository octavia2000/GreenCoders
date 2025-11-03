import { Injectable } from '@nestjs/common';

@Injectable()
export class PhoneNormalizerService {
  normalizePhoneNumber(phoneNumber: string): string {
    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }
    // Remove all non-digit characters except +
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');
    // If it starts with +, keep it
    if (cleaned.startsWith('+')) {
      return cleaned;
    }
    // If it starts with country code like 234, 1, 44, and others
    if (cleaned.length >= 10) {
      // Common country codes mapping
      const countryCodes: { [key: string]: string } = {
        '234': '+234', // Nigeria
        '1': '+1', // US/Canada
        '44': '+44', // UK
        '33': '+33', // France
        '49': '+49', // Germany
        '86': '+86', // China
        '91': '+91', // India
        '81': '+81', // Japan
        '55': '+55', // Brazil
        '61': '+61', // Australia
      };

      // Check for 3-digit country codes first
      const threeDigitCode = cleaned.substring(0, 3);
      if (countryCodes[threeDigitCode]) {
        return countryCodes[threeDigitCode] + cleaned.substring(3);
      }

      // Check for 2-digit country codes
      const twoDigitCode = cleaned.substring(0, 2);
      if (countryCodes[twoDigitCode]) {
        return countryCodes[twoDigitCode] + cleaned.substring(2);
      }

      // Check for 1-digit country codes
      const oneDigitCode = cleaned.substring(0, 1);
      if (countryCodes[oneDigitCode]) {
        return countryCodes[oneDigitCode] + cleaned.substring(1);
      }
    }
    return '+234' + cleaned; // Default to Nigeria
  }
  isValidE164(phoneNumber: string): boolean {
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    return e164Regex.test(phoneNumber);
  }
}
