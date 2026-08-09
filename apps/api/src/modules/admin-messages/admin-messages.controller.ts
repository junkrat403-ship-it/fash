import { Controller, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminMessagesService } from './admin-messages.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions } from '../../common/decorators/roles.decorator';

@ApiTags('Admin — Messages Inbox')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/messages')
export class AdminMessagesController {
  constructor(private readonly adminMessagesService: AdminMessagesService) {}

  @Get()
  @RequirePermissions('messages.read')
  @ApiOperation({ summary: 'List contact form messages inbox' })
  async findAll(@Query('status') status?: string) {
    return this.adminMessagesService.findAll(status);
  }

  @Patch(':id/status')
  @RequirePermissions('messages.write')
  @ApiOperation({ summary: 'Update contact message status' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: 'unread' | 'read' | 'replied',
  ) {
    return this.adminMessagesService.updateStatus(id, status);
  }
}
