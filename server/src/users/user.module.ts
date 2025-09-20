import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { EmailService } from "./utils/email.service";
import { OtpService } from "./verifyNumber/otp.service";
import { ContentService } from "./utils/content.service";
import { SmsService } from "./utils/sms.service";
import { HttpModule,} from "@nestjs/axios";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]),HttpModule],
    controllers: [UserController],
    providers: [UserService,EmailService,OtpService,ContentService,SmsService],
    exports: [UserService]
})

export class UserModule {}