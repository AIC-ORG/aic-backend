import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from 'src/message/message.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { StreamService } from 'src/modules/stream/stream.service';
import { CreateStreamDTO } from 'src/modules/stream/dto/create-stream.dto';
import { AuthRequest } from 'src/types';

@WebSocketGateway(5002)
export class WebsocketGateway {

  constructor(
    private prisma: PrismaService,
    private messageService: MessageService,
    private readonly streamService: StreamService

  ) { }

  @WebSocketServer() server: Server;

  handleConnection(client: any) {
    console.log(`Client ${client.id} connected`);
  }

  handleDisconnect(client: any) {
    console.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { room, message, sender }) {
    console.log(room, message, sender)
    if (!room || !message || !sender.id ||  sender==undefined) return
    socket.join(room)
    const messageCreated = await this.messageService.createMessage({ content: message, senderId: sender.id, roomId: room })
    this.server.to(room).emit('new_message', messageCreated);
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

@SubscribeMessage('create_stream')
  async handleCreateStream(client : Socket , dto : CreateStreamDTO , req :  AuthRequest){
     const artistId  = req.user.id;
    try {
      const stream = await this.streamService.create(artistId , dto);
      client.emit('stream_created' , stream);
    } catch (error) {
      // throw new BadRequestException(error.message);
      console.log(error.message)
    }  
  }

  @SubscribeMessage('join_stream')
  async handleJoinStream(client : Socket , roomId : string){
     try {
      const stream = await this.streamService.getStreamByRoomId(roomId);
      if(stream){
        client.join(roomId);
        client.emit('stream_joined' , stream);
      }else{
        client.emit('stream_not_found' , 'Stream not found');
      }
     } catch (error) {
      // handle the errors accodingly 
     }
  }

  async handleIceCandidate(client : Socket , payload : any){
    const {target , candidate} = payload;
    const rooms = client.rooms;
    if(rooms && rooms.size > 0){
      client.to([... rooms][0]).emit('ice-candidate' , {source : client.id , candidate});
    }
  }

}
