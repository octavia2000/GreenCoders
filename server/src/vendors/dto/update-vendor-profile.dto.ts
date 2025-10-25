import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateVendorProfileDto {
  @ApiProperty({ description: 'First name', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'Last name', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'Address', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'State', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ description: 'Region', required: false })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiProperty({ description: 'Profile image URL', required: false })
  @IsOptional()
  @IsString()
  profileImageUrl?: string;
}