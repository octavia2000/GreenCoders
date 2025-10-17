import { IsOptional, IsInt, Min, Max, IsEnum, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../types/user-response.types';

export class QueryUsersDto {
  @ApiProperty({ description: 'Page number', example: 1, required: false, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: 'Items per page', example: 10, required: false, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({ description: 'Filter by role', enum: ['CUSTOMER', 'VENDOR', 'ADMIN'], required: false })
  @IsOptional()
  @IsEnum(['CUSTOMER', 'VENDOR', 'ADMIN'])
  role?: Role;

  @ApiProperty({ description: 'Filter by active status', example: true, required: false })
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;

  @ApiProperty({ description: 'Search by username or email', required: false })
  @IsOptional()
  @IsString()
  search?: string;
}

