import { Body, Controller, Post } from "@nestjs/common";
import { PasswordService } from "./password.service";
import { PasswordResetDto } from "../dto/resetPassword.dto";
import { ForgetPasswordDto } from "../dto/forgetPassword.dto";

@Controller('auth')
export class PasswordController{
    constructor(private readonly passwordService: PasswordService){}

    @Post('forget-password')
    async forgotPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
        await this.passwordService.requestPasswordReset(forgetPasswordDto);
        return {message: "Check your email for new Password"};
    }

    @Post('reset-password')
    async resetPassword(@Body() passwordResetDto: PasswordResetDto) {
        await this.passwordService.passwordReset(passwordResetDto);
        return {message: "Password changed successfully"};
    }

}