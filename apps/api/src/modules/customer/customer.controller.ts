import { Controller, Get, Put, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { CustomerAuthGuard } from '../../common/guards/customer-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateAddressDto } from './dto/create-address.dto';

@ApiTags('Customer Account')
@ApiBearerAuth()
@UseGuards(CustomerAuthGuard)
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current customer profile' })
  @ApiResponse({ status: 200, description: 'Customer profile details' })
  async getProfile(@CurrentUser() user: any) {
    return this.customerService.getProfile(user.userId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update customer profile name and phone' })
  @ApiResponse({ status: 200, description: 'Customer profile updated' })
  async updateProfile(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    return this.customerService.updateProfile(user.userId, dto);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get customer order history' })
  @ApiResponse({ status: 200, description: 'List of past orders' })
  async getOrders(
    @CurrentUser() user: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.customerService.getOrders(
      user.userId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get('orders/:orderNumber')
  @ApiOperation({ summary: 'Get details for a specific order' })
  @ApiResponse({ status: 200, description: 'Order details' })
  async getOrderDetails(
    @CurrentUser() user: any,
    @Param('orderNumber') orderNumber: string,
  ) {
    return this.customerService.getOrderDetails(user.userId, orderNumber);
  }

  @Get('addresses')
  @ApiOperation({ summary: 'Get saved shipping addresses' })
  @ApiResponse({ status: 200, description: 'List of saved addresses' })
  async getAddresses(@CurrentUser() user: any) {
    return this.customerService.getAddresses(user.userId);
  }

  @Post('addresses')
  @ApiOperation({ summary: 'Create a new saved shipping address' })
  @ApiResponse({ status: 201, description: 'Address created' })
  async createAddress(@CurrentUser() user: any, @Body() dto: CreateAddressDto) {
    return this.customerService.createAddress(user.userId, dto);
  }

  @Delete('addresses/:id')
  @ApiOperation({ summary: 'Delete a saved shipping address' })
  @ApiResponse({ status: 200, description: 'Address deleted' })
  async deleteAddress(@CurrentUser() user: any, @Param('id') id: string) {
    return this.customerService.deleteAddress(user.userId, id);
  }
}
