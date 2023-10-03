import { Controller, Get, NotFoundException, Param, Post, Query , Body, Delete } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('message')
@ApiTags('message')
export class MessageController {
    constructor(
        private readonly messageService : MessageService
    ){}

    @Get('/all')
    async getAllMessages(){
        return this.messageService.findAll();
    }

    @Get('/stream/:streamId')
    async getAllByStream( @Param('streamId') streamId : string){
      return this.messageService.findAllByStream(streamId)
    }


    @Get('/id/:id')
    async getOneById(@Param('id') id: string){
        const message = await this.messageService.findOneById(id);
        if(!message){
            throw new NotFoundException("The Message was not found")
        }
        return message;
    }

    
    @Get('/stream/sender')
    async getAllByStreamAndSender(@Query('streamId') streamId : string , @Query('senderId') senderId : string){
        return this.messageService.findAllByStreamAndSender(senderId , streamId);
    }

    @Post('/create')
    @ApiBody({type : CreateMessageDto})
    async createMessage(@Body() message : CreateMessageDto){
        return this.messageService.createMessage(message);
    }

    @Delete('/delete/id/:id')
    async deleteMessage(@Param('id') id : string){
        return this.messageService.deleteMessage(id)
    }

    @Delete('/delete/stream/:streamId')
    async deleteAllMessagesByStream(@Param('streamId') streamId : string){
       return this.messageService.deleteAllMessagesByStream(streamId);
    }

    @Delete('/delete/sender/:senderId')
    async deleteAllMessagesByUser(@Param('senderId') senderId : string){
        return this.messageService.deleteAllMessagesByUser(senderId);
    }
}
