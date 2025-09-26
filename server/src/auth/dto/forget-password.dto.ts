import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import * as SYS_MSG from '../../helpers/SystemMessages';

export class ForgetPasswordDto {
  @ApiProperty({ 
    description: 'User email address to send password reset token',
    example: 'user@example.com',
    format: 'email'
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}