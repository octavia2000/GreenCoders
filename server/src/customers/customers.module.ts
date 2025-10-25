import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { UserEntity } from '../database/entities/user.entity';
import { CustomersRepository } from './repositories/customers.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [CustomersController],
  providers: [CustomersService, CustomersRepository],
  exports: [CustomersService],
})
export class CustomersModule {}
