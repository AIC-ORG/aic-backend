import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class CreateMessageDto{

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    content : string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    senderId : string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    streamId : string
}