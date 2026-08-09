import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { CheckoutDto } from './dto/checkout.dto';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async processCheckout(dto: CheckoutDto, customerId?: string) {
    // 1. Locate Cart
    let cart;
    if (dto.cartId) {
      cart = await this.prisma.cart.findUnique({
        where: { id: dto.cartId },
        include: this.cartInclude(),
      });
    } else if (customerId) {
      cart = await this.prisma.cart.findFirst({
        where: { customerId },
        include: this.cartInclude(),
      });
    } else if (dto.guestToken) {
      cart = await this.prisma.cart.findUnique({
        where: { guestToken: dto.guestToken },
        include: this.cartInclude(),
      });
    }

    if (!cart || !cart.cartItems.length) {
      throw new BadRequestException('Your cart is empty');
    }

    // 2. Validate stock for all items
    for (const item of cart.cartItems) {
      if (!item.variant || !item.variant.isActive || item.variant.product.status !== 'published') {
        throw new BadRequestException(`Product variant "${item.variant?.sku || 'Item'}" is no longer available`);
      }
      if (item.variant.stockQuantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for "${item.variant.product.name} (${item.variant.size || ''}/${item.variant.color || ''})". Requested: ${item.quantity}, Available: ${item.variant.stockQuantity}`,
        );
      }
    }

    // 3. Generate Sequential Order Number (ORD-YYYYMMDD-XXXX)
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const orderCountToday = await this.prisma.order.count({
      where: {
        orderNumber: {
          startsWith: `ORD-${todayStr}`,
        },
      },
    });
    const seq = String(orderCountToday + 1).padStart(4, '0');
    const orderNumber = `ORD-${todayStr}-${seq}`;

    // 4. Calculate subtotal & line totals
    let subtotal = 0;
    const orderItemsData = cart.cartItems.map((item) => {
      const unitPrice = Number(item.variant.priceOverride || item.variant.product.basePrice);
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      const variantSnapshot = [
        item.variant.size ? `Size: ${item.variant.size}` : null,
        item.variant.color ? `Color: ${item.variant.color}` : null,
      ].filter(Boolean).join(' / ');

      return {
        variantId: item.variantId,
        productNameSnapshot: item.variant.product.name,
        variantSnapshot: variantSnapshot || 'Standard',
        skuSnapshot: item.variant.sku,
        unitPrice,
        quantity: item.quantity,
        lineTotal,
      };
    });

    const total = subtotal; // No extra fees in v1; shipping arranged over WA

    // 5. Fetch WhatsApp Store Number from Settings or Config
    const storeSetting = await this.prisma.setting.findUnique({
      where: { key: 'store_whatsapp_number' },
    });
    let storePhone = storeSetting?.value ? String(storeSetting.value).replace(/[^0-9]/g, '') : '';
    if (!storePhone) {
      storePhone = this.configService.get<string>('STORE_WHATSAPP_NUMBER') || '6281234567890';
    }
    storePhone = storePhone.replace(/[^0-9]/g, '');

    // 6. Build Formatted WhatsApp Message
    const addressStr = [
      dto.shippingAddress.line1,
      dto.shippingAddress.line2,
      dto.shippingAddress.city,
      dto.shippingAddress.province,
      dto.shippingAddress.postalCode,
      dto.shippingAddress.country || 'Indonesia',
    ].filter(Boolean).join(', ');

    let messageText = `Halo, saya ingin memesan dari AURA:\n\n`;
    messageText += `📦 *Order Ref:* ${orderNumber}\n`;
    messageText += `👤 *Nama:* ${dto.customer.name}\n`;
    messageText += `📱 *Phone:* ${dto.customer.phone}\n`;
    if (dto.customer.email) messageText += `✉️ *Email:* ${dto.customer.email}\n`;
    messageText += `📍 *Alamat:* ${addressStr}\n\n`;

    messageText += `*Rincian Pesanan:*\n`;
    orderItemsData.forEach((item) => {
      messageText += `• ${item.quantity}x ${item.productNameSnapshot} (${item.variantSnapshot}) - Rp${item.lineTotal.toLocaleString('id-ID')}\n`;
    });

    messageText += `\n💰 *Total:* Rp${total.toLocaleString('id-ID')}\n`;
    if (dto.notes) messageText += `📝 *Catatan:* ${dto.notes}\n`;

    const whatsappRedirectUrl = `https://wa.me/${storePhone}?text=${encodeURIComponent(messageText)}`;

    // 7. Transaction: Create Order, Deduct Stock + Inventory Audit, Record Status History, Clear Cart
    const order = await this.prisma.$transaction(async (tx) => {
      // Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId,
          customerName: dto.customer.name,
          customerPhone: dto.customer.phone,
          customerEmail: dto.customer.email || null,
          shippingAddressSnapshot: dto.shippingAddress as any,
          notes: dto.notes || null,
          subtotal,
          total,
          status: 'pending_whatsapp',
          whatsappMessage: messageText,
          whatsappSentAt: new Date(),
          orderItems: {
            create: orderItemsData,
          },
        },
      });

      // Record Order Status History
      await tx.orderStatusHistory.create({
        data: {
          orderId: newOrder.id,
          toStatus: 'pending_whatsapp',
          note: 'Order created via storefront WhatsApp checkout flow',
        },
      });

      // Deduct stock and log inventory adjustments
      for (const item of cart.cartItems) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });

        await tx.inventoryAdjustment.create({
          data: {
            variantId: item.variantId,
            quantityDelta: -item.quantity,
            reason: 'order fulfilled',
            referenceOrderId: newOrder.id,
          },
        });
      }

      // Clear Cart Items
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return {
      orderNumber: order.orderNumber,
      total: Number(order.total),
      whatsappRedirectUrl,
      whatsappMessagePreview: messageText,
    };
  }

  async getOrderConfirmation(orderNumber: string) {
    const storeSetting = await this.prisma.setting.findUnique({
      where: { key: 'store_whatsapp_number' },
    });
    let storePhone = storeSetting?.value ? String(storeSetting.value).replace(/[^0-9]/g, '') : '6281234567890';

    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order "${orderNumber}" not found`);
    }

    const whatsappRedirectUrl = `https://wa.me/${storePhone}?text=${encodeURIComponent(order.whatsappMessage)}`;

    return {
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      shippingAddress: order.shippingAddressSnapshot,
      notes: order.notes,
      subtotal: Number(order.subtotal),
      total: Number(order.total),
      status: order.status,
      whatsappMessage: order.whatsappMessage,
      whatsappRedirectUrl,
      orderItems: order.orderItems,
      createdAt: order.createdAt,
    };
  }

  private cartInclude() {
    return {
      cartItems: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    };
  }
}
