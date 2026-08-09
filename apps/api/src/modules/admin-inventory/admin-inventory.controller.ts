import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminInventoryService } from './admin-inventory.service';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Admin — Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/inventory')
export class AdminInventoryController {
  constructor(private readonly adminInventoryService: AdminInventoryService) {}

  @Get()
  @RequirePermissions('products.read')
  @ApiOperation({ summary: 'List variant inventory levels with low stock alerts' })
  async findAll(
    @Query('lowStock') lowStock?: string,
    @Query('search') search?: string,
  ) {
    return this.adminInventoryService.findAll({
      lowStockOnly: lowStock === 'true',
      search,
    });
  }

  @Post(':variantId/adjust')
  @RequirePermissions('products.write')
  @ApiOperation({ summary: 'Manual stock adjustment with mandatory audit trail reason' })
  async adjustStock(
    @Param('variantId') variantId: string,
    @Body() dto: AdjustStockDto,
    @CurrentUser('userId') adminUserId: string,
  ) {
    return this.adminInventoryService.adjustStock(variantId, dto, adminUserId);
  }
}
