import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBannerDto } from './dto/create-banner.dto';

@Injectable()
export class AdminBannersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.banner.findMany({
      orderBy: { displayOrder: 'asc' },
    });
  }

  async create(dto: CreateBannerDto) {
    return this.prisma.banner.create({
      data: {
        placement: dto.placement,
        title: dto.title || null,
        subtitle: dto.subtitle || null,
        imageUrl: dto.imageUrl,
        linkUrl: dto.linkUrl || null,
        displayOrder: dto.displayOrder || 0,
        isActive: dto.isActive !== undefined ? dto.isActive : true,
      },
    });
  }

  async update(id: string, dto: Partial<CreateBannerDto>) {
    const banner = await this.prisma.banner.findUnique({ where: { id } });
    if (!banner) {
      throw new NotFoundException(`Banner "${id}" not found`);
    }

    return this.prisma.banner.update({
      where: { id },
      data: {
        ...(dto.placement ? { placement: dto.placement } : {}),
        ...(dto.title !== undefined ? { title: dto.title || null } : {}),
        ...(dto.subtitle !== undefined ? { subtitle: dto.subtitle || null } : {}),
        ...(dto.imageUrl ? { imageUrl: dto.imageUrl } : {}),
        ...(dto.linkUrl !== undefined ? { linkUrl: dto.linkUrl || null } : {}),
        ...(dto.displayOrder !== undefined ? { displayOrder: dto.displayOrder } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      },
    });
  }

  async delete(id: string) {
    await this.prisma.banner.delete({ where: { id } });
    return { success: true, message: `Banner ${id} deleted` };
  }
}
