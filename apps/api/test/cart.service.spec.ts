import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '../src/modules/cart/cart.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;
  let prisma: any;

  const mockVariant = {
    id: 'variant-uuid-1',
    sku: 'TS-OLS-M-BLK',
    size: 'M',
    color: 'Black',
    stockQuantity: 10,
    isActive: true,
    priceOverride: null,
    product: {
      id: 'prod-uuid-1',
      name: 'Oversized Linen Shirt',
      basePrice: 229000,
      status: 'published',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: PrismaService,
          useValue: {
            productVariant: {
              findUnique: jest.fn(),
            },
            cart: {
              findFirst: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
            },
            cartItem: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('addItem', () => {
    it('should throw BadRequestException if item quantity exceeds stock', async () => {
      jest.spyOn(prisma.productVariant, 'findUnique').mockResolvedValue(mockVariant as any);

      await expect(
        service.addItem({
          variantId: 'variant-uuid-1',
          quantity: 15,
          guestToken: 'guest_12345',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if variant is inactive or missing', async () => {
      jest.spyOn(prisma.productVariant, 'findUnique').mockResolvedValue(null);

      await expect(
        service.addItem({
          variantId: 'non-existent-variant',
          quantity: 1,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
