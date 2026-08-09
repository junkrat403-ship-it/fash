import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminUserDto {
  @ApiProperty({ example: 'Siti Rahma' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'siti@fashionstore.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'StaffPass123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @ApiProperty({ description: 'Role UUID e.g. Manager, Staff, Support' })
  @IsString()
  @IsNotEmpty()
  roleId!: string;
}
