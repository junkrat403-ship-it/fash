import { Module } from '@nestjs/common';
import { AdminBannersService } from './admin-banners.service';
import { AdminBannersController } from './admin-banners.controller';

@Module({
  controllers: [AdminBannersController],
  providers: [AdminBannersService],
  exports: [AdminBannersService],
})
export class AdminBannersModule {}
