import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CheckoutService } from './checkout.service';
import { CheckoutDto } from './dto/checkout.dto';

@ApiTags('Checkout & Orders')
@Controller()
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('checkout')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit checkout order and generate WhatsApp link' })
  @ApiResponse({ status: 201, description: 'Order created with status pending_whatsapp' })
  async checkout(@Body() dto: CheckoutDto) {
    return this.checkoutService.processCheckout(dto);
  }

  @Get('orders/:orderNumber/confirmation')
  @ApiOperation({ summary: 'Get order confirmation details by order number' })
  @ApiResponse({ status: 200, description: 'Order confirmation details returned' })
  async getConfirmation(@Param('orderNumber') orderNumber: string) {
    return this.checkoutService.getOrderConfirmation(orderNumber);
  }
}
