import { Injectable } from '@nestjs/common';
import { CreateStreamDTO } from './dto/create-stream.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StreamService {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async create(artistId: string, dto: CreateStreamDTO) {

    let roomId : string;
    let isStreamPresent = true;
    while(isStreamPresent){
        roomId = Math.floor(100000 + Math.random() * 900000).toString();
        const streampresent = await this.prisma.stream.findUnique({
            where :{
                roomId : roomId
            }
        })

        if(streampresent){
             continue;
        }else{
            isStreamPresent = false;
        }
    }

        const stream = await this.prisma.stream.create({
            data: {
                roomId: Math.floor(100000 + Math.random() * 900000).toString(),
                title: dto.title,
                description:dto.description,
                createdBy: {
                    connect: {
                        id: artistId
                    }
                },
                attendees: {
                    connect: {
                        id: artistId
                    }
                }
            },
            include: {
                createdBy: true,
                attendees: true
            }
        })

        return stream;

    }

    async getLiveStreams(page: number, limit: number) {
        return this.prisma.stream.findMany({
            skip: page * limit,
            take: Number(limit),
            include: {
                createdBy: true,
                attendees: true
            }
        })
    }

    async getStreamByCode(streamId: number) {
        console.log(streamId)
        return this.prisma.stream.findUnique({
            where: {
                roomId: streamId.toString()
            },
            include: {
                createdBy: true,
                attendees: true
            }
        })
    }

    async getStreamByRoomId(roomId: string) {
        return this.prisma.stream.findUnique({
            where: {
                roomId: roomId
            },
            include: {
                createdBy: true,
                attendees: true
            }
        })
    }

}
