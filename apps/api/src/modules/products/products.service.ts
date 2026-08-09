import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductQueryDto, ProductSortOption } from './dto/product-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ProductQueryDto) {
    const { category, minPrice, maxPrice, size, color, sort, q, page = 1, limit = 12 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      status: 'published',
    };

    // Category filter
    if (category) {
      where.category = {
        OR: [
          { slug: category },
          { id: category },
        ],
      };
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.basePrice = {};
      if (minPrice !== undefined) where.basePrice.gte = minPrice;
      if (maxPrice !== undefined) where.basePrice.lte = maxPrice;
    }

    // Variant size/color filter
    if (size || color) {
      where.productVariants = {
        some: {
          isActive: true,
          ...(size ? { size: { equals: size, mode: 'insensitive' } } : {}),
          ...(color ? { color: { equals: color, mode: 'insensitive' } } : {}),
        },
      };
    }

    // Keyword search
    if (q && q.trim() !== '') {
      const searchTerm = q.trim();
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { skuPrefix: { contains: searchTerm, mode: 'insensitive' } },
        {
          productVariants: {
            some: {
              sku: { contains: searchTerm, mode: 'insensitive' },
            },
          },
        },
      ];
    }

    // Sorting logic
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === ProductSortOption.BESTSELLING) {
      orderBy = { salesCount: 'desc' };
    } else if (sort === ProductSortOption.PRICE_ASC) {
      orderBy = { basePrice: 'asc' };
    } else if (sort === ProductSortOption.PRICE_DESC) {
      orderBy = { basePrice: 'desc' };
    } else {
      orderBy = { createdAt: 'desc' };
    }

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          productImages: {
            orderBy: { displayOrder: 'asc' },
          },
          productVariants: {
            where: { isActive: true },
          },
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

  async findBySlug(slug: string) {
    const normalizedSlug = slug.replace(/_/g, '-');
    const product = await this.prisma.product.findFirst({
      where: {
        OR: [
          { slug },
          { slug: normalizedSlug },
        ],
      },
      include: {
        category: true,
        productImages: {
          orderBy: { displayOrder: 'asc' },
        },
        productVariants: {
          where: { isActive: true },
          orderBy: [
            { size: 'asc' },
            { color: 'asc' },
          ],
        },
      },
    });

    if (!product || product.status !== 'published') {
      throw new NotFoundException(`Product with slug "${slug}" not found`);
    }

    return product;
  }

  async findRelated(slug: string, limit = 4) {
    const normalizedSlug = slug.replace(/_/g, '-');
    const product = await this.prisma.product.findFirst({
      where: {
        OR: [
          { slug },
          { slug: normalizedSlug },
        ],
      },
      select: { id: true, categoryId: true },
    });

    if (!product) return [];

    // 1. Fetch products in the same category (excluding current product)
    const sameCategory = await this.prisma.product.findMany({
      where: {
        status: 'published',
        id: { not: product.id },
        ...(product.categoryId ? { categoryId: product.categoryId } : {}),
      },
      take: limit,
      include: {
        category: true,
        productImages: {
          orderBy: { displayOrder: 'asc' },
        },
        productVariants: {
          where: { isActive: true },
        },
      },
    });

    // If we have enough category matches, return them
    if (sameCategory.length >= limit) {
      return sameCategory;
    }

    // 2. Backfill with other published products if category has fewer than limit products
    const existingIds = [product.id, ...sameCategory.map((p) => p.id)];
    const backfillLimit = limit - sameCategory.length;

    const backfill = await this.prisma.product.findMany({
      where: {
        status: 'published',
        id: { notIn: existingIds },
      },
      take: backfillLimit,
      include: {
        category: true,
        productImages: {
          orderBy: { displayOrder: 'asc' },
        },
        productVariants: {
          where: { isActive: true },
        },
      },
    });

    return [...sameCategory, ...backfill];
  }
}
