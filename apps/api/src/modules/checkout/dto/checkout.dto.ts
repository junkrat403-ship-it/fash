import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, Matches, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

const transformOptionalString = ({ value }: { value: any }) => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
  }
  return value;
};

const transformTrimmedString = ({ value }: { value: any }) => {
  return typeof value === 'string' ? value.trim() : value;
};

export class CustomerInfoDto {
  @ApiProperty({ example: 'Dinda Pratiwi' })
  @Transform(transformTrimmedString)
  @IsString()
  @IsNotEmpty({ message: 'Full name is required.' })
  @MinLength(2, { message: 'Full name must be at least 2 characters long.' })
  name!: string;

  @ApiProperty({ example: '+6281234567890' })
  @Transform(transformTrimmedString)
  @IsString()
  @IsNotEmpty({ message: 'WhatsApp phone number is required.' })
  @Matches(/^(\+?[0-9\s\-]{8,18})$/, { message: 'Please enter a valid phone number (at least 8 digits).' })
  phone!: string;

  @ApiProperty({ example: 'dinda@example.com', required: false })
  @Transform(transformOptionalString)
  @IsOptional()
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email?: string;
}

export class ShippingAddressDto {
  @ApiProperty({ example: 'Jl. Merdeka No. 10' })
  @Transform(transformTrimmedString)
  @IsString()
  @IsNotEmpty({ message: 'Street address is required.' })
  @MinLength(5, { message: 'Street address must be at least 5 characters long.' })
  line1!: string;

  @ApiProperty({ example: 'Apt 4B', required: false })
  @Transform(transformOptionalString)
  @IsString()
  @IsOptional()
  line2?: string;

  @ApiProperty({ example: 'Medan' })
  @Transform(transformTrimmedString)
  @IsString()
  @IsNotEmpty({ message: 'City / District is required.' })
  @MinLength(2, { message: 'City / District must be at least 2 characters long.' })
  city!: string;

  @ApiProperty({ example: 'North Sumatra', required: false })
  @Transform(transformOptionalString)
  @IsString()
  @IsOptional()
  province?: string;

  @ApiProperty({ example: '20111', required: false })
  @Transform(transformOptionalString)
  @IsString()
  @IsOptional()
  @MaxLength(10, { message: 'Postal code must be 10 characters or less.' })
  postalCode?: string;

  @ApiProperty({ example: 'Indonesia', default: 'Indonesia', required: false })
  @Transform(transformOptionalString)
  @IsString()
  @IsOptional()
  country?: string = 'Indonesia';
}

export class CheckoutDto {
  @ApiProperty({ type: CustomerInfoDto })
  @ValidateNested()
  @Type(() => CustomerInfoDto)
  @IsNotEmpty({ message: 'Customer information is required.' })
  customer!: CustomerInfoDto;

  @ApiProperty({ type: ShippingAddressDto })
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  @IsNotEmpty({ message: 'Shipping address is required.' })
  shippingAddress!: ShippingAddressDto;

  @ApiProperty({ example: 'Please call before delivery', required: false })
  @Transform(transformOptionalString)
  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Order notes cannot exceed 500 characters.' })
  notes?: string;

  @ApiProperty({ description: 'Cart UUID if available', required: false })
  @Transform(transformOptionalString)
  @IsString()
  @IsOptional()
  cartId?: string;

  @ApiProperty({ description: 'Guest cart token if unauthenticated', required: false })
  @Transform(transformOptionalString)
  @IsString()
  @IsOptional()
  guestToken?: string;
}
