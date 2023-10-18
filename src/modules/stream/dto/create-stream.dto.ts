import { ApiProperty } from "@nestjs/swagger";
import { IsDate , IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateStreamDTO {

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    title: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    description: string

    @IsOptional()
    @IsString()
    @ApiProperty()
    scheduledAt : Date

}