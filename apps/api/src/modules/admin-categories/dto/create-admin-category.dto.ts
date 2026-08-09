import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminCategoryDto {
  @ApiProperty({ example: 'Tops & Shirts' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'tops' })
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @ApiProperty({ description: 'Parent Category UUID', required: false })
  @IsString()
  @IsOptional()
  parentId?: string;

  @ApiProperty({ example: 'https://images.unsplash.com/...', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: 'Tailored shirts and casual tees', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1, default: 0 })
  @IsNumber()
  @IsOptional()
  displayOrder?: number = 0;

  @ApiProperty({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}
