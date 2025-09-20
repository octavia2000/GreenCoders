import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../user.entity";
import { PasswordController } from "./password.controller";
import { PasswordService } from "./password.service";
import { EmailModule } from "../utils/emailmodule";
import { ContentService } from "../utils/content.service";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]),EmailModule],
    controllers: [PasswordController],
    providers: [PasswordService,ContentService],
})

export class PasswordModule {}