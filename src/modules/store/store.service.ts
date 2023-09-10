import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStoreDTO } from './dto/create-store.dto';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';

@Injectable()
export class StoreService {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async createStore(artistId: string, dto: CreateStoreDTO) {
        return this.prisma.store.create({
            data: {
                name: dto.name,
                description: dto.description,
                logo: dto.logo,
                artist: {
                    connect: {
                        id: artistId
                    }
                }
            }
        })
    }

    async updateStore(storeId: string, dto: CreateStoreDTO) {
        return this.prisma.store.update({
            where: {
                id: storeId
            },
            data: {
                name: dto.name,
                description: dto.description,
                logo: dto.logo,
            }
        })
    }

    async getAllStores(page: number, limit: number) {
        return this.prisma.store.findMany({
            skip: page * limit,
            take: Number(limit)
        })
    }

    async getArtistStores(artist: string) {
        return this.prisma.store.findMany({
            where: {
                artistId: artist
            }
        })
    }

    async deleteStore(storeId: string) {
        return this.prisma.store.delete({
            where: {
                id: storeId
            }
        })
    }

    async addProductToStore(storeId: string, dto: CreateProductDTO) {
        const product = await this.prisma.product.create({
            data: {
                name: dto.name,
                description: dto.description,
                price: dto.price,
                image: dto.image,
                quantity: dto.quantity,
                store: {
                    connect: {
                        id: storeId
                    }
                }

            },
            include: {
                store: true
            }
        })
        return product;
    }

    async updateProduct(productId: string, dto: UpdateProductDTO) {
        const product = await this.prisma.product.update({
            where: {
                id: productId
            },
            data: {
                name: dto.name,
                description: dto.description,
                price: dto.price,
                image: dto.image,
                quantity: dto.quantity

            },
            include: {
                store: true
            }
        })
        return product;
    }

    async getProductsInStore(storeId: string, page: number, limit: number) {
        return this.prisma.product.findMany({
            where: {
                storeId: storeId
            },
            skip: page * limit,
            take: Number(limit)
        })
    }

    async getProductsByArtist(artistId: string, page: number, limit: number) {
        return this.prisma.product.findMany({
            where: {
                store: {
                    artistId: artistId
                }
            },
            skip: page * limit,
            take: Number(limit)
        })
    }

    async getProductById(productId: string) {
        return this.prisma.product.findUnique({
            where: {
                id: productId
            }
        })
    }

    async deleteProduct(productId: string) {
        return this.prisma.product.delete({
            where: {
                id: productId
            }
        })
    }
}
