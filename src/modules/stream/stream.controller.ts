import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ArtistGuard } from 'src/guards/artist.guard';
import { AuthRequest } from 'src/types';
import ServerResponse from 'src/utils/ServerResponse';
import { CreateStreamDTO } from './dto/create-stream.dto';
import { StreamService } from './stream.service';

@Controller('stream')
@ApiBearerAuth()
@ApiTags('streams')
@UseGuards(ArtistGuard)
export class StreamController {

    constructor(
        private readonly streamService: StreamService,
    ) { }


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

}
