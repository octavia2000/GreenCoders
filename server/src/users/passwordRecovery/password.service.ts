import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user.entity";
import { Repository } from "typeorm";
import { randomBytes } from 'crypto';
import { EmailService } from "../utils/email.service";
import { PasswordResetDto } from "../dto/resetPassword.dto";
import * as bcrypt from "bcrypt"
import { ForgetPasswordDto } from "../dto/forgetPassword.dto";

@Injectable()
export class PasswordService{
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly emailService: EmailService,) {}

    async requestPasswordReset(forgetPasswordDto: ForgetPasswordDto): Promise<void> {
        const user = await this.userRepository.findOne({ where: {email:forgetPasswordDto.email} });
        if (!user) throw new NotFoundException('User does not exist');

        const randomPassword = randomBytes(8).toString('hex')
        user.resetPassword = randomPassword
        user.rPExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await this.userRepository.save(user);

        await this.emailService.sendRandomPassword(user.email, randomPassword);
    }

    async passwordReset(passwordResetDto: PasswordResetDto): Promise<void> {
        const user = await this.userRepository.findOne({ where: { email:passwordResetDto.email } });
        if (!user) throw new NotFoundException('User not found');

        if (user.resetPassword !== passwordResetDto.randomPassword 
            || !user.rPExpiresAt || new Date() > user.rPExpiresAt) {
        throw new BadRequestException('Invalid or expired Password');
        }

        user.password = passwordResetDto.newPassword;

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(passwordResetDto.newPassword, salt);

        user.resetPassword = null;
        user.rPExpiresAt = null;

        await this.userRepository.save(user);
    }
}



