import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "src/users/dto/createUserdto";
import { OtpService } from "src/users/verifyNumber/otp.service";
import { UserService } from "src/users/user.service";

@Injectable()
export class signUpService{
    constructor(
        private readonly userService: UserService,
        private readonly otpService: OtpService,) {}
  
    async signup(createUserDto: CreateUserDto) {
    let user = await this.userService.createUser(createUserDto);

    user = await this.otpService.generateOtp(user.phoneNumber);

    await this.userService.sendWelcomeEmail(user);

    const { password, ...apiResponse } = user;
    return { message: 'Signup successful, OTP has been sent to your phone', user:apiResponse };
  }
}