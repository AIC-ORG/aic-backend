import { Controller, Get, Req ,  NotFoundException, Param, Post, Query , Body, Delete, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthRequest } from 'src/types';

@Controller('message')
@ApiBearerAuth()
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
    @Get('/room/:roomId')
    async getAllByRoom( @Param('roomId') roomId : string){
      return this.messageService.findAllByRoom(roomId)
    }

    @UseGuards(AuthGuard)
    @Get('/stream/:streamId/sender/:senderId')
    async getAllByStreamAndSender(@Param('streamId') streamId : string , @Param('senderId') senderId : string){
        console.log("The Stream is this one" + streamId);
        console.log("The Sender is this one" + senderId)
        return this.messageService.findAllByStreamAndSender(senderId , streamId);
    }

    @UseGuards(AuthGuard)
    @Post('/create')
    @ApiBody({type : CreateMessageDto})
    async createMessage(
        @Req() req : AuthRequest,
        @Body() message : CreateMessageDto){
        return this.messageService.createMessage(req.user.id ,  message);
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
