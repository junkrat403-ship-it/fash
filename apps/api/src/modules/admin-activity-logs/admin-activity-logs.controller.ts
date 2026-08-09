import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminActivityLogsService } from './admin-activity-logs.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions } from '../../common/decorators/roles.decorator';

@ApiTags('Admin — Activity Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/activity-logs')
export class AdminActivityLogsController {
  constructor(private readonly adminActivityLogsService: AdminActivityLogsService) {}

  @Get()
  @RequirePermissions('activity_logs.read')
  @ApiOperation({ summary: 'Filterable audit logs for admin actions' })
  async findAll(
    @Query('action') action?: string,
    @Query('entityType') entityType?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.adminActivityLogsService.findAll({ action, entityType, page: Number(page), limit: Number(limit) });
  }
}
