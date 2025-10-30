import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  IsObject,
  IsEmail,
  IsPhoneNumber,
  IsEnum,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AdminType } from '../constants/admin-permissions';

export class CreateAdminDto {
  @ApiProperty({
    description: 'Admin email address',
    example: 'admin@company.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Admin password',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Admin username',
    example: 'admin_user',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({
    description: 'Admin phone number',
    example: '+1234567890',
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'Admin first name',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Admin last name',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'Admin department',
    example: 'IT Department',
  })
  @IsString()
  department: string;

  @ApiProperty({
    description: 'Admin access level',
    enum: AdminType,
    example: AdminType.SUPER_ADMIN,
  })
  @IsEnum(AdminType)
  accessLevel: AdminType;

  @ApiProperty({
    description: 'Employee ID',
    example: 'EMP001',
    required: false,
  })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiProperty({
    description: 'Job title',
    example: 'Senior Administrator',
    required: false,
  })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @ApiProperty({
    description: 'Reporting manager',
    example: 'manager@company.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  reportingManager?: string;

  @ApiProperty({
    description: 'Assigned modules',
    example: ['user_management', 'vendor_management'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assignedModules?: string[];

  @ApiProperty({
    description: 'Working hours',
    example: { start: '09:00', end: '17:00', timezone: 'UTC' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  workingHours?: any;

  @ApiProperty({
    description: 'Office location',
    example: 'New York Office',
    required: false,
  })
  @IsOptional()
  @IsString()
  officeLocation?: string;

  @ApiProperty({
    description: 'Office phone number',
    example: '+1-555-123-4567',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber()
  officePhoneNumber?: string;

  @ApiProperty({
    description: 'Emergency contact',
    example: '+1-555-987-6543',
    required: false,
  })
  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @ApiProperty({
    description: 'Emergency contact details',
    example: { name: 'Jane Doe', relationship: 'Spouse' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  emergencyContactDetails?: any;
}

export class UpdateAdminDto {
  @ApiProperty({
    description: 'Admin first name',
    example: 'John',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Admin last name',
    example: 'Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'Admin phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    description: 'Admin department',
    example: 'IT Department',
    required: false,
  })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({
    description: 'Admin access level',
    enum: AdminType,
    example: AdminType.SUPER_ADMIN,
    required: false,
  })
  @IsOptional()
  @IsEnum(AdminType)
  accessLevel?: AdminType;

  @ApiProperty({
    description: 'Employee ID',
    example: 'EMP001',
    required: false,
  })
  @IsOptional()
  @IsString()
  employeeId?: string;

  @ApiProperty({
    description: 'Job title',
    example: 'Senior Administrator',
    required: false,
  })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @ApiProperty({
    description: 'Reporting manager',
    example: 'manager@company.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  reportingManager?: string;

  @ApiProperty({
    description: 'Assigned modules',
    example: ['user_management', 'vendor_management'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  assignedModules?: string[];

  @ApiProperty({
    description: 'Working hours',
    example: { start: '09:00', end: '17:00', timezone: 'UTC' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  workingHours?: any;

  @ApiProperty({
    description: 'Office location',
    example: 'New York Office',
    required: false,
  })
  @IsOptional()
  @IsString()
  officeLocation?: string;

  @ApiProperty({
    description: 'Office phone number',
    example: '+1-555-123-4567',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber()
  officePhoneNumber?: string;

  @ApiProperty({
    description: 'Emergency contact',
    example: '+1-555-987-6543',
    required: false,
  })
  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @ApiProperty({
    description: 'Emergency contact details',
    example: { name: 'Jane Doe', relationship: 'Spouse' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  emergencyContactDetails?: any;

  @ApiProperty({
    description: 'Admin active status',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class QueryAdminsDto {
  @ApiProperty({
    description: 'Page number',
    example: 1,
    required: false,
  })
  @IsOptional()
  page?: number;

  @ApiProperty({
    description: 'Items per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  limit?: number;

  @ApiProperty({
    description: 'Search by username or email',
    example: 'admin',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter by department',
    example: 'IT Department',
    required: false,
  })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({
    description: 'Filter by access level',
    enum: AdminType,
    example: AdminType.SUPER_ADMIN,
    required: false,
  })
  @IsOptional()
  @IsEnum(AdminType)
  accessLevel?: AdminType;

  @ApiProperty({
    description: 'Filter by active status',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}



