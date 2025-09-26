import { IsEmail, IsString, MinLength, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import * as SYS_MSG from '../../helpers/SystemMessages';

export class PasswordResetDto {
  @ApiProperty({ 
    description: 'User email address for password reset',
    example: 'user@example.com',
    format: 'email'
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ 
    description: 'Random password token received via email for verification',
    example: 'abc123def456',
    minLength: 8,
    pattern: '^[a-zA-Z0-9]{8,}$'
  })
  @IsString({ message: 'Random password token must be a string' })
  @IsNotEmpty({ message: 'Random password token is required' })
  @Matches(/^[a-zA-Z0-9]{8,}$/, {
    message: 'Random password token must be at least 8 alphanumeric characters'
  })
  randomPassword: string;

  @ApiProperty({ 
    description: 'New password to replace the current password',
    example: 'newpassword123',
    minLength: 6,
    pattern: '^.{6,}$'
  })
  @IsString({ message: 'New password must be a string' })
  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  @IsNotEmpty({ message: 'New password is required' })
  @Matches(/^.{6,}$/, {
    message: 'New password must be at least 6 characters long'
  })
  newPassword: string;
}
