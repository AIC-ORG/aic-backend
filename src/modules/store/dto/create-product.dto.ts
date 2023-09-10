import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString, IsUUID, IsUrl, Min } from "class-validator"

export class CreateProductDTO {

    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    name: string

    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    description: string

    @IsNumber()
    @ApiProperty()
    @IsNotEmpty()
    price: number

    @IsUrl()
    @ApiProperty()
    @IsNotEmpty()
    image: string

    @IsNumber()
    @ApiProperty()
    @IsNotEmpty()
    @Min(1)
    quantity: number

    @IsUUID()
    @ApiProperty()
    @IsNotEmpty()
    storeId: string
}