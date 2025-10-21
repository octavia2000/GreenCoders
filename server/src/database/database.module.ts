import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminSeedingService } from './admin-seeding.service';
import { SeedingCommand } from './seeding.command';
import { UserEntity } from '../auth/user/entities.ts/entities/user.entity';
import { AdminProfileEntity } from '../admin/entities/admin-profile.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserEntity, AdminProfileEntity]),
  ],
  providers: [AdminSeedingService, SeedingCommand],
  exports: [TypeOrmModule, AdminSeedingService, SeedingCommand],
})
export class DatabaseModule {}



