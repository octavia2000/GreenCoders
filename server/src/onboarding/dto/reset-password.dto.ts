import {
  IsEmail,
  IsString,
  IsNotEmpty,
  Matches,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IsStrongPassword } from '../../auth/validators/password.validator';

export class PasswordResetDto {
  @ApiProperty({
    description: 'User email address for password reset',
    example: 'user@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'OTP code received via email for verification',
    example: '1234',
    minLength: 4,
    maxLength: 4,
    pattern: '^[0-9]{4}$',
  })
  @IsString({ message: 'OTP code must be a string' })
  @IsNotEmpty({ message: 'OTP code is required' })
  @Length(4, 4, { message: 'OTP code must be exactly 4 digits' })
  @Matches(/^[0-9]{4}$/, {
    message: 'OTP code must be exactly 4 digits',
  })
  otpCode: string;

  @ApiProperty({
    description: 'New password to replace the current password',
    example: 'NewSecurePass123!',
    minLength: 8,
    pattern:
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/?]).{8,}$',
  })
  @IsString({ message: 'New password must be a string' })
  @IsNotEmpty({ message: 'New password is required' })
  @IsStrongPassword()
  newPassword: string;
}
