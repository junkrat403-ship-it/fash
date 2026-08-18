import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CustomerAuthGuard } from '../../common/guards/customer-auth.guard';
import { OptionalCustomerAuthGuard } from '../../common/guards/optional-customer-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(OptionalCustomerAuthGuard)
  @ApiOperation({ summary: 'Get active cart by customer or guest token' })
  @ApiQuery({ name: 'guestToken', required: false })
  async getCart(
    @CurrentUser() user: any,
    @Query('guestToken') guestToken?: string,
  ) {
    return this.cartService.getOrCreateCart(user?.userId, guestToken);
  }

  @Post('items')
  @UseGuards(OptionalCustomerAuthGuard)
  @ApiOperation({ summary: 'Add item to cart with stock validation' })
  async addItem(
    @CurrentUser() user: any,
    @Body() dto: AddCartItemDto,
  ) {
    return this.cartService.addItem(dto, user?.userId);
  }

  @Patch('items/:itemId')
  @UseGuards(OptionalCustomerAuthGuard)
  @ApiOperation({ summary: 'Update cart item quantity' })
  async updateItem(
    @CurrentUser() user: any,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItemQuantity(itemId, dto, user?.userId);
  }

  @Delete('items/:itemId')
  @UseGuards(OptionalCustomerAuthGuard)
  @ApiOperation({ summary: 'Remove item from cart' })
  async removeItem(
    @CurrentUser() user: any,
    @Param('itemId') itemId: string,
  ) {
    return this.cartService.removeItem(itemId, user?.userId);
  }

  @Post('merge')
  @UseGuards(CustomerAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Merge guest cart with customer cart upon login' })
  async mergeCart(
    @CurrentUser() user: any,
    @Body('guestToken') guestToken: string,
  ) {
    return this.cartService.mergeGuestCart(guestToken, user.userId);
  }
}
