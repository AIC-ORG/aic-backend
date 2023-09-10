import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, IsUrl, MaxLength, Min, MinLength } from "class-validator"

export class AddSongDTO {

    @ApiProperty({ required: true, example: "Tonight by The Beatles" })
    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    title: string

    @IsUrl()
    @IsNotEmpty()
    @ApiProperty({ required: true, example: "https://www.youtube.com/watch?v=Qa2pIzK6mPU" })
    url: string

    @ApiProperty({ required: true, example: "A song by The Beatles" })
    @IsNotEmpty()
    @IsString()
    description: string
}