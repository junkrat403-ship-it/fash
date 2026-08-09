import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminDiscountsService } from './admin-discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions } from '../../common/decorators/roles.decorator';

@ApiTags('Admin — Discounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/discounts')
export class AdminDiscountsController {
  constructor(private readonly adminDiscountsService: AdminDiscountsService) {}

  @Get()
  @RequirePermissions('discounts.read')
  @ApiOperation({ summary: 'List discount rules' })
  async findAll() {
    return this.adminDiscountsService.findAll();
  }

  @Post()
  @RequirePermissions('discounts.write')
  @ApiOperation({ summary: 'Create discount code / rule' })
  async create(@Body() dto: CreateDiscountDto) {
    return this.adminDiscountsService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions('discounts.write')
  @ApiOperation({ summary: 'Update discount rule' })
  async update(@Param('id') id: string, @Body() dto: Partial<CreateDiscountDto>) {
    return this.adminDiscountsService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('discounts.write')
  @ApiOperation({ summary: 'Delete discount rule' })
  async delete(@Param('id') id: string) {
    return this.adminDiscountsService.delete(id);
  }
}
