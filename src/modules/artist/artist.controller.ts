import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthRequest } from 'src/types';
import ServerResponse from 'src/utils/ServerResponse';
import { ArtistService } from './artist.service';
import { AddSongDTO } from './dto/add-song.dto';

@Controller('artist')
@ApiTags("artists")
@ApiBearerAuth()
export class ArtistController {

    constructor(
        private readonly artistService: ArtistService
    ) { }

    @Get("all")
    @ApiQuery({ name: "page", required: false, example: 0, type: Number })
    @ApiQuery({ name: "limit", required: false, example: 5, type: Number })
    async getArtists(
        @Query("page") page: number = 0,
        @Query("limit") limit: number = 5,
    ) {

        const artists = await this.artistService.getArtists(page, limit);
        return ServerResponse.success("Artists fetched successfully", { artists });

    }

    @Get("/:id")
    @ApiParam({ name: "id", required: true })
    async getArtistById(
        @Param("id") id: string
    ) {

        const artist = await this.artistService.getArtistById(id);
        return ServerResponse.success("Artist fetched successfully", { artist });

    }

    @Get("/songs/:artistId")
    @ApiParam({ name: "artistId", required: true })
    async getSongsByArtist(
        @Param("artistId") id: string
    ) {

        const songs = await this.artistService.getSongsByArtistId(id);
        return ServerResponse.success("Artist songs fetched successfully", { songs });

    }

    @Post("/song/new")
    async addSong(
        @Req() req: AuthRequest,
        @Body() dto: AddSongDTO
    ) {

        const song = await this.artistService.addSong(req.user.id, dto);
        return ServerResponse.success("Artist song added successfully", { song });

    }

    @Put("/song/update/:id")
    async updateSong(
        @Param("id") id: string,
        @Body() dto: AddSongDTO
    ) {

        const song = await this.artistService.updateSong(id, dto);
        return ServerResponse.success("Artist song updated successfully", { song });

    }

    @Delete("/song/delete/:id")
    async deleteSong(
        @Param("id") id: string,
    ) {

        const song = await this.artistService.deleteSong(id);
        return ServerResponse.success("Artist song deleted successfully", { song });

    }

}
