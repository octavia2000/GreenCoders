import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/createUserdto";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto,): Promise<any> {
        return await this.userService.createUser(createUserDto);
    }
}