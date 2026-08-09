import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BannerPlacement } from '@fashion-store/shared-types';

export class CreateBannerDto {
  @ApiProperty({ enum: BannerPlacement, default: BannerPlacement.HERO })
  @IsEnum(BannerPlacement)
  placement!: BannerPlacement;

  @ApiProperty({ example: 'Summer 2026 Capsule Collection', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Effortless silhouettes crafted in sustainable linens', required: false })
  @IsString()
  @IsOptional()
  subtitle?: string;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d' })
  @IsString()
  @IsNotEmpty()
  imageUrl!: string;

  @ApiProperty({ example: '/products?category=tops', required: false })
  @IsString()
  @IsOptional()
  linkUrl?: string;

  @ApiProperty({ example: 1, default: 0 })
  @IsNumber()
  @IsOptional()
  displayOrder?: number = 0;

  @ApiProperty({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}
