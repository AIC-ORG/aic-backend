import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { connect } from 'http2';

@Injectable()
export class MessageService {
    constructor(
        private readonly prismaServie : PrismaService
    ){}

    async findAll(){
        return await this.prismaServie.message.findMany()
    }

   async findAllByStream (streamId : string){
         return await this.prismaServie.message.findMany({
              where : {
                streamId
              },
              include : {
                sender : true
              }
         })
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
        }
    })
   }

   async createMessage(message : CreateMessageDto){
    const {streamId  , senderId , content} = message
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
