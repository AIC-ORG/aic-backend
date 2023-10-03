import { Global, Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Global()
@Module({
  providers: [MessageService],
  controllers: [MessageController],
  exports: [MessageService]
})
export class MessageModule { }
