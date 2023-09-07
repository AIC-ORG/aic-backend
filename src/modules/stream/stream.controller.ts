import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StreamService } from './stream.service';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';
import { CreateStreamDTO } from './dto/create-stream.dto';
import { ArtistGuard } from 'src/guards/artist.guard';
import { AuthRequest } from 'src/types';
import ServerResponse from 'src/utils/ServerResponse';

@Controller('stream')
@ApiBearerAuth()
@ApiTags('streams')
@UseGuards(ArtistGuard)
export class StreamController {

    constructor(
        private readonly streamService: StreamService,
        private readonly websocketGateway: WebsocketGateway
    ) { }


    @Post('create')
    async joinRoom(
        @Req() req: AuthRequest,
        @Body() dto: CreateStreamDTO
    ) {
        const stream = await this.streamService.create(req.user.id, dto)
        return ServerResponse.success("Stream created successfully", { stream })
    }

}
