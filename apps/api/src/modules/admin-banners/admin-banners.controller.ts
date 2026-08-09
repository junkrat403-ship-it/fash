import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminBannersService } from './admin-banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions } from '../../common/decorators/roles.decorator';

@ApiTags('Admin — Banners')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/banners')
export class AdminBannersController {
  constructor(private readonly adminBannersService: AdminBannersService) {}

  @Get()
  @RequirePermissions('banners.read')
  @ApiOperation({ summary: 'List all banners for admin' })
  async findAll() {
    return this.adminBannersService.findAll();
  }

  @Post()
  @RequirePermissions('banners.write')
  @ApiOperation({ summary: 'Create marketing banner' })
  async create(@Body() dto: CreateBannerDto) {
    return this.adminBannersService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions('banners.write')
  @ApiOperation({ summary: 'Update marketing banner' })
  async update(@Param('id') id: string, @Body() dto: Partial<CreateBannerDto>) {
    return this.adminBannersService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('banners.write')
  @ApiOperation({ summary: 'Delete banner' })
  async delete(@Param('id') id: string) {
    return this.adminBannersService.delete(id);
  }
}
