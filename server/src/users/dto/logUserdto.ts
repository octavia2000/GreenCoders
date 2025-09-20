import { IsEmail, IsString } from "class-validator";

export class LogUserDto{
    @IsEmail()
    email: string;

    @IsString()
    password: string
}