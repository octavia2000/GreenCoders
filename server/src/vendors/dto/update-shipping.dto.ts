import { IsOptional, IsString, IsBoolean, IsInt, IsArray, IsObject, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateShippingDto {
  @ApiProperty({ description: 'Shipping methods', required: false })
  @IsOptional()
  @IsArray()
  shippingMethods?: any[];

  @ApiProperty({ description: 'Shipping zones', required: false })
  @IsOptional()
  @IsArray()
  shippingZones?: any[];

  @ApiProperty({ description: 'Offers local pickup', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  offersLocalPickup?: boolean;

  @ApiProperty({ description: 'Pickup address', required: false })
  @IsOptional()
  @IsString()
  pickupAddress?: string;

  @ApiProperty({ description: 'Free shipping threshold', required: false })
  @IsOptional()
  @IsObject()
  freeShippingThreshold?: {
    enabled: boolean;
    minimumAmount: number;
  };

  @ApiProperty({ description: 'Processing time', example: '1-2 business days', required: false })
  @IsOptional()
  @IsString()
  processingTime?: string;

  @ApiProperty({ description: 'Shipping policy text', required: false })
  @IsOptional()
  @IsString()
  shippingPolicy?: string;

  @ApiProperty({ description: 'Return policy text', required: false })
  @IsOptional()
  @IsString()
  returnPolicy?: string;

  @ApiProperty({ description: 'Return window in days', example: 14, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(365)
  returnWindowDays?: number;

  @ApiProperty({ description: 'Accepts returns', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  acceptsReturns?: boolean;

  @ApiProperty({ description: 'Return conditions', required: false })
  @IsOptional()
  @IsArray()
  returnConditions?: string[];
}


