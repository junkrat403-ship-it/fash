import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from '@fashion-store/shared-types';

export class CreateVariantDto {
  @ApiProperty({ example: 'TS-OLS-M-BLK' })
  @IsString()
  @IsNotEmpty()
  sku!: string;

  @ApiProperty({ example: 'M', required: false })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiProperty({ example: 'Black', required: false })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ example: '#000000', required: false })
  @IsString()
  @IsOptional()
  colorHex?: string;

  @ApiProperty({ example: 249000, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  priceOverride?: number;

  @ApiProperty({ example: 10, default: 0 })
  @IsNumber()
  @Min(0)
  stockQuantity!: number;

  @ApiProperty({ example: 5, default: 5 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  lowStockThreshold?: number = 5;
}

export class CreateImageDto {
  @ApiProperty({ example: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c' })
  @IsString()
  @IsNotEmpty()
  url!: string;

  @ApiProperty({ example: 'Front View', required: false })
  @IsString()
  @IsOptional()
  altText?: string;

  @ApiProperty({ example: true, default: false })
  @IsOptional()
  isPrimary?: boolean = false;
}

export class CreateAdminProductDto {
  @ApiProperty({ example: 'Oversized Linen Shirt' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'oversized-linen-shirt' })
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @ApiProperty({ description: 'Category UUID', required: false })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({ example: 229000 })
  @IsNumber()
  @Min(0)
  basePrice!: number;

  @ApiProperty({ enum: ProductStatus, default: ProductStatus.DRAFT })
  @IsEnum(ProductStatus)
  status!: ProductStatus;

  @ApiProperty({ example: 'TS-OLS', required: false })
  @IsString()
  @IsOptional()
  skuPrefix?: string;

  @ApiProperty({ example: 'Crafted from 100% organic linen.', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: [CreateImageDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateImageDto)
  @IsOptional()
  images?: CreateImageDto[];

  @ApiProperty({ type: [CreateVariantDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  @IsOptional()
  variants?: CreateVariantDto[];
}
