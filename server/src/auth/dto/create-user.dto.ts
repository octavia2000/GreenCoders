import { IsEmail, IsString, MinLength, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import * as SYS_MSG from '../../helpers/SystemMessages';

export class CreateUserDto {
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
    minLength: 6,
    pattern: '^.{6,}$'
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  @Matches(/^.{6,}$/, {
    message: 'Password must be at least 6 characters long'
  })
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
}
