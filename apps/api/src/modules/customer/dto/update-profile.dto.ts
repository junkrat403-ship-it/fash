import { IsString, IsNotEmpty, IsOptional, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ description: 'Customer full name', example: 'Dinda Pratiwi' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  name!: string;

  @ApiPropertyOptional({ description: 'Customer WhatsApp phone number', example: '+6281234567890' })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9\s-]{9,25}$/, { message: 'Phone must be a valid phone number' })
  phone?: string;
}
