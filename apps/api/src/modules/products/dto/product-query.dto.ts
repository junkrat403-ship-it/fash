import { IsOptional, IsString, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum ProductSortOption {
  NEWEST = 'newest',
  BESTSELLING = 'bestselling',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
}

export class ProductQueryDto {
  @ApiPropertyOptional({ description: 'Category slug or ID' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Minimum price' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Price range identifier e.g. under-200k' })
  @IsOptional()
  @IsString()
  priceRange?: string;

  @ApiPropertyOptional({ description: 'Filter by variant size e.g. S, M, L, XL' })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiPropertyOptional({ description: 'Filter by variant color e.g. Black, White, Blue' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ enum: ProductSortOption, default: ProductSortOption.NEWEST })
  @IsOptional()
  @IsEnum(ProductSortOption)
  sort?: ProductSortOption = ProductSortOption.NEWEST;

  @ApiPropertyOptional({ description: 'Keyword search query for name, description, SKU' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 12;
}
