import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export class ApproveVendorVerificationDto {
  @ApiProperty({ 
    description: 'Verification status',
    enum: VerificationStatus,
    example: VerificationStatus.VERIFIED 
  })
  @IsEnum(VerificationStatus)
  status: VerificationStatus;

  @ApiProperty({ description: 'Admin notes (optional)', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

