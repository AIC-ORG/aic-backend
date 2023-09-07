import { Module } from '@nestjs/common';
import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';
import { WebSocketGateway } from '@nestjs/websockets';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';

@Module({
  controllers: [StreamController],
  providers: [StreamService, WebsocketGateway]
})
export class StreamModule { }
