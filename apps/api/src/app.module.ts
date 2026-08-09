import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { ProductsModule } from './modules/products/products.module';
import { BannersModule } from './modules/banners/banners.module';
import { ContactMessagesModule } from './modules/contact-messages/contact-messages.module';
import { CartModule } from './modules/cart/cart.module';
import { CheckoutModule } from './modules/checkout/checkout.module';

import { AdminProductsModule } from './modules/admin-products/admin-products.module';
import { AdminCategoriesModule } from './modules/admin-categories/admin-categories.module';
import { AdminInventoryModule } from './modules/admin-inventory/admin-inventory.module';
import { AdminOrdersModule } from './modules/admin-orders/admin-orders.module';
import { AdminCustomersModule } from './modules/admin-customers/admin-customers.module';

import { AdminBannersModule } from './modules/admin-banners/admin-banners.module';
import { AdminDiscountsModule } from './modules/admin-discounts/admin-discounts.module';
import { AdminMessagesModule } from './modules/admin-messages/admin-messages.module';
import { AdminSettingsModule } from './modules/admin-settings/admin-settings.module';
import { AdminUsersModule } from './modules/admin-users/admin-users.module';
import { AdminActivityLogsModule } from './modules/admin-activity-logs/admin-activity-logs.module';
import { AdminAnalyticsModule } from './modules/admin-analytics/admin-analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    PrismaModule,
    AuthModule,
    HealthModule,
    CategoriesModule,
    CollectionsModule,
    ProductsModule,
    BannersModule,
    ContactMessagesModule,
    CartModule,
    CheckoutModule,
    AdminProductsModule,
    AdminCategoriesModule,
    AdminInventoryModule,
    AdminOrdersModule,
    AdminCustomersModule,
    AdminBannersModule,
    AdminDiscountsModule,
    AdminMessagesModule,
    AdminSettingsModule,
    AdminUsersModule,
    AdminActivityLogsModule,
    AdminAnalyticsModule,
  ],
})
export class AppModule {}
