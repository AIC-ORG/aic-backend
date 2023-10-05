import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from 'src/message/message.service';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway(5002)
export class WebsocketGateway {

  constructor(
    private prisma: PrismaService,
    private messageService: MessageService

  ) { }

  @WebSocketServer() server: Server;

  handleConnection(client: any) {
    console.log(`Client ${client.id} connected`);
  }

  handleDisconnect(client: any) {
    console.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { room, message, sender }) {
    console.log(room, message, sender)
    if (!room || !message || !sender.id) return
    socket.join(room)
    this.messageService.createMessage({ content: message, senderId: sender.id, roomId: room })
    this.server.to(room).emit('new_message', { content: message, sender, room });
  }


  @SubscribeMessage('join_chat_room')
  async handleJoinChatRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { roomId, userId }) {
    socket.join(roomId)
    console.log(roomId, userId)
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    this.server.to(roomId).emit('user_joined_chat', user.names);
  }

  @SubscribeMessage('leave_room')
  async handleLeaveRoom(
    @ConnectedSocket() socket: Socket, payload: { room: string, userId: string }) {
    socket.leave(payload.room)
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.userId
      }
    })

    this.server.to(payload.room).emit('new_user_joined', `${user.names} has left the room`);
  }

  // Simple peer and stream handling.

  @SubscribeMessage('call-user')
  public callUser(client: Socket, data: any) {
    client.to(data.to).emit('call-made', {
      offer: data.offer,
      socket: client.id,
    });
  }

  @SubscribeMessage('make-answer')
  public makeAnswer(client: Socket, data: any) {
    client.to(data.to).emit('answer-made', {
      socket: client.id,
      answer: data.answer,
    });
  }

  @SubscribeMessage('join_room')
  public joinStreamRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { roomId, userId, peerId }
  ) {
    socket.join(roomId)
    this.server.to(roomId).emit("", { userId: userId, peerId: peerId })
  }

}
