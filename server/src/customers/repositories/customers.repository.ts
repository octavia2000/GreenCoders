import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { QueryUsersDto } from '../dto/query-users.dto';
import { USER_BASIC_FIELDS } from '../constants/user-select-fields';
import {
  CustomerListResponse,
  CustomersListResponse,
} from '../types/customer-response.types';
import { mapToCustomerList } from '../mappers/customer.mappers';
import { Role } from '../../auth/types/auth-response.types';
import * as SYS_MSG from '../../helpers/SystemMessages';

@Injectable()
export class CustomersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /* 
  =======================================
  Find All Customers
  ========================================
  */
  async findAllCustomers(
    queryDto: QueryUsersDto,
  ): Promise<CustomersListResponse> {
    try {
      const { page = 1, limit = 10, isActive, search } = queryDto;
      const skip = (page - 1) * limit;

      const queryBuilder = this.userRepository
        .createQueryBuilder('user')
        .select([
          'user.id',
          'user.email',
          'user.username',
          'user.profileImageUrl',
          'user.isActive',
        ])
        .where('user.role = :role', { role: Role.CUSTOMER });

      if (isActive !== undefined) {
        queryBuilder.andWhere('user.isActive = :isActive', { isActive });
      }

      if (search) {
        queryBuilder.andWhere(
          '(user.username ILIKE :search OR user.email ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      queryBuilder.skip(skip).take(limit);

      const [rows, total] = await queryBuilder.getManyAndCount();

      const customers: CustomerListResponse[] = rows.map((row: any) =>
        mapToCustomerList(row),
      );

      return { customers, total, page, limit };
    } catch (error) {
      throw new Error(SYS_MSG.OPERATION_FAILED);
    }
  }

  /* 
  =======================================
  Find Customer By Id
  ========================================
  */
  async findCustomerById(id: string): Promise<UserEntity | null> {
    try {
      const customer = await this.userRepository
        .createQueryBuilder('user')
        .select([
          ...USER_BASIC_FIELDS,
          'user.phoneNumber',
          'user.authMethod',
          'user.firstName',
          'user.lastName',
          'user.profileImageUrl',
        ])
        .where('user.id = :id', { id })
        .andWhere('user.role = :role', { role: Role.CUSTOMER })
        .getOne();

      return customer ?? null;
    } catch (error) {
      throw new Error(SYS_MSG.USER_NOT_FOUND);
    }
  }

  /* 
  =======================================
  Find Customer Profile By User Id
  ========================================
  */
  async findCustomerProfileByUserId(
    userId: string,
  ): Promise<UserEntity | null> {
    try {
      const customer = await this.userRepository.findOne({
        where: { id: userId, role: Role.CUSTOMER },
        select: [
          'id',
          'email',
          'username',
          'firstName',
          'lastName',
          'profileImageUrl',
          'phoneNumber',
          'authMethod',
          'isActive',
          'isNumberVerified',
          'createdAt',
          'lastLoginAt',
        ],
      });
      return customer ?? null;
    } catch (error) {
      throw new Error(SYS_MSG.PROFILE_NOT_FOUND);
    }
  }

  /* 
  =======================================
  Find By Username
  ========================================
  */
  async findByUsername(username: string): Promise<UserEntity | null> {
    try {
      return (
        (await this.userRepository.findOne({ where: { username } })) ?? null
      );
    } catch (error) {
      throw new Error(SYS_MSG.USER_NOT_FOUND_BY_USERNAME);
    }
  }

  /* 
  =======================================
  Update Username
  ========================================
  */
  async updateUsername(userId: string, username: string): Promise<void> {
    try {
      await this.userRepository.update(userId, { username });
    } catch (error) {
      throw new Error(SYS_MSG.OPERATION_FAILED);
    }
  }

  /* 
  =======================================
  Find User With Password By Id
  ========================================
  */
  async findUserWithPasswordById(userId: string): Promise<UserEntity | null> {
    try {
      return (
        (await this.userRepository
          .createQueryBuilder('user')
          .addSelect('user.password')
          .where('user.id = :id', { id: userId })
          .getOne()) ?? null
      );
    } catch (error) {
      throw new Error(SYS_MSG.USER_PASSWORD_FETCH_ERROR);
    }
  }

  /* 
  =======================================
  Update User Password
  ========================================
  */
  async updateUserPassword(
    userId: string,
    hashedPassword: string,
  ): Promise<void> {
    try {
      await this.userRepository.update(userId, { password: hashedPassword });
    } catch (error) {
      throw new Error(SYS_MSG.USER_PASSWORD_UPDATE_ERROR);
    }
  }
}
