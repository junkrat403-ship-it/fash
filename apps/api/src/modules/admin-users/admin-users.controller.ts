import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminUsersService } from './admin-users.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RequirePermissions } from '../../common/decorators/roles.decorator';

@ApiTags('Admin — Users & Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get('users')
  @RequirePermissions('users.read')
  @ApiOperation({ summary: 'List admin staff accounts' })
  async findAllUsers() {
    return this.adminUsersService.findAllUsers();
  }

  @Get('roles')
  @RequirePermissions('users.read')
  @ApiOperation({ summary: 'List roles and granular permissions' })
  async findAllRoles() {
    return this.adminUsersService.findAllRoles();
  }

  @Post('users')
  @RequirePermissions('users.write')
  @ApiOperation({ summary: 'Create new admin staff user' })
  async createUser(@Body() dto: CreateAdminUserDto) {
    return this.adminUsersService.createUser(dto);
  }

  @Patch('users/:id')
  @RequirePermissions('users.write')
  @ApiOperation({ summary: 'Update admin staff role or status' })
  async updateUser(
    @Param('id') id: string,
    @Body('roleId') roleId: string,
    @Body('isActive') isActive?: boolean,
  ) {
    return this.adminUsersService.updateUserRole(id, roleId, isActive);
  }
}
