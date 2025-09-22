import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OtpService } from "./otp.service";
import { UserEntity } from "../user.entity";
import { OtpController } from "./otp.controller";
import { SmsModule } from "../utils/sms.module";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]),SmsModule],
    controllers: [OtpController],
    providers: [OtpService],
    exports: [OtpService]
})

export class OtpModule {}
