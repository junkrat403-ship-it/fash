import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateCart(customerId?: string, guestToken?: string) {
    if (customerId) {
      let cart = await this.prisma.cart.findFirst({
        where: { customerId },
        include: this.cartInclude(),
      });

      if (!cart) {
        cart = await this.prisma.cart.create({
          data: { customerId },
          include: this.cartInclude(),
        });
      }
      return cart;
    }

    const token = guestToken || randomUUID();
    let cart = await this.prisma.cart.findUnique({
      where: { guestToken: token },
      include: this.cartInclude(),
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { guestToken: token },
        include: this.cartInclude(),
      });
    }

    return cart;
  }

  async addItem(dto: AddCartItemDto, customerId?: string) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: dto.variantId },
      include: { product: true },
    });

    if (!variant || !variant.isActive || variant.product.status !== 'published') {
      throw new NotFoundException('Selected product variant is not available');
    }

    if (variant.stockQuantity < dto.quantity) {
      throw new BadRequestException(
        `Only ${variant.stockQuantity} item(s) available in stock`,
      );
    }

    const cart = await this.getOrCreateCart(customerId, dto.guestToken);

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId: dto.variantId,
        },
      },
    });

    const newQuantity = (existingItem?.quantity || 0) + dto.quantity;
    if (variant.stockQuantity < newQuantity) {
      throw new BadRequestException(
        `Cannot add ${dto.quantity} more. Total requested (${newQuantity}) exceeds stock (${variant.stockQuantity})`,
      );
    }

    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId: dto.variantId,
          quantity: dto.quantity,
        },
      });
    }

    return this.getOrCreateCart(customerId, cart.guestToken || undefined);
  }

  async updateItemQuantity(itemId: string, dto: UpdateCartItemDto) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { variant: true },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (dto.variantId && dto.variantId !== item.variantId) {
      const newVariant = await this.prisma.productVariant.findUnique({
        where: { id: dto.variantId },
      });

      if (!newVariant || !newVariant.isActive) {
        throw new NotFoundException('Target product variant is not available');
      }

      const targetQuantity = dto.quantity !== undefined ? dto.quantity : item.quantity;
      if (newVariant.stockQuantity < targetQuantity) {
        throw new BadRequestException(`Only ${newVariant.stockQuantity} item(s) available in stock`);
      }

      const existingSameVariantItem = await this.prisma.cartItem.findUnique({
        where: {
          cartId_variantId: {
            cartId: item.cartId,
            variantId: dto.variantId,
          },
        },
      });

      if (existingSameVariantItem) {
        const combinedQuantity = existingSameVariantItem.quantity + targetQuantity;
        if (newVariant.stockQuantity < combinedQuantity) {
          throw new BadRequestException(`Cannot merge items. Total requested (${combinedQuantity}) exceeds stock (${newVariant.stockQuantity}).`);
        }

        await this.prisma.cartItem.delete({ where: { id: itemId } });
        await this.prisma.cartItem.update({
          where: { id: existingSameVariantItem.id },
          data: { quantity: combinedQuantity },
        });
      } else {
        await this.prisma.cartItem.update({
          where: { id: itemId },
          data: {
            variantId: dto.variantId,
            quantity: targetQuantity,
          },
        });
      }
    } else if (dto.quantity !== undefined) {
      if (item.variant.stockQuantity < dto.quantity) {
        throw new BadRequestException(`Only ${item.variant.stockQuantity} item(s) available in stock`);
      }

      await this.prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: dto.quantity },
      });
    }

    return this.prisma.cart.findUnique({
      where: { id: item.cartId },
      include: this.cartInclude(),
    });
  }

  async removeItem(itemId: string) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return this.prisma.cart.findUnique({
      where: { id: item.cartId },
      include: this.cartInclude(),
    });
  }

  private cartInclude() {
    return {
      cartItems: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  productImages: {
                    where: { isPrimary: true },
                    take: 1,
                  },
                  productVariants: {
                    where: { isActive: true },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' as const },
      },
    };
  }
}
