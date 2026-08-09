import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminProductsService } from './admin-products.service';
import { CreateAdminProductDto } from './dto/create-admin-product.dto';
import { UpdateAdminProductDto } from './dto/update-admin-product.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Admin — Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/products')
export class AdminProductsController {
  constructor(private readonly adminProductsService: AdminProductsService) {}

  @Get()
  @RequirePermissions('products.read')
  @ApiOperation({ summary: 'List all products for admin dashboard' })
  async findAll(
    @Query('status') status?: string,
    @Query('categoryId') categoryId?: string,
    @Query('q') q?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.adminProductsService.findAll({ status, categoryId, q, page: Number(page), limit: Number(limit) });
  }

  @Get(':id')
  @RequirePermissions('products.read')
  @ApiOperation({ summary: 'Get product details by ID' })
  async findOne(@Param('id') id: string) {
    return this.adminProductsService.findOne(id);
  }

  @Post()
  @RequirePermissions('products.write')
  @ApiOperation({ summary: 'Create new product with variants and images' })
  async create(@Body() dto: CreateAdminProductDto, @CurrentUser('userId') adminUserId: string) {
    return this.adminProductsService.create(dto, adminUserId);
  }

  @Patch(':id')
  @RequirePermissions('products.write')
  @ApiOperation({ summary: 'Update product details' })
  async update(@Param('id') id: string, @Body() dto: UpdateAdminProductDto) {
    return this.adminProductsService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('products.write')
  @ApiOperation({ summary: 'Delete product' })
  async delete(@Param('id') id: string) {
    return this.adminProductsService.delete(id);
  }
}
