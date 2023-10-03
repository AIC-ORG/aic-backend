import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway(5002)
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
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { room, message, sender }) {
    console.log(room, message)
    socket.join(room)
    this.server.to(room).emit('new_message', { content: message, sender });
  }

  sendMessage(MessageData : {roomId : string , content : string , sender: {
    id : string,
    names : string
    email : string,
    profile : string ,
    telephone : string
  }}){
    console.log("The Socket has been called");
    this.server.to(MessageData.roomId).emit('new_message', { content: MessageData.content, sender : MessageData.sender });
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


}
