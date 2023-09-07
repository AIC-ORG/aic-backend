import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateContactDTO {

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(80)
    @ApiProperty()
    readonly names: string;

    @IsEmail()
    @ApiProperty()
    readonly email: string;


    @IsNotEmpty()
    @Matches(/^\+250\d{9}$/, {
        message: 'Mobile number must start with "+250" and have 9 digits after that.',
    })
    @ApiProperty()
    readonly telephone: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(400)
    readonly message: string;

}