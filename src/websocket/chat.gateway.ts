import { MessageBody , SubscribeMessage , WebSocketGateway , WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';


@WebSocketGateway()
export class ChatGateway {

    @WebSocketServer()
    server : Server

    @SubscribeMessage('send_message')
    listenForMessage(@MessageBody() message : string){
        this.server.sockets.emit('receive_message' , message);
    }
}