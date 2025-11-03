import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class SocialLinksDto {
  @ApiProperty({ description: 'Instagram profile URL', required: false })
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiProperty({ description: 'TikTok profile URL', required: false })
  @IsOptional()
  @IsString()
  tiktok?: string;

  @ApiProperty({ description: 'WhatsApp contact URL', required: false })
  @IsOptional()
  @IsString()
  whatsapp?: string;

  @ApiProperty({ description: 'Facebook profile URL', required: false })
  @IsOptional()
  @IsString()
  facebook?: string;

  @ApiProperty({ description: 'Twitter profile URL', required: false })
  @IsOptional()
  @IsString()
  twitter?: string;

  @ApiProperty({ description: 'LinkedIn profile URL', required: false })
  @IsOptional()
  @IsString()
  linkedin?: string;
}

export class SubmitBusinessVerificationDto {
  @ApiProperty({ description: 'Business name' })
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @ApiProperty({ description: 'Business ID number (CAC number in Nigeria)' })
  @IsString()
  @IsNotEmpty()
  businessIdNumber: string;

  @ApiProperty({ description: 'Business website URL' })
  @IsString()
  @IsNotEmpty()
  businessWebsite: string;

  @ApiProperty({ description: 'Business email address' })
  @IsString()
  @IsNotEmpty()
  businessEmail: string;

  @ApiProperty({ 
    description: 'Social media links',
    type: SocialLinksDto,
    required: false 
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks?: SocialLinksDto;
}

