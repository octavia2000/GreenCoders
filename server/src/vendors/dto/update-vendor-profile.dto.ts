import { IsOptional, IsString, IsUrl, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for updating vendor profile (personal info only)
 * Business details will have separate DTOs
 */
export class UpdateVendorProfileDto {
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


