import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SmsService } from "./sms.service";
import { HttpModule, HttpService, } from "@nestjs/axios";

@Module({
    imports: [ConfigModule,HttpModule],
    providers: [SmsService],
    exports: [SmsService]
})

export class SmsModule{}
