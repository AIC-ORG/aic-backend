import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway()
export class WebsocketGateway {

  constructor(
    private prisma: PrismaService
  ) { }

  @WebSocketServer() server: Server;

  handleConnection(client: any) {
    console.log(`Client ${client.id} connected`);
  }

  handleDisconnect(client: any) {
    console.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('message')
  handleMessage(_: any, payload: { room: string, message: string }) {
    this.server.to(payload.room).emit('new_message', payload.message);
  }

  @SubscribeMessage('initiate_stream')
  async handleInitiateStream(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { room, userId }) {
    socket.join(room)
    await this.prisma.stream.update({
      where:
      {
        roomId: room
      },
      data: {
        attendees: {
          connect: {
            id: userId
          }
        },
        status: "LIVE"
      },

    })

    this.server.to(room).emit('stream_started');

  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { room, peerId }) {
    socket.join(room)
    this.server.to(room).emit('user-connected', peerId);
  }

  @SubscribeMessage('leave_room')
  async handleLeaveRoom(_: any, payload: { room: string, userId: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.userId
      }
    })

    this.server.to(payload.room).emit('new_user_joined', `${user.names} has joined the room`);

  }

}
