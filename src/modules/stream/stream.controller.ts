import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ArtistGuard } from 'src/guards/artist.guard';
import { AuthRequest } from 'src/types';
import ServerResponse from 'src/utils/ServerResponse';
import { CreateStreamDTO } from './dto/create-stream.dto';
import { StreamService } from './stream.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('stream')
@ApiBearerAuth()
@ApiTags('streams')
export class StreamController {

    constructor(
        private readonly streamService: StreamService,
    ) { }


    @UseGuards(ArtistGuard)
    @Post('create')
    async joinRoom(
        @Req() req: AuthRequest,
        @Body() dto: CreateStreamDTO
    ) {
        const stream = await this.streamService.create(req.user.id, dto)
        return ServerResponse.success("Stream created successfully", { stream })
    }

    @Get('get-streams')
    @ApiQuery({ name: "page", required: false, example: 0, type: Number })
    @ApiQuery({ name: "limit", required: false, example: 5, type: Number })
    async getLiveStreams(
        @Query("page") page: number = 0,
        @Query("limit") limit: number = 5,

    ) {
        const streams = await this.streamService.getLiveStreams(page, limit)
        return ServerResponse.success("Streams fetched successfully", { streams })
    }

    @Get(':roomId')
    @UseGuards(AuthGuard)
    @ApiParam({ name: "roomId", required: true, example: 648240, type: Number })
    async getStreamByCode(
        @Param("roomId") roomId: number = 0,
    ) {
        const stream = await this.streamService.getStreamByCode(roomId)
        return ServerResponse.success("Stream fetched successfully", { stream })
    }

}
