import { IsString, IsOptional, IsEnum, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBankDetailsDto {
  @ApiProperty({ description: 'Bank name', example: 'First Bank of Nigeria' })
  @IsString()
  @MinLength(2)
  bankName: string;

  @ApiProperty({ description: 'Account number', example: '1234567890' })
  @IsString()
  @MinLength(10)
  @MaxLength(20)
  accountNumber: string;

  @ApiProperty({ description: 'Account name', example: 'GreenShop Ltd' })
  @IsString()
  @MinLength(2)
  accountName: string;

  @ApiProperty({ 
    description: 'Account type', 
    enum: ['savings', 'current', 'business'],
    required: false 
  })
  @IsOptional()
  @IsEnum(['savings', 'current', 'business'])
  accountType?: string;

  @ApiProperty({ description: 'Routing/sort code', example: '058', required: false })
  @IsOptional()
  @IsString()
  routingNumber?: string;

  @ApiProperty({ description: 'SWIFT code', required: false })
  @IsOptional()
  @IsString()
  swiftCode?: string;

  @ApiProperty({ description: 'IBAN', required: false })
  @IsOptional()
  @IsString()
  iban?: string;
}


