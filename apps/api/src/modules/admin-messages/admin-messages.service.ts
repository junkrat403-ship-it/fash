import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminMessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(status?: string) {
    return this.prisma.contactMessage.findMany({
      where: status ? { status: status as any } : {},
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: 'unread' | 'read' | 'replied') {
    const msg = await this.prisma.contactMessage.findUnique({ where: { id } });
    if (!msg) throw new NotFoundException(`Message "${id}" not found`);

    return this.prisma.contactMessage.update({
      where: { id },
      data: { status },
    });
  }
}
