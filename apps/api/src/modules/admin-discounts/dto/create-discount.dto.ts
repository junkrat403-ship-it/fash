import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DiscountType } from '@fashion-store/shared-types';

export class CreateDiscountDto {
  @ApiProperty({ example: 'SUMMER20', required: false, description: 'Null = automatic discount' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({ enum: DiscountType, default: DiscountType.PERCENTAGE })
  @IsEnum(DiscountType)
  @IsNotEmpty()
  type!: DiscountType;

  @ApiProperty({ example: 20, description: 'Percentage e.g. 20 or fixed amount e.g. 50000' })
  @IsNumber()
  @Min(0)
  value!: number;

  @ApiProperty({ example: 100000, default: 0, required: false })
  @IsNumber()
  @IsOptional()
  @Min(0)
  minOrderValue?: number = 0;

  @ApiProperty({ example: 100, required: false })
  @IsNumber()
  @IsOptional()
  @Min(1)
  usageLimit?: number;

  @ApiProperty({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}
