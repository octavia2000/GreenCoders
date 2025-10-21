import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorsController } from './vendors.controller';
import { VendorService } from './vendors.service';
import { UserEntity } from '../auth/user/entities.ts/entities/user.entity';
import { VendorProfileEntity } from './entities/vendor-profile.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, VendorProfileEntity]),
    AuthModule,
  ],
  controllers: [VendorsController],
  providers: [VendorService],
  exports: [VendorService],
})
export class VendorsModule {}
