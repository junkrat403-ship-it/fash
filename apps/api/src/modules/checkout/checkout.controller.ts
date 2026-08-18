import { Controller, Post, Get, Body, Param, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CheckoutService } from './checkout.service';
import { CheckoutDto } from './dto/checkout.dto';

@ApiTags('Checkout & Orders')
@Controller()
export class CheckoutController {
  constructor(
    private readonly checkoutService: CheckoutService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('checkout')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit checkout order and generate WhatsApp link' })
  @ApiResponse({ status: 201, description: 'Order created with status pending_whatsapp' })
  async checkout(@Body() dto: CheckoutDto, @Req() req: Request) {
    let customerId: string | undefined = undefined;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const payload = this.jwtService.verify(token);
        if (payload && payload.type === 'customer' && payload.sub) {
          customerId = payload.sub;
        }
      } catch {}
    }
    return this.checkoutService.processCheckout(dto, customerId);
  }

  @Get('orders/:orderNumber/confirmation')
  @ApiOperation({ summary: 'Get order confirmation details by order number' })
  @ApiResponse({ status: 200, description: 'Order confirmation details returned' })
  async getConfirmation(@Param('orderNumber') orderNumber: string) {
    return this.checkoutService.getOrderConfirmation(orderNumber);
  }
}
