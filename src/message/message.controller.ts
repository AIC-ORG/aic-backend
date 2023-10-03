import { Controller, Delete, Get, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { MessageService } from './message.service';

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
