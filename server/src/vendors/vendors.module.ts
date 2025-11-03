import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorsController } from './vendors.controller';
import { VendorService } from './vendors.service';
import { VendorsRepository } from './repositories/vendors.repository';
import { UserEntity } from '../database/entities/user.entity';
import { VendorProfileEntity } from '../database/entities/vendor-profile.entity';
import { VendorBusinessVerificationEntity } from '../database/entities/vendor-business-verification.entity';
import { AuthModule } from '../auth/auth.module';
import { InputSanitizationService } from '../shared/services/input-sanitization.service';
import { RateLimitGuard } from '../shared/guards/rate-limit.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, VendorProfileEntity, VendorBusinessVerificationEntity]),
    AuthModule,
  ],
  controllers: [VendorsController],
  providers: [
    VendorService,
    VendorsRepository,
    InputSanitizationService,
    RateLimitGuard,
  ],
  exports: [VendorService, VendorsRepository],
})
export class VendorsModule {}
