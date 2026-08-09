import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDiscountDto } from './dto/create-discount.dto';

@Injectable()
export class AdminDiscountsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.discount.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { discountRedemptions: true } },
      },
    });
  }

  async create(dto: CreateDiscountDto) {
    if (dto.code) {
      const existing = await this.prisma.discount.findUnique({
        where: { code: dto.code.toUpperCase() },
      });
      if (existing) {
        throw new ConflictException(`Discount code "${dto.code}" already exists`);
      }
    }

    return this.prisma.discount.create({
      data: {
        code: dto.code ? dto.code.toUpperCase() : null,
        type: dto.type as any,
        value: dto.value,
        minOrderValue: dto.minOrderValue || 0,
        usageLimit: dto.usageLimit || null,
        isActive: dto.isActive !== undefined ? dto.isActive : true,
      },
    });
  }

  async update(id: string, dto: Partial<CreateDiscountDto>) {
    const discount = await this.prisma.discount.findUnique({ where: { id } });
    if (!discount) {
      throw new NotFoundException(`Discount "${id}" not found`);
    }

    if (dto.code && dto.code.toUpperCase() !== discount.code) {
      const existing = await this.prisma.discount.findUnique({ where: { code: dto.code.toUpperCase() } });
      if (existing) {
        throw new ConflictException(`Discount code "${dto.code}" already exists`);
      }
    }

    return this.prisma.discount.update({
      where: { id },
      data: {
        ...(dto.code ? { code: dto.code.toUpperCase() } : {}),
        ...(dto.type ? { type: dto.type as any } : {}),
        ...(dto.value !== undefined ? { value: dto.value } : {}),
        ...(dto.minOrderValue !== undefined ? { minOrderValue: dto.minOrderValue } : {}),
        ...(dto.usageLimit !== undefined ? { usageLimit: dto.usageLimit || null } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      },
    });
  }

  async delete(id: string) {
    await this.prisma.discount.delete({ where: { id } });
    return { success: true, message: `Discount ${id} deleted` };
  }
}
