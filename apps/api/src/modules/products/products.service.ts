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

    // Secondary sorting logic within stock groups
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

    // Fetch entire matching dataset to apply primary stock status sorting across all pages before pagination
    const allMatchingProducts = await this.prisma.product.findMany({
      where,
      orderBy,
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
    });

    // Primary sort: In-stock products first, out-of-stock products last
    // Secondary sort: Preserves requested orderBy (Price, Newest, Bestselling) within each group
    const sortedAll = allMatchingProducts.sort((a, b) => {
      const aStock = a.productVariants?.reduce((sum, v) => sum + (v.stockQuantity || 0), 0) || 0;
      const bStock = b.productVariants?.reduce((sum, v) => sum + (v.stockQuantity || 0), 0) || 0;
      const aInStock = aStock > 0 ? 1 : 0;
      const bInStock = bStock > 0 ? 1 : 0;

      if (aInStock !== bInStock) {
        return bInStock - aInStock;
      }
      return 0; // Preserves database secondary sort order within each group
    });

    const total = sortedAll.length;
    const paginatedItems = sortedAll.slice(skip, skip + limit);

    return {
      items: paginatedItems,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        OR: [
          { slug },
          { id: slug },
        ],
        status: 'published',
      },
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

    if (!product) {
      throw new NotFoundException(`Product with slug "${slug}" not found`);
    }

    return product;
  }

  async findRelated(slug: string) {
    const targetProduct = await this.findBySlug(slug);

    const related = await this.prisma.product.findMany({
      where: {
        status: 'published',
        categoryId: targetProduct.categoryId,
        id: { not: targetProduct.id },
      },
      take: 4,
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
    });

    return related.sort((a, b) => {
      const aStock = a.productVariants?.reduce((sum, v) => sum + (v.stockQuantity || 0), 0) || 0;
      const bStock = b.productVariants?.reduce((sum, v) => sum + (v.stockQuantity || 0), 0) || 0;
      const aInStock = aStock > 0 ? 1 : 0;
      const bInStock = bStock > 0 ? 1 : 0;
      return bInStock - aInStock;
    });
  }
}
