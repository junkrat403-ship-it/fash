import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CustomerAuthGuard } from '../../common/guards/customer-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get active cart by guest token' })
  @ApiQuery({ name: 'guestToken', required: false })
  async getCart(@Query('guestToken') guestToken?: string) {
    return this.cartService.getOrCreateCart(undefined, guestToken);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart with stock validation' })
  async addItem(@Body() dto: AddCartItemDto) {
    return this.cartService.addItem(dto);
  }

  @Patch('items/:itemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  async updateItem(
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItemQuantity(itemId, dto);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  async removeItem(@Param('itemId') itemId: string) {
    return this.cartService.removeItem(itemId);
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
