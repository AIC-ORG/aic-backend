import { Controller, Post, Body, Param } from '@nestjs/common';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Controller('chat')
export class ChatController {
  constructor(private readonly websocketGateway: WebsocketGateway) {}

  @Post('join/:room')
  joinRoom(@Param('room') room: string) {
    this.websocketGateway.handleJoinRoom(this.websocketGateway.server.sockets, room);
  }

  @Post('message/:room')
  sendMessage(@Param('room') room: string, @Body() message: { message: string }) {
    this.websocketGateway.handleMessage(this.websocketGateway.server.sockets, { room, message: message.message });
  }
}
