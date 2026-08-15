import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardSummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalRevenue,
      todayRevenue,
      totalOrders,
      pendingOrders,
      topSellingProducts,
      recentOrders,
    ] = await Promise.all([
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { in: ['confirmed', 'processing', 'shipped', 'delivered'] } },
      }),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: {
          createdAt: { gte: today },
          status: { in: ['confirmed', 'processing', 'shipped', 'delivered'] },
        },
      }),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: 'pending_whatsapp' } }),
      this.prisma.product.findMany({
        take: 5,
        orderBy: { salesCount: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          salesCount: true,
          basePrice: true,
        },
      }),
      this.prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          total: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      totalRevenue: Number(totalRevenue._sum.total || 0),
      todayRevenue: Number(todayRevenue._sum.total || 0),
      totalOrders,
      pendingOrders,
      topSellingProducts,
      recentOrders,
    };
  }

  async getSalesReport(query: { from?: string; to?: string }) {
    const where: any = {
      status: { in: ['confirmed', 'processing', 'shipped', 'delivered'] },
    };

    if (query.from || query.to) {
      where.createdAt = {};
      if (query.from) where.createdAt.gte = new Date(query.from);
      if (query.to) where.createdAt.lte = new Date(query.to);
    }

    const orders = await this.prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        customerPhone: true,
        subtotal: true,
        total: true,
        status: true,
        createdAt: true,
      },
    });

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0);

    return {
      ordersCount: orders.length,
      totalRevenue,
      orders,
    };
  }
}
