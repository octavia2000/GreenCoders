import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { LogUserDto } from 'src/users/dto/logUserdto';
import { SigninService } from './signin.service';

@Controller('auth')
export class signinController {
  constructor(private readonly signinService: SigninService) {}
  
  @Post('login')
  async login(@Body() logUserDto: LogUserDto, @Res({ passthrough: true }) res: Response) {
    return this.signinService.login(logUserDto, res);
  }
  
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    await this.signinService.logout(res);
    return { message: 'Logged out successfully' };
  }
}
