import { IsString, IsOptional, IsArray, IsBoolean, IsObject, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  department: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];

  @IsString()
  accessLevel: string;

  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  reportingManager?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assignedModules?: string[];

  @IsOptional()
  @IsObject()
  workingHours?: any;

  @IsOptional()
  @IsString()
  officeLocation?: string;

  @IsOptional()
  @IsPhoneNumber()
  officePhoneNumber?: string;

  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @IsOptional()
  @IsObject()
  emergencyContactDetails?: any;
}

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];

  @IsOptional()
  @IsString()
  accessLevel?: string;

  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsOptional()
  @IsString()
  jobTitle?: string;

  @IsOptional()
  @IsString()
  reportingManager?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assignedModules?: string[];

  @IsOptional()
  @IsObject()
  workingHours?: any;

  @IsOptional()
  @IsString()
  officeLocation?: string;

  @IsOptional()
  @IsPhoneNumber()
  officePhoneNumber?: string;

  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @IsOptional()
  @IsObject()
  emergencyContactDetails?: any;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}





