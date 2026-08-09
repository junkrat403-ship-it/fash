import { Module } from '@nestjs/common';
import { AdminMessagesService } from './admin-messages.service';
import { AdminMessagesController } from './admin-messages.controller';

@Module({
  controllers: [AdminMessagesController],
  providers: [AdminMessagesService],
  exports: [AdminMessagesService],
})
export class AdminMessagesModule {}
