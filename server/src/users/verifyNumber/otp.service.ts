import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user.entity";
import { Repository } from "typeorm";
import { SmsService } from "../utils/sms.service";

@Injectable()
export class OtpService{
    constructor(
            @InjectRepository(UserEntity)
            private readonly userRepository: Repository<UserEntity>,

            private readonly smsService: SmsService,) {}
    async generateOtp(phoneNumber: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ where: { phoneNumber } });
        if (!user) throw new NotFoundException('User does not exist');
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); //5min
    
        user.phoneOtp = otp;
        user.otpExpiresAt = expiresAt;
        
        await this.userRepository.save(user);
        this.smsService.sendOtp(user.phoneNumber, otp);
        return user;
    }
    
    async verifyOtp(phoneNumber: string, otp: string): Promise<{ message: string}> {
        const user = await this.userRepository.findOne({ where: { phoneNumber},});
        if (!user) throw new NotFoundException('User does not exist');
    
        if (user.phoneOtp !== otp || new Date() > user.otpExpiresAt) {
          throw new BadRequestException('Invalid or expired OTP');
        }
    
        user.isNumberVerified = true;
        user.phoneOtp = null;
        user.otpExpiresAt = null;
        await this.userRepository.save(user);
        return { message: 'Number verified successfully' };
    }


    async resendOtp(phoneNumber: string): Promise<void> {
        await this.generateOtp(phoneNumber);
    }
}