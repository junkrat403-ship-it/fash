import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CollectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllActive() {
    return this.prisma.collection.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.collection.findUnique({
      where: { slug },
      include: {
        productCollections: {
          include: {
            product: {
              include: {
                productImages: true,
                productVariants: true,
              },
            },
          },
        },
      },
    });
  }
}
