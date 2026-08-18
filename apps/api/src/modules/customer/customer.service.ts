import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(customerId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        addresses: {
          orderBy: { isDefault: 'desc' },
        },
        _count: {
          select: { orders: true },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }

    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      isGuest: customer.isGuest,
      totalOrders: customer._count.orders,
      addresses: customer.addresses,
      createdAt: customer.createdAt,
    };
  }

  async updateProfile(customerId: string, dto: UpdateProfileDto) {
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const updated = await this.prisma.customer.update({
      where: { id: customerId },
      data: {
        name: dto.name,
        phone: dto.phone || customer.phone,
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      isGuest: updated.isGuest,
    };
  }

  async getOrders(customerId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { customerId },
        include: {
          orderItems: true,
          orderStatusHistories: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({
        where: { customerId },
      }),
    ]);

    return {
      data: orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        customerPhone: o.customerPhone,
        customerEmail: o.customerEmail,
        shippingAddressSnapshot: o.shippingAddressSnapshot,
        subtotal: Number(o.subtotal),
        discountAmount: Number(o.discountAmount),
        total: Number(o.total),
        status: o.status,
        whatsappMessage: o.whatsappMessage,
        createdAt: o.createdAt,
        itemsCount: o.orderItems.reduce((sum, item) => sum + item.quantity, 0),
        orderItems: o.orderItems.map((item) => ({
          id: item.id,
          productNameSnapshot: item.productNameSnapshot,
          variantSnapshot: item.variantSnapshot,
          skuSnapshot: item.skuSnapshot,
          unitPrice: Number(item.unitPrice),
          quantity: item.quantity,
          lineTotal: Number(item.lineTotal),
        })),
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getOrderDetails(customerId: string, orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        orderItems: true,
        orderStatusHistories: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order "${orderNumber}" not found`);
    }

    if (order.customerId !== customerId) {
      throw new ForbiddenException('You do not have access to view this order');
    }

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      shippingAddressSnapshot: order.shippingAddressSnapshot,
      notes: order.notes,
      subtotal: Number(order.subtotal),
      discountAmount: Number(order.discountAmount),
      total: Number(order.total),
      status: order.status,
      whatsappMessage: order.whatsappMessage,
      whatsappSentAt: order.whatsappSentAt,
      createdAt: order.createdAt,
      orderItems: order.orderItems.map((item) => ({
        id: item.id,
        productNameSnapshot: item.productNameSnapshot,
        variantSnapshot: item.variantSnapshot,
        skuSnapshot: item.skuSnapshot,
        unitPrice: Number(item.unitPrice),
        quantity: item.quantity,
        lineTotal: Number(item.lineTotal),
      })),
      statusHistory: order.orderStatusHistories.map((h) => ({
        id: h.id,
        toStatus: h.toStatus,
        note: h.note,
        createdAt: h.createdAt,
      })),
    };
  }

  async getAddresses(customerId: string) {
    return this.prisma.address.findMany({
      where: { customerId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async createAddress(customerId: string, dto: CreateAddressDto) {
    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { customerId },
        data: { isDefault: false },
      });
    }

    const count = await this.prisma.address.count({ where: { customerId } });
    const isFirstAddress = count === 0;

    return this.prisma.address.create({
      data: {
        customerId,
        label: dto.label || 'Home',
        recipientName: dto.recipientName,
        phone: dto.phone,
        line1: dto.line1,
        line2: dto.line2 || null,
        city: dto.city,
        province: dto.province || null,
        postalCode: dto.postalCode || null,
        country: dto.country || 'Indonesia',
        isDefault: dto.isDefault ?? isFirstAddress,
      },
    });
  }

  async updateAddress(customerId: string, addressId: string, dto: UpdateAddressDto) {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.customerId !== customerId) {
      throw new ForbiddenException('You do not have access to modify this address');
    }

    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { customerId },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.update({
      where: { id: addressId },
      data: {
        ...(dto.label !== undefined && { label: dto.label }),
        ...(dto.recipientName !== undefined && { recipientName: dto.recipientName }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.line1 !== undefined && { line1: dto.line1 }),
        ...(dto.line2 !== undefined && { line2: dto.line2 }),
        ...(dto.city !== undefined && { city: dto.city }),
        ...(dto.province !== undefined && { province: dto.province }),
        ...(dto.postalCode !== undefined && { postalCode: dto.postalCode }),
        ...(dto.country !== undefined && { country: dto.country }),
        ...(dto.isDefault !== undefined && { isDefault: dto.isDefault }),
      },
    });
  }

  async deleteAddress(customerId: string, addressId: string) {
    const address = await this.prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.customerId !== customerId) {
      throw new ForbiddenException('You do not have access to delete this address');
    }

    await this.prisma.address.delete({
      where: { id: addressId },
    });

    return { message: 'Address deleted successfully' };
  }
}
