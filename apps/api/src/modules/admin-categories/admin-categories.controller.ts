import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminCategoriesService } from './admin-categories.service';
import { CreateAdminCategoryDto } from './dto/create-admin-category.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions } from '../../common/decorators/roles.decorator';

@ApiTags('Admin — Categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/categories')
export class AdminCategoriesController {
  constructor(private readonly adminCategoriesService: AdminCategoriesService) {}

  @Get()
  @RequirePermissions('categories.read')
  @ApiOperation({ summary: 'List all categories for admin' })
  async findAll() {
    return this.adminCategoriesService.findAll();
  }

  @Post()
  @RequirePermissions('categories.write')
  @ApiOperation({ summary: 'Create a new category' })
  async create(@Body() dto: CreateAdminCategoryDto) {
    return this.adminCategoriesService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions('categories.write')
  @ApiOperation({ summary: 'Update a category' })
  async update(@Param('id') id: string, @Body() dto: Partial<CreateAdminCategoryDto>) {
    return this.adminCategoriesService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('categories.write')
  @ApiOperation({ summary: 'Delete a category' })
  async delete(@Param('id') id: string) {
    return this.adminCategoriesService.delete(id);
  }
}
