import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import * as SYS_MSG from '../../helpers/SystemMessages';

export class ResendOtpDto {
  @ApiProperty({
    description: 'Phone number to resend 4-digit OTP to',
    example: '+2348012345678',
    pattern: '^[+]?[0-9]{10,15}$',
  })
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString({ message: 'Phone number must be a string' })
  @Matches(/^[+]?[0-9]{10,15}$/, {
    message: 'Phone number must be a valid format (10-15 digits, optionally starting with +)',
  })
  phoneNumber: string;
}
