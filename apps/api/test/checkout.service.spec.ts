import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutService } from '../src/modules/checkout/checkout.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';

describe('CheckoutService', () => {
  let service: CheckoutService;
  let prisma: any;

  const mockCartItem = {
    id: 'cart-item-1',
    variantId: 'variant-1',
    quantity: 2,
    variant: {
      id: 'variant-1',
      sku: 'TS-OLS-M-BLK',
      size: 'M',
      color: 'Black',
      stockQuantity: 10,
      isActive: true,
      priceOverride: null,
      product: {
        id: 'prod-1',
        name: 'Oversized Linen Shirt',
        basePrice: 229000,
        status: 'published',
      },
    },
  };

  const mockCart = {
    id: 'cart-1',
    guestToken: 'guest_123',
    cartItems: [mockCartItem],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckoutService,
        {
          provide: PrismaService,
          useValue: {
            cart: {
              findUnique: jest.fn(),
              findFirst: jest.fn(),
            },
            order: {
              count: jest.fn().mockResolvedValue(0),
              findUnique: jest.fn(),
            },
            setting: {
              findUnique: jest.fn().mockResolvedValue({ key: 'store_whatsapp_number', value: '6281234567890' }),
            },
            $transaction: jest.fn().mockImplementation(async (cb) => {
              return cb({
                order: {
                  create: jest.fn().mockResolvedValue({
                    id: 'order-1',
                    orderNumber: 'ORD-20260730-0001',
                    total: 458000,
                  }),
                },
                orderStatusHistory: {
                  create: jest.fn().mockResolvedValue({}),
                },
                productVariant: {
                  update: jest.fn().mockResolvedValue({}),
                },
                inventoryAdjustment: {
                  create: jest.fn().mockResolvedValue({}),
                },
                cartItem: {
                  deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
                },
              });
            }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('6281234567890'),
          },
        },
      ],
    }).compile();

    service = module.get<CheckoutService>(CheckoutService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('processCheckout', () => {
    it('should generate order number, formatted message, and wa.me link', async () => {
      jest.spyOn(prisma.cart, 'findUnique').mockResolvedValue(mockCart as any);

      const result = await service.processCheckout({
        customer: {
          name: 'Dinda Pratiwi',
          phone: '+6281234567890',
        },
        shippingAddress: {
          line1: 'Jl. Merdeka No. 10',
          city: 'Medan',
        },
        cartId: 'cart-1',
      });

      expect(result.orderNumber).toBe('ORD-20260730-0001');
      expect(result.total).toBe(458000);
      expect(result.whatsappRedirectUrl).toContain('https://wa.me/6281234567890?text=');
      expect(result.whatsappMessagePreview).toContain('Oversized Linen Shirt');
    });

    it('should throw BadRequestException when cart is empty', async () => {
      jest.spyOn(prisma.cart, 'findUnique').mockResolvedValue({ id: 'cart-empty', cartItems: [] } as any);

      await expect(
        service.processCheckout({
          customer: { name: 'Test', phone: '123' },
          shippingAddress: { line1: 'Test', city: 'Test' },
          cartId: 'cart-empty',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
