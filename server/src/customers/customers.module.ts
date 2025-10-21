import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { UserEntity } from '../auth/user/entities.ts/entities/user.entity';
import { CustomerProfileEntity } from './entities/customer-profile.entity';
import { CustomersRepository } from './repositories/customers.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, CustomerProfileEntity])],
  controllers: [CustomersController],
  providers: [CustomersService, CustomersRepository],
  exports: [CustomersService],
})
export class CustomersModule {}


