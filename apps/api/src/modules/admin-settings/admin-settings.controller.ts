import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminSettingsService } from './admin-settings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions } from '../../common/decorators/roles.decorator';

@ApiTags('Admin — Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/settings')
export class AdminSettingsController {
  constructor(private readonly adminSettingsService: AdminSettingsService) {}

  @Get()
  @RequirePermissions('settings.read')
  @ApiOperation({ summary: 'Get all store config settings' })
  async findAll() {
    return this.adminSettingsService.findAll();
  }

  @Patch(':key')
  @RequirePermissions('settings.write')
  @ApiOperation({ summary: 'Update a store config setting by key' })
  async update(@Param('key') key: string, @Body('value') value: any) {
    return this.adminSettingsService.update(key, value);
  }
}
