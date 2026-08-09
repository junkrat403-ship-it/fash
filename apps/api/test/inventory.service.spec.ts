import { Test, TestingModule } from '@nestjs/testing';
import { AdminInventoryService } from '../src/modules/admin-inventory/admin-inventory.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AdminInventoryService', () => {
  let service: AdminInventoryService;
  let prisma: any;

  const mockVariant = {
    id: 'variant-1',
    sku: 'TS-OLS-M-BLK',
    stockQuantity: 10,
    lowStockThreshold: 5,
    product: { name: 'Oversized Linen Shirt' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminInventoryService,
        {
          provide: PrismaService,
          useValue: {
            productVariant: {
              findUnique: jest.fn(),
            },
            $transaction: jest.fn().mockImplementation(async (cb) => {
              return cb({
                productVariant: {
                  update: jest.fn().mockResolvedValue({ ...mockVariant, stockQuantity: 15 }),
                },
                inventoryAdjustment: {
                  create: jest.fn().mockResolvedValue({
                    id: 'adj-1',
                    quantityDelta: 5,
                    reason: 'Supplier restock',
                  }),
                },
              });
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AdminInventoryService>(AdminInventoryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('adjustStock', () => {
    it('should update stock and create inventory_adjustments audit log row', async () => {
      jest.spyOn(prisma.productVariant, 'findUnique').mockResolvedValue(mockVariant as any);

      const result = await service.adjustStock('variant-1', {
        delta: 5,
        reason: 'Supplier restock',
      });

      expect(result.variant.stockQuantity).toBe(15);
      expect(result.adjustment.quantityDelta).toBe(5);
      expect(result.adjustment.reason).toBe('Supplier restock');
    });

    it('should throw BadRequestException if negative delta exceeds current stock', async () => {
      jest.spyOn(prisma.productVariant, 'findUnique').mockResolvedValue(mockVariant as any);

      await expect(
        service.adjustStock('variant-1', {
          delta: -15,
          reason: 'Correction',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if variant does not exist', async () => {
      jest.spyOn(prisma.productVariant, 'findUnique').mockResolvedValue(null);

      await expect(
        service.adjustStock('non-existent', {
          delta: 5,
          reason: 'Test',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
