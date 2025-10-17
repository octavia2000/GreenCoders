import { IsOptional, IsString, IsEmail, IsUrl, IsInt, Min, Max, IsEnum, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVendorBusinessDto {
  @ApiProperty({ description: 'Business name', example: 'GreenShop Ltd', required: false })
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiProperty({ description: 'Business category', example: 'Eco Products', required: false })
  @IsOptional()
  @IsString()
  businessCategory?: string;

  @ApiProperty({ description: 'Business address', required: false })
  @IsOptional()
  @IsString()
  businessAddress?: string;

  @ApiProperty({ description: 'Business email', example: 'info@greenshop.com', required: false })
  @IsOptional()
  @IsEmail()
  businessEmail?: string;

  @ApiProperty({ description: 'Business phone number', example: '+2348012345678', required: false })
  @IsOptional()
  @IsString()
  businessPhoneNumber?: string;

  @ApiProperty({ description: 'Business registration number', example: 'RC123456', required: false })
  @IsOptional()
  @IsString()
  businessRegistrationNumber?: string;

  @ApiProperty({ 
    description: 'Business type', 
    enum: ['sole_proprietor', 'partnership', 'llc', 'corporation'],
    required: false 
  })
  @IsOptional()
  @IsEnum(['sole_proprietor', 'partnership', 'llc', 'corporation'])
  businessType?: string;

  @ApiProperty({ description: 'Business description', required: false })
  @IsOptional()
  @IsString()
  businessDescription?: string;

  @ApiProperty({ description: 'Website URL', example: 'https://greenshop.com', required: false })
  @IsOptional()
  @IsUrl()
  websiteUrl?: string;

  @ApiProperty({ description: 'City', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ description: 'State', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ description: 'Country', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ description: 'Postal code', required: false })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({ description: 'Years in business', example: 5, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  yearsInBusiness?: number;

  @ApiProperty({ description: 'Social media links', required: false })
  @IsOptional()
  @IsObject()
  socialMediaLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };

  @ApiProperty({ description: 'Business hours', required: false })
  @IsOptional()
  @IsObject()
  businessHours?: any;
}


