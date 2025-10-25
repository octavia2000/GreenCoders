import {
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'Username',
    example: 'john_doe123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username?: string;

  @ApiProperty({ description: 'First name', example: 'John', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName?: string;

  @ApiProperty({ description: 'Last name', example: 'Doe', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;

  @ApiProperty({ description: 'Profile image URL', required: false })
  @IsOptional()
  @IsUrl()
  profileImageUrl?: string;
}
