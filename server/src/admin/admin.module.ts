import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserEntity } from '../database/entities/user.entity';
import { AdminEntity } from '../database/entities/admin.entity';
import { VendorEntity } from '../database/entities/vendor.entity';
import { VendorBusinessVerificationEntity } from '../database/entities/vendor-business-verification.entity';
import { AdminInvitationEntity } from '../database/entities/admin-invitation.entity';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../shared/notifications/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      AdminEntity,
      VendorEntity,
      VendorBusinessVerificationEntity,
      AdminInvitationEntity
    ]),
    AuthModule,
    EmailModule
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
