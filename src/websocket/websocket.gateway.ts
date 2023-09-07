import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class WebsocketGateway {
  @WebSocketServer() server: Server;

  handleConnection(client: any) {
    console.log(`Client ${client.id} connected`);
  }

  handleDisconnect(client: any) {
    console.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: { room: string, message: string }) {
    // Broadcast the message to all clients in the specified room
    this.server.to(payload.room).emit('message', payload.message);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: any, room: string) {
    // Join a specific room
    client.join(room);
  }
}
