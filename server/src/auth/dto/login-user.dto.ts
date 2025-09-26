import { IsEmail, IsString, MinLength, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import * as SYS_MSG from '../../helpers/SystemMessages';

export class LogUserDto {
  @ApiProperty({ 
    description: 'User email address for authentication',
    example: 'john.doe@example.com',
    format: 'email'
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ 
    description: 'User password for authentication',
    example: 'password123',
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
}
