import { Injectable } from '@nestjs/common';
import { CreateStreamDTO } from './dto/create-stream.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StreamService {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async create(artistId: string, dto: CreateStreamDTO) {

        const stream = await this.prisma.stream.create({
            data: {
                roomId: Math.floor(100000 + Math.random() * 900000).toString(),
                title: dto.title,
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
    
}
