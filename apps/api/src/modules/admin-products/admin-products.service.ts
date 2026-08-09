import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAdminProductDto } from './dto/create-admin-product.dto';
import { UpdateAdminProductDto } from './dto/update-admin-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { status?: string; categoryId?: string; q?: string; page?: number; limit?: number }) {
    const { status, categoryId, q, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (status) {
      where.status = status as any;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (q && q.trim() !== '') {
      const search = q.trim();
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { skuPrefix: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          productImages: { orderBy: { displayOrder: 'asc' } },
          productVariants: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        productImages: { orderBy: { displayOrder: 'asc' } },
        productVariants: {
          include: {
            inventoryAdjustments: {
              orderBy: { createdAt: 'desc' },
              take: 5,
            },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return product;
  }

  async create(dto: CreateAdminProductDto, adminUserId?: string) {
    const existing = await this.prisma.product.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException(`Slug "${dto.slug}" is already in use`);
    }

    const createdProduct = await this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name: dto.name,
          slug: dto.slug,
          categoryId: dto.categoryId || null,
          basePrice: dto.basePrice,
          status: dto.status as any,
          skuPrefix: dto.skuPrefix || null,
          description: dto.description || null,
        },
      });

      // Images
      if (dto.images?.length) {
        for (let idx = 0; idx < dto.images.length; idx++) {
          const img = dto.images[idx];
          await tx.productImage.create({
            data: {
              productId: product.id,
              url: img.url,
              altText: img.altText || null,
              isPrimary: img.isPrimary || idx === 0,
              displayOrder: idx,
            },
          });
        }
      }

      // Variants + Initial Stock Adjustments Audit
      if (dto.variants?.length) {
        for (const v of dto.variants) {
          const variant = await tx.productVariant.create({
            data: {
              productId: product.id,
              sku: v.sku,
              size: v.size || null,
              color: v.color || null,
              colorHex: v.colorHex || null,
              priceOverride: v.priceOverride || null,
              stockQuantity: v.stockQuantity,
              lowStockThreshold: v.lowStockThreshold || 5,
            },
          });

          if (v.stockQuantity > 0) {
            await tx.inventoryAdjustment.create({
              data: {
                variantId: variant.id,
                adminUserId: adminUserId || null,
                quantityDelta: v.stockQuantity,
                reason: 'initial restock on creation',
              },
            });
          }
        }
      }

      return product;
    });

    // Return full product with relations after transaction has committed to DB
    return this.findOne(createdProduct.id);
  }

  async update(id: string, dto: UpdateAdminProductDto) {
    await this.findOne(id); // Ensure exists

    if (dto.slug) {
      const existing = await this.prisma.product.findFirst({
        where: { slug: dto.slug, id: { not: id } },
      });
      if (existing) {
        throw new ConflictException(`Slug "${dto.slug}" is already in use by another product`);
      }
    }

    await this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.name ? { name: dto.name } : {}),
        ...(dto.slug ? { slug: dto.slug } : {}),
        ...(dto.categoryId !== undefined ? { categoryId: dto.categoryId || null } : {}),
        ...(dto.basePrice !== undefined ? { basePrice: dto.basePrice } : {}),
        ...(dto.status ? { status: dto.status as any } : {}),
        ...(dto.skuPrefix !== undefined ? { skuPrefix: dto.skuPrefix || null } : {}),
        ...(dto.description !== undefined ? { description: dto.description || null } : {}),
      },
    });

    return this.findOne(id);
  }

  async delete(id: string) {
    await this.findOne(id);
    await this.prisma.product.delete({
      where: { id },
    });
    return { success: true, message: `Product ${id} deleted successfully` };
  }
}
