import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { connect } from 'http2';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';

@Injectable()
export class MessageService {

    constructor(
        private readonly prismaServie : PrismaService,
        private readonly websocketGateway : WebsocketGateway
    ){}

    async findAll(){
        return await this.prismaServie.message.findMany()
    }

   async findOneById(senderId : string){
    return await this.prismaServie.message.findUnique({
        where : {
            id : senderId
        }
    })
   }

   async findAllByStreamAndSender(senderId : string , streamId : string){
    return await this.prismaServie.message.findMany({
        where : {
            streamId : streamId,
            senderId : senderId
        },
        include : {
            sender : true,
            stream : true
          }
    })
   }

   async findAllByRoom(roomId : string){
    return await this.prismaServie.message.findMany({
        where : {
            roomId : roomId
        }
    })
   }

   async createMessage(senderId : string ,  message : CreateMessageDto){
    const {streamId  , content} = message
     if(!streamId || !senderId || !content){
        throw new BadRequestException("Please Fill in the required data")
     }
    const stream = this.prismaServie.stream.findUnique({
        where : {
            id : streamId
        }
    })
    if(!stream){
        throw new NotFoundException("The Stream was not found")
    }

    const roomId : string = (await stream).roomId

    const user = this.prismaServie.user.findUnique({
        where : {
            id : senderId
        }
    })

    if(!user) {
        throw new NotFoundException("The User was not Found")
    }

    let messageCreated = this.prismaServie.message.create({
       data : {
        content : content,
        roomId : roomId,
        stream : {
            connect : {
                id : streamId
            }
        },
        sender : {
            connect : {
                id : senderId
            }
        }
              },
              include : {
                stream : true,
                sender : true
              }
    })

     this.websocketGateway.sendMessage({
            roomId : roomId,
            content : content,
            sender : {
                id : (await user).id,
                names : (await user).names,
                email : (await user).email,
                profile : (await user).profile,
                telephone : (await user).telephone
            }
     })

    return messageCreated;
   } 

   async deleteMessage( id : string){
    const message = await this.prismaServie.message.findUnique({
        where : {
            id : id
        }
    })

    if(!message){
        throw new NotFoundException("The Message was not found")
    }

    return this.prismaServie.message.delete({
        where : {
            id : id
        }
    })
   }

   async deleteAllMessagesByStream(streamId : string){
      return this.prismaServie.message.deleteMany({
        where :{
            streamId : streamId
        }
      })
   }

   async deleteAllMessagesByUser(senderId : string){
    return this.prismaServie.message.deleteMany({
        where : {
            senderId : senderId
        }
    })
   }


}
