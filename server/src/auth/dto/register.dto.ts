import { IsEmail, IsString, IsNotEmpty, IsEnum, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from '../validators/password.validator';

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN',
}

export class RegisterDto {
  @ApiProperty({ 
    description: 'User email address for account registration',
    example: 'john.doe@example.com',
    format: 'email'
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ 
    description: 'User password for account security',
    example: 'SecurePass123!',
    minLength: 8,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/?]).{8,}$'
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword()
  password: string;

  @ApiProperty({ 
    description: 'User phone number for verification and communication',
    example: '+2348123456789',
    pattern: '^[+]?[0-9]{10,15}$'
  })
  @IsString({ message: 'Phone number must be a string' })
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^[+]?[0-9]{10,15}$/, {
    message: 'Phone number must be a valid format (10-15 digits, optionally starting with +)'
  })
  phoneNumber: string;

  @ApiProperty({ 
    description: 'User role for account type',
    example: 'CUSTOMER',
    enum: UserRole
  })
  @IsEnum(UserRole, { message: 'Role must be CUSTOMER, VENDOR, or ADMIN' })
  @IsNotEmpty({ message: 'Role is required' })
  role: UserRole;

  @ApiProperty({ 
    description: 'Admin access code (required for admin registration)',
    example: 'ADMIN2024',
    required: false
  })
  @IsOptional()
  @IsString()
  adminAccessCode?: string;
}