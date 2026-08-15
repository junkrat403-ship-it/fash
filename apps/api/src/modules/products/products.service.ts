import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductQueryDto, ProductSortOption } from './dto/product-query.dto';
import { Prisma } from '@prisma/client';

const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ProductQueryDto) {
    const { category, minPrice, maxPrice, priceRange, size, color, sort, q, page = 1, limit = 12 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      status: 'published',
    };

    if (category) {
      const isCategoryUuid = UUID_REGEX.test(category);
      where.category = {
        OR: [
          { slug: category },
          ...(isCategoryUuid ? [{ id: category }] : []),
        ],
      };
    }

    let effMinPrice = minPrice;
    let effMaxPrice = maxPrice;
    if (effMinPrice === undefined && effMaxPrice === undefined && priceRange) {
      if (priceRange === 'under-200k') {
        effMaxPrice = 200000;
      } else if (priceRange === '200k-350k') {
        effMinPrice = 200000;
        effMaxPrice = 350000;
      } else if (priceRange === '350k-500k') {
        effMinPrice = 350000;
        effMaxPrice = 500000;
      } else if (priceRange === '500k-plus') {
        effMinPrice = 500000;
      }
    }

    if (effMinPrice !== undefined || effMaxPrice !== undefined) {
      where.basePrice = {};
      if (effMinPrice !== undefined && !isNaN(Number(effMinPrice))) {
        where.basePrice.gte = Number(effMinPrice);
      }
      if (effMaxPrice !== undefined && !isNaN(Number(effMaxPrice))) {
        where.basePrice.lte = Number(effMaxPrice);
      }
    }

    if (size || color) {
      where.productVariants = {
        some: {
          isActive: true,
          ...(size ? { size: { equals: size, mode: 'insensitive' } } : {}),
          ...(color ? { color: { equals: color, mode: 'insensitive' } } : {}),
        },
      };
    }

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
    const isUuid = UUID_REGEX.test(slug);

    const product = await this.prisma.product.findFirst({
      where: {
        status: 'published',
        ...(isUuid ? { OR: [{ id: slug }, { slug }] } : { slug }),
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
