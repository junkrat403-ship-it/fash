import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminActivityLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: { action?: string; entityType?: string; page?: number; limit?: number }) {
    const { action, entityType, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;

    const [items, total] = await Promise.all([
      this.prisma.activityLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          adminUser: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      this.prisma.activityLog.count({ where }),
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

  async logAction(data: {
    adminUserId?: string;
    action: string;
    entityType: string;
    entityId?: string;
    beforeData?: any;
    afterData?: any;
    ipAddress?: string;
  }) {
    return this.prisma.activityLog.create({
      data: {
        adminUserId: data.adminUserId || null,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId || null,
        beforeData: data.beforeData || null,
        afterData: data.afterData || null,
        ipAddress: data.ipAddress || null,
      },
    });
  }
}
