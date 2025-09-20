import { Body, Controller, Post } from "@nestjs/common";
import { signUpService } from "./signup.service";
import { CreateUserDto } from "src/users/dto/createUserdto";

@Controller('auth')
export class SignupController{
    constructor(private readonly signupService: signUpService) {}
    @Post('signup')
    async signup(@Body() createUserDto: CreateUserDto) {
        return this.signupService.signup(createUserDto);
    }
}