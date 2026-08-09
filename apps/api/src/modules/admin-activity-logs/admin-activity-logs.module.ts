import { Module } from '@nestjs/common';
import { AdminActivityLogsService } from './admin-activity-logs.service';
import { AdminActivityLogsController } from './admin-activity-logs.controller';

@Module({
  controllers: [AdminActivityLogsController],
  providers: [AdminActivityLogsService],
  exports: [AdminActivityLogsService],
})
export class AdminActivityLogsModule {}
