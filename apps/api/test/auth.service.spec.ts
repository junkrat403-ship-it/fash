import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/modules/auth/auth.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwt: JwtService;

  const mockAdminUser = {
    id: 'admin-uuid-1',
    name: 'Admin Owner',
    email: 'admin@fashionstore.com',
    passwordHash: '',
    isActive: true,
    role: {
      id: 'role-owner-id',
      name: 'Owner',
      rolePermissions: [
        { permission: { code: 'products.read' } },
        { permission: { code: 'products.write' } },
      ],
    },
  };

  const mockCustomer = {
    id: 'customer-uuid-1',
    name: 'Dinda Pratiwi',
    phone: '+6281234567890',
    email: 'dinda@example.com',
    passwordHash: '',
    isGuest: false,
  };

  beforeEach(async () => {
    mockAdminUser.passwordHash = await bcrypt.hash('AdminPass123!', 10);
    mockCustomer.passwordHash = await bcrypt.hash('Secret123!', 10);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            adminUser: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            customer: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked-jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
  });

  describe('adminLogin', () => {
    it('should authenticate admin user with valid credentials', async () => {
      jest.spyOn(prisma.adminUser, 'findUnique').mockResolvedValue(mockAdminUser as any);
      jest.spyOn(prisma.adminUser, 'update').mockResolvedValue(mockAdminUser as any);

      const result = await service.adminLogin({
        email: 'admin@fashionstore.com',
        password: 'AdminPass123!',
      });

      expect(result.accessToken).toBe('mocked-jwt-token');
      expect(result.user.email).toBe('admin@fashionstore.com');
      expect(result.user.role).toBe('Owner');
    });

    it('should throw UnauthorizedException on invalid password', async () => {
      jest.spyOn(prisma.adminUser, 'findUnique').mockResolvedValue(mockAdminUser as any);

      await expect(
        service.adminLogin({
          email: 'admin@fashionstore.com',
          password: 'WrongPassword!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('customerRegister', () => {
    it('should register a new customer with hashed password', async () => {
      jest.spyOn(prisma.customer, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.customer, 'create').mockResolvedValue(mockCustomer as any);

      const result = await service.customerRegister({
        name: 'Dinda Pratiwi',
        phone: '+6281234567890',
        email: 'dinda@example.com',
        password: 'Secret123!',
      });

      expect(result.accessToken).toBe('mocked-jwt-token');
      expect(result.user.name).toBe('Dinda Pratiwi');
    });

    it('should throw ConflictException if email is already taken', async () => {
      jest.spyOn(prisma.customer, 'findUnique').mockResolvedValue(mockCustomer as any);

      await expect(
        service.customerRegister({
          name: 'Dinda Pratiwi',
          phone: '+6281234567890',
          email: 'dinda@example.com',
          password: 'Secret123!',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });
});
