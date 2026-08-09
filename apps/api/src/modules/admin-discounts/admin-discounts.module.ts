import { Module } from '@nestjs/common';
import { AdminDiscountsService } from './admin-discounts.service';
import { AdminDiscountsController } from './admin-discounts.controller';

@Module({
  controllers: [AdminDiscountsController],
  providers: [AdminDiscountsService],
  exports: [AdminDiscountsService],
})
export class AdminDiscountsModule {}
