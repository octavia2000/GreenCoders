import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { SmsService } from "./sms.service";

@Module({
    imports: [ConfigModule, HttpModule],
    providers: [SmsService],
    exports: [SmsService]
})

export class SmsModule{}
