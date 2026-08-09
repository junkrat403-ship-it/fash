import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCartItemDto {
  @ApiProperty({ description: 'Product Variant UUID' })
  @IsUUID()
  @IsNotEmpty()
  variantId!: string;

  @ApiProperty({ example: 1, default: 1 })
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiProperty({ description: 'Guest cart token if unauthenticated', required: false })
  @IsString()
  @IsOptional()
  guestToken?: string;
}
