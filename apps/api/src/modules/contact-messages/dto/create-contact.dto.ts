import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ example: 'Dinda Pratiwi' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'dinda@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '+6281234567890', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'Size Guide Query', required: false })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiProperty({ example: 'Hi, do you have size XL in black?' })
  @IsString()
  @IsNotEmpty()
  message!: string;
}
