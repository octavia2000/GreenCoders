import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Phone number to verify OTP for',
    example: '+2348012345678',
    pattern: '^[+]?[0-9]{10,15}$',
  })
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString({ message: 'Phone number must be a string' })
  @Matches(/^[+]?[0-9]{10,15}$/, {
    message: 'Phone number must be a valid format (10-15 digits, optionally starting with +)',
  })
  phoneNumber: string;

  @ApiProperty({
    description: '4-digit verification code sent to phone number',
    example: '1234',
    minLength: 4,
    maxLength: 4,
    pattern: '^[0-9]{4}$',
  })
  @IsNotEmpty({ message: 'OTP code is required' })
  @IsString({ message: 'OTP code must be a string' })
  @Length(4, 4, { message: 'OTP code must be exactly 4 digits' })
  @Matches(/^[0-9]{4}$/, {
    message: 'OTP code must be exactly 4 digits (0-9)',
  })
  otp: string;
}
