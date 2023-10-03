import { Controller, Get, NotFoundException, Param, Post, Query , Body, Delete, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('message')
@ApiTags('message')
export class MessageController {
    constructor(
        private readonly messageService : MessageService
    ){}

    @UseGuards(AuthGuard)
    @Get('/all')
    async getAllMessages(){
        return this.messageService.findAll();
    }

    @UseGuards(AuthGuard)
    @Get('/stream/:streamId')
    async getAllByStream( @Param('streamId') streamId : string){
      return this.messageService.findAllByStream(streamId)
    }


    @UseGuards(AuthGuard)
    @Get('/id/:id')
    async getOneById(@Param('id') id: string){
        const message = await this.messageService.findOneById(id);
        if(!message){
            throw new NotFoundException("The Message was not found")
        }
        return message;
    }

    @UseGuards(AuthGuard)
    @Get('/stream/sender')
    async getAllByStreamAndSender(@Query('streamId') streamId : string , @Query('senderId') senderId : string){
        return this.messageService.findAllByStreamAndSender(senderId , streamId);
    }

    @UseGuards(AuthGuard)
    @Post('/create')
    @ApiBody({type : CreateMessageDto})
    async createMessage(@Body() message : CreateMessageDto){
        return this.messageService.createMessage(message);
    }

    @UseGuards(AuthGuard)
    @Delete('/delete/id/:id')
    async deleteMessage(@Param('id') id : string){
        return this.messageService.deleteMessage(id)
    }

    @UseGuards(AuthGuard)
    @Delete('/delete/stream/:streamId')
    async deleteAllMessagesByStream(@Param('streamId') streamId : string){
       return this.messageService.deleteAllMessagesByStream(streamId);
    }

    
    @UseGuards(AuthGuard)
    @Delete('/delete/sender/:senderId')
    async deleteAllMessagesByUser(@Param('senderId') senderId : string){
        return this.messageService.deleteAllMessagesByUser(senderId);
    }
}
