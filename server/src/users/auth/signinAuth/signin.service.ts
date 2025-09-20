import {Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LogUserDto } from "src/users/dto/logUserdto";
import { UserService } from "src/users/user.service";

@Injectable()
export class SigninService{
    constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,){}
    

    async login(logUserDto: LogUserDto, res): Promise<any> {
        const user = await this.userService.logUser(logUserDto); 

        const AuthToken = this.jwtService.sign({ sub: user.id, email: user.email }); // generate the token

        res.cookie('Auth', AuthToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7 //7days
        });

        return user;
    }

    async logout(res): Promise<void> {
        res.clearCookie('Auth');
    }
}