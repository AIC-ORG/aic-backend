import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDTO } from './dto/create-message.dto';
import { connect } from 'http2';
import { WebsocketGateway } from 'src/websocket/websocket.gateway';

@Injectable()
export class MessageService {

    constructor(
        private readonly prismaServie: PrismaService
    ) { }

    async findAll() {
        return await this.prismaServie.message.findMany()
    }

    async findOneById(senderId: string) {
        return await this.prismaServie.message.findUnique({
            where: {
                id: senderId
            }
        })
    }

    async findAllByStreamAndSender(senderId: string, streamId: string) {
        return await this.prismaServie.message.findMany({
            where: {
                streamId: streamId,
                senderId: senderId
            },
            include: {
                sender: true,
                stream: true
            }
        })
    }

    async findAllByRoom(roomId: string) {
        return await this.prismaServie.message.findMany({
            where: {
                roomId: roomId
            }
        })
    }

    async createMessage(dto: CreateMessageDTO) {
        const message = await this.prismaServie.message.create({
            data: {
                content: dto.content,
                roomId: dto.roomId,
                stream: {
                    connect: {
                        roomId: dto.roomId
                    }
                },
                sender: {
                    connect: {
                        id: dto.senderId
                    }
                }
            },
            include: {
                stream: true,
                sender: true
            }
        })
        return message;
    }

    async deleteMessage(id: string) {
        const message = await this.prismaServie.message.findUnique({
            where: {
                id: id
            }
        })

        if (!message) {
            throw new NotFoundException("The Message was not found")
        }

        return this.prismaServie.message.delete({
            where: {
                id: id
            }
        })
    }

    async deleteAllMessagesByStream(streamId: string) {
        return this.prismaServie.message.deleteMany({
            where: {
                streamId: streamId
            }
        })
    }

    async deleteAllMessagesByUser(senderId: string) {
        return this.prismaServie.message.deleteMany({
            where: {
                senderId: senderId
            }
        })
    }


}
