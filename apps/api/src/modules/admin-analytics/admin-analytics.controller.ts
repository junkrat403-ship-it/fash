import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminAnalyticsService } from './admin-analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions } from '../../common/decorators/roles.decorator';

@ApiTags('Admin — Analytics & Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/analytics')
export class AdminAnalyticsController {
  constructor(private readonly adminAnalyticsService: AdminAnalyticsService) {}

  @Get('dashboard')
  @RequirePermissions('analytics.read')
  @ApiOperation({ summary: 'KPI summary dashboard report' })
  async getDashboardSummary() {
    return this.adminAnalyticsService.getDashboardSummary();
  }

  @Get('sales')
  @RequirePermissions('analytics.read')
  @ApiOperation({ summary: 'Filterable sales revenue report' })
  async getSalesReport(@Query('from') from?: string, @Query('to') to?: string) {
    return this.adminAnalyticsService.getSalesReport({ from, to });
  }
}
