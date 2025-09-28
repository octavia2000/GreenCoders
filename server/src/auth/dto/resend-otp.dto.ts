import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import * as SYS_MSG from '../../helpers/SystemMessages';

export class ResendOtpDto {
  @ApiProperty({
    description: 'Phone number to resend 4-digit OTP to',
    example: '+2348012345678',
    pattern: '^\\+[1-9]\\d{0,2}[0-9]\\d{1,12}$',
  })
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString({ message: 'Phone number must be a string' })
  @Matches(/^\+[1-9]\d{0,2}[0-9]\d{1,12}$/, {
    message: 'Phone number must be a valid international format (e.g., +2348158667115)',
  })
  phoneNumber: string;
}
