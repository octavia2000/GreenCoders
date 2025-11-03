import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, IsUUID, MinLength, Matches } from 'class-validator';
import { AdminType } from '../constants/admin-permissions';

export class InviteAdminDto {
  @ApiProperty({ 
    description: 'Email address of the admin to invite',
    example: 'admin@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'Type of admin to invite',
    enum: AdminType,
    example: AdminType.VENDOR_ADMIN
  })
  @IsEnum(AdminType)
  adminType: AdminType;

  @ApiProperty({ 
    description: 'Department for the admin (optional)',
    example: 'Customer Support',
    required: false
  })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ 
    description: 'Personal message to include in invitation (optional)',
    example: 'Welcome to our admin team!',
    required: false
  })
  @IsOptional()
  @IsString()
  message?: string;
}

export class SetupAdminPasswordDto {
  @ApiProperty({ 
    description: 'Invitation token from the email',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  invitationToken: string;

  @ApiProperty({ 
    description: 'Email address from the invitation',
    example: 'admin@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'New password (minimum 8 characters, must contain uppercase, lowercase, number and special character)',
    example: 'SecurePass123!',
    minLength: 8
  })
  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    }
  )
  password: string;

  @ApiProperty({ 
    description: 'Confirm password (must match password)',
    example: 'SecurePass123!'
  })
  @IsString()
  confirmPassword: string;
}

export class ValidateInvitationDto {
  @ApiProperty({ 
    description: 'Invitation token from the email',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  invitationToken: string;

  @ApiProperty({ 
    description: 'Email address from the invitation',
    example: 'admin@example.com'
  })
  @IsEmail()
  email: string;
}