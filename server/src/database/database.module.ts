import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from './entities/user.entity';
import { VendorEntity } from './entities/vendor.entity';
import { VendorProfileEntity } from './entities/vendor-profile.entity';
import { VendorBusinessVerificationEntity } from './entities/vendor-business-verification.entity';
import { AdminInvitationEntity } from './entities/admin-invitation.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [UserEntity, VendorEntity, VendorProfileEntity, VendorBusinessVerificationEntity, AdminInvitationEntity],
        synchronize: configService.get('database.synchronize'),
        ssl: configService.get('database.ssl'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserEntity, VendorEntity, VendorProfileEntity, VendorBusinessVerificationEntity, AdminInvitationEntity]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
