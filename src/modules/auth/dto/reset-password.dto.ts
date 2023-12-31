import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length, Matches, MaxLength, MinLength } from "class-validator";

export class ResetPasswordDTO {

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(16)
    @ApiProperty()
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/, {
        message: 'Password must have at least 6 characters, one symbol, one number, and one uppercase letter.',
    })
    readonly password: string;

    @IsString()
    @Length(6, 6)
    @ApiProperty()
    code: string;

}