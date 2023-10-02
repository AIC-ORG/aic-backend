import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessageService {
    constructor(
        private readonly prismaServie : PrismaService
    ){}

   async findAll (streamId : string){
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
