import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';

@Module({
  providers: [MessageService],
  controllers: [MessageController],
  imports : [WebsocketGateway]
})
export class MessageModule {}
