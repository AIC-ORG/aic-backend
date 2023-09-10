import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { StoreService } from './store.service';
import { ArtistGuard } from 'src/guards/artist.guard';
import { CreateStoreDTO } from './dto/create-store.dto';
import { AuthRequest } from 'src/types';
import ServerResponse from 'src/utils/ServerResponse';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';

@Controller('store')
@ApiTags("stores")
@ApiBearerAuth()
export class StoreController {

    constructor(
        private readonly storeService: StoreService
    ) { }

    @Post("create")
    @UseGuards(ArtistGuard)
    async createStore(
        @Req() req: AuthRequest,
        @Body() dto: CreateStoreDTO
    ) {
        const store = await this.storeService.createStore(req.user.id, dto);
        return ServerResponse.success("Store created successfully", { store })
    }

    @Put("update-store/:id")
    @UseGuards(ArtistGuard)
    @ApiParam({ name: "id", required: true })
    async updateStore(
        @Param("id") storeId: string,
        @Body() dto: CreateStoreDTO
    ) {
        const store = await this.storeService.updateStore(storeId, dto);
        return ServerResponse.success("Store updated successfully", { store })
    }

    @Get("my-stores")
    @UseGuards(ArtistGuard)
    async getArtistStores(
        @Req() req: AuthRequest
    ) {
        const stores = await this.storeService.getArtistStores(req.user.id);
        return ServerResponse.success("Artist stores fetched successfully", { stores })
    }

    @Get("artist-stores/:id")
    @ApiParam({ name: "id", required: true })
    async getArtistStoresBy(
        @Param("id") id: string
    ) {
        const stores = await this.storeService.getArtistStores(id);
        return ServerResponse.success("Artist stores fetched successfully", { stores })
    }

    @Delete("delete-store/:id")
    @UseGuards(ArtistGuard)
    @ApiParam({ name: "id", required: true })
    async deleteStore(
        @Param("id") storeId: string
    ) {
        await this.storeService.deleteStore(storeId);
        return ServerResponse.success("Store deleted successfully")
    }

    @Post("create-product")
    @UseGuards(ArtistGuard)
    async addProductToStore(
        @Req() req: AuthRequest,
        @Body() dto: CreateProductDTO
    ) {
        const product = await this.storeService.addProductToStore(req.user.id, dto);
        return ServerResponse.success("Product created successfully", { product })
    }

    @Put("update-product/:id")
    @UseGuards(ArtistGuard)
    @ApiParam({ name: "id", required: true })
    async updateProduct(
        @Param("id") id: string,
        @Body() dto: UpdateProductDTO
    ) {
        const product = await this.storeService.updateProduct(id, dto);
        return ServerResponse.success("Product updated successfully", { product })
    }

    @Get("products/:storeId")
    @ApiParam({ name: "storeId", required: true })
    @ApiQuery({ name: "page", required: false, type: Number, example: 0 })
    @ApiQuery({ name: "limit", required: false, type: Number, example: 5 })
    async getStoreProducts(
        @Param("storeId") storeId: string,
        @Query("page") page: number = 0,
        @Query("limit") limit: number = 5,
    ) {
        const products = await this.storeService.getProductsInStore(storeId, page, limit);
        return ServerResponse.success("Store products fetched successfully", { products })
    }

    @Get("products/:artistId")
    @ApiParam({ name: "artistId", required: true })
    @ApiQuery({ name: "page", required: false, type: Number, example: 0 })
    @ApiQuery({ name: "limit", required: false, type: Number, example: 5 })
    async getArtistProducts(
        @Param("artistId") artistId: string,
        @Query("page") page: number = 0,
        @Query("limit") limit: number = 5,
    ) {
        const products = await this.storeService.getProductsByArtist(artistId, page, limit);
        return ServerResponse.success("Artist products fetched successfully", { products })
    }


    @Get("products/:productId")
    @ApiParam({ name: "productId", required: true })
    async getProductById(
        @Param("productId") productId: string
    ) {
        const product = await this.storeService.getProductById(productId);
        return ServerResponse.success("Product fetched successfully", { product })
    }

    @Delete("delete-product/:id")
    @UseGuards(ArtistGuard)
    @ApiParam({ name: "id", required: true })
    async deleteProduct(
        @Param("id") productId: string
    ) {
        await this.storeService.deleteProduct(productId);
        return ServerResponse.success("Product deleted successfully")
    }

}
