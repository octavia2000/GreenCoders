import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { UserEntity } from './entities/user.entity';
import { CustomerProfileEntity } from './entities/customer-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, CustomerProfileEntity])],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}


