import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddSongDTO } from './dto/add-song.dto';
import { connect } from 'http2';

@Injectable()
export class ArtistService {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async getArtists(page: number, limit: number) {
        return this.prisma.user.findMany({
            where: {
                role: "ARTIST"
            },
            skip: page * limit,
            take: Number(limit)
        })
    }

    async getArtistById(id: string) {
        return this.prisma.user.findUnique({
            where: {
                id
            }
        })
    }

    async getSongsByArtistId(id: string) {
        return this.prisma.song.findMany({
            where: {
                artistId: id
            },
        })
    }

    async addSong(artist: string, dto: AddSongDTO) {
        return this.prisma.song.create({
            data: {
                title: dto.title,
                description: dto.description,
                url: dto.url,
                artist: {
                    connect: {
                        id: artist
                    }
                }
            }
        })
    }

    async updateSong(id: string, dto: AddSongDTO) {
        return this.prisma.song.update({
            where: {
                id
            },
            data: {
                title: dto.title,
                description: dto.description,
                url: dto.url
            }
        })
    }

    async deleteSong(id: string) {
        return this.prisma.song.delete({
            where: {
                id
            }
        })
    }

}
