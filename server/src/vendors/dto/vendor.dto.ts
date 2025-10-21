import { IsString, IsOptional, IsNumber, IsBoolean, IsObject, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateVendorDto {
  @IsString()
  companyName: string;

  @IsOptional()
  @IsString()
  businessRegistrationNumber?: string;

  @IsOptional()
  @IsString()
  taxId?: string;

  @IsOptional()
  @IsString()
  businessType?: string;

  @IsOptional()
  @IsNumber()
  yearsInBusiness?: number;

  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @IsOptional()
  @IsObject()
  socialMediaLinks?: any;

  @IsOptional()
  @IsString()
  businessDescription?: string;

  @IsOptional()
  @IsString()
  businessAddress?: string;

  @IsOptional()
  @IsString()
  businessCity?: string;

  @IsOptional()
  @IsString()
  businessState?: string;

  @IsOptional()
  @IsString()
  businessCountry?: string;

  @IsOptional()
  @IsString()
  businessPostalCode?: string;

  @IsOptional()
  @IsPhoneNumber()
  businessPhoneNumber?: string;

  @IsOptional()
  @IsObject()
  certifications?: any;

  @IsOptional()
  @IsObject()
  bankDetails?: any;
}

export class UpdateVendorDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  businessRegistrationNumber?: string;

  @IsOptional()
  @IsString()
  taxId?: string;

  @IsOptional()
  @IsString()
  businessType?: string;

  @IsOptional()
  @IsNumber()
  yearsInBusiness?: number;

  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @IsOptional()
  @IsObject()
  socialMediaLinks?: any;

  @IsOptional()
  @IsString()
  businessDescription?: string;

  @IsOptional()
  @IsString()
  businessAddress?: string;

  @IsOptional()
  @IsString()
  businessCity?: string;

  @IsOptional()
  @IsString()
  businessState?: string;

  @IsOptional()
  @IsString()
  businessCountry?: string;

  @IsOptional()
  @IsString()
  businessPostalCode?: string;

  @IsOptional()
  @IsPhoneNumber()
  businessPhoneNumber?: string;

  @IsOptional()
  @IsObject()
  certifications?: any;

  @IsOptional()
  @IsObject()
  bankDetails?: any;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}





