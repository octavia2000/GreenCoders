// Placeholder encryption service is intentionally commented out.
// Rationale: Not currently used. When implementing, restore imports and logic,
// and wire it into the modules that require encryption for sensitive fields.
// import { Injectable } from '@nestjs/common';
// import * as crypto from 'crypto';

// @Injectable()
// export class EncryptionService {
//   private readonly algorithm = 'aes-256-gcm';
//   private readonly keyLength = 32;
//   private readonly ivLength = 16;
//   private readonly tagLength = 16;

//   constructor() {
//     // In production, get encryption key from environment variables
//     this.validateEncryptionKey();
//   }

//   private validateEncryptionKey(): void {
//     const encryptionKey = process.env.ENCRYPTION_KEY;
//     if (!encryptionKey || encryptionKey.length !== 64) {
//       // For development, use a default key if ENCRYPTION_KEY is not set
//       if (process.env.NODE_ENV === 'development') {
//         console.warn('⚠️  Using default encryption key for development. Set ENCRYPTION_KEY for production.');
//         process.env.ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
//         return;
//       }
//       throw new Error(
//         'ENCRYPTION_KEY must be set and be 64 characters long (32 bytes hex)',
//       );
//     }
//   }

//   private getEncryptionKey(): Buffer {
//     const encryptionKey = process.env.ENCRYPTION_KEY;
//     return Buffer.from(encryptionKey!, 'hex');
//   }

//   /**
//    * Encrypts sensitive data using AES-256-GCM
//    * @param text - The text to encrypt
//    * @returns Encrypted data with IV and auth tag
//    */
//   encrypt(text: string): string {
//     if (!text) return text;

//     try {
//       const key = this.getEncryptionKey();
//       const iv = crypto.randomBytes(this.ivLength);
//       const cipher = crypto.createCipher(this.algorithm, key);
//       cipher.setAAD(Buffer.from('vendor-bank-details', 'utf8'));

//       let encrypted = cipher.update(text, 'utf8', 'hex');
//       encrypted += cipher.final('hex');

//       const authTag = cipher.getAuthTag();

//       // Combine IV + authTag + encrypted data
//       const combined = iv.toString('hex') + authTag.toString('hex') + encrypted;
//       return combined;
//     } catch (error) {
//       throw new Error(`Encryption failed: ${error.message}`);
//     }
//   }

//   /**
//    * Decrypts sensitive data using AES-256-GCM
//    * @param encryptedData - The encrypted data to decrypt
//    * @returns Decrypted text
//    */
//   decrypt(encryptedData: string): string {
//     if (!encryptedData) return encryptedData;

//     try {
//       const key = this.getEncryptionKey();

//       // Extract IV, auth tag, and encrypted data
//       const iv = Buffer.from(encryptedData.slice(0, this.ivLength * 2), 'hex');
//       const authTag = Buffer.from(
//         encryptedData.slice(
//           this.ivLength * 2,
//           (this.ivLength + this.tagLength) * 2,
//         ),
//         'hex',
//       );
//       const encrypted = encryptedData.slice(
//         (this.ivLength + this.tagLength) * 2,
//       );

//       const decipher = crypto.createDecipher(this.algorithm, key);
//       decipher.setAAD(Buffer.from('vendor-bank-details', 'utf8'));
//       decipher.setAuthTag(authTag);

//       let decrypted = decipher.update(encrypted, 'hex', 'utf8');
//       decrypted += decipher.final('utf8');

//       return decrypted;
//     } catch (error) {
//       throw new Error(`Decryption failed: ${error.message}`);
//     }
//   }

//   /**
//    * Encrypts an object's sensitive fields
//    * @param obj - Object to encrypt
//    * @param sensitiveFields - Array of field names to encrypt
//    * @returns Object with encrypted sensitive fields
//    */
//   encryptObject<T>(obj: T, sensitiveFields: (keyof T)[]): T {
//     const encryptedObj = { ...obj };

//     for (const field of sensitiveFields) {
//       if (encryptedObj[field] && typeof encryptedObj[field] === 'string') {
//         (encryptedObj as any)[field] = this.encrypt(
//           encryptedObj[field] as string,
//         );
//       }
//     }

//     return encryptedObj;
//   }

//   /**
//    * Decrypts an object's sensitive fields
//    * @param obj - Object to decrypt
//    * @param sensitiveFields - Array of field names to decrypt
//    * @returns Object with decrypted sensitive fields
//    */
//   decryptObject<T>(obj: T, sensitiveFields: (keyof T)[]): T {
//     const decryptedObj = { ...obj };

//     for (const field of sensitiveFields) {
//       if (decryptedObj[field] && typeof decryptedObj[field] === 'string') {
//         (decryptedObj as any)[field] = this.decrypt(
//           decryptedObj[field] as string,
//         );
//       }
//     }

//     return decryptedObj;
//   }
// // }