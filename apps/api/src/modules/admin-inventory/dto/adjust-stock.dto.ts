import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdjustStockDto {
  @ApiProperty({ example: 10, description: 'Positive number for restock, negative for deduction' })
  @IsNumber()
  @IsNotEmpty()
  delta!: number;

  @ApiProperty({ example: 'Supplier shipment arrived', description: 'Mandatory reason for audit trail' })
  @IsString()
  @IsNotEmpty()
  reason!: string;

  @ApiProperty({ example: 'PO-2026-001', required: false })
  @IsString()
  @IsOptional()
  referenceOrderId?: string;
}
