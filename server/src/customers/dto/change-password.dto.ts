import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Current password of the user' })
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  currentPassword: string;

  @ApiProperty({ description: 'New password' })
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  newPassword: string;

  @ApiProperty({ description: 'Confirm new password' })
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  confirmPassword: string;
}
