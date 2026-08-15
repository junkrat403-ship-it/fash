import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdjustStockDto } from './dto/adjust-stock.dto';

@Injectable()
export class AdminInventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { lowStockOnly?: boolean; search?: string }) {
    const { lowStockOnly, search } = query;

    const variants = await this.prisma.productVariant.findMany({
      where: {
        isActive: true,
        ...(search
          ? {
              OR: [
                { sku: { contains: search, mode: 'insensitive' } },
                { product: { name: { contains: search, mode: 'insensitive' } } },
              ],
            }
          : {}),
      },
      orderBy: { stockQuantity: 'asc' },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
            productImages: {
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
        inventoryAdjustments: {
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
      },
    });

    if (lowStockOnly) {
      return variants.filter((v) => v.stockQuantity <= v.lowStockThreshold);
    }

    return variants;
  }

  async adjustStock(variantId: string, dto: AdjustStockDto, adminUserId?: string) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant) {
      throw new NotFoundException(`Variant "${variantId}" not found`);
    }

    const newStock = variant.stockQuantity + dto.delta;
    if (newStock < 0) {
      throw new BadRequestException(
        `Cannot reduce stock by ${Math.abs(dto.delta)}. Current stock is ${variant.stockQuantity}`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedVariant = await tx.productVariant.update({
        where: { id: variantId },
        data: {
          stockQuantity: newStock,
        },
      });

      // 2. Write mandatory inventory adjustment audit trail row
      const adjustment = await tx.inventoryAdjustment.create({
        data: {
          variantId,
          adminUserId: adminUserId || null,
          quantityDelta: dto.delta,
          reason: dto.reason,
          referenceOrderId: dto.referenceOrderId || null,
        },
      });

      return {
        variant: updatedVariant,
        adjustment,
      };
    });
  }
}
