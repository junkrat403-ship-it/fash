import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiPropertyOptional({ description: 'Label for address', example: 'Home' })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiProperty({ description: 'Recipient name', example: 'Dinda Pratiwi' })
  @IsString()
  @IsNotEmpty()
  recipientName!: string;

  @ApiProperty({ description: 'Recipient phone number', example: '+6281234567890' })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({ description: 'Address line 1', example: 'Jl. Senopati No. 45' })
  @IsString()
  @IsNotEmpty()
  line1!: string;

  @ApiPropertyOptional({ description: 'Address line 2', example: 'Apartemen Senopati Lt. 12' })
  @IsOptional()
  @IsString()
  line2?: string;

  @ApiProperty({ description: 'City', example: 'Jakarta Selatan' })
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiPropertyOptional({ description: 'Province', example: 'DKI Jakarta' })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiPropertyOptional({ description: 'Postal code', example: '12190' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({ description: 'Country', example: 'Indonesia', default: 'Indonesia' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'Set as default address', default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
