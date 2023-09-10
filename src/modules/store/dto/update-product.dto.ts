import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString, IsUrl, Min } from "class-validator"


export class UpdateProductDTO {
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

}