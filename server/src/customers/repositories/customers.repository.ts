import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../auth/user/entities/user.entity';
import { CustomerProfileEntity } from '../entities/customer-profile.entity';
import { QueryUsersDto } from '../dto/query-users.dto';
import { USER_BASIC_FIELDS } from '../constants/user-select-fields';
import { CustomerListResponse } from '../types/customer-response.types';
import { mapToCustomerList } from '../mappers/customer.mappers';

@Injectable()
export class CustomersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CustomerProfileEntity)
    private readonly customerProfileRepository: Repository<CustomerProfileEntity>,
  ) {}

   /* 
  =======================================
  Find All Customers
  ========================================
  */
  async findAllCustomers(queryDto: QueryUsersDto): Promise<{ customers: CustomerListResponse[]; total: number; page: number; limit: number; }> {
    const { page = 1, limit = 10, isActive, search } = queryDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.customerProfile', 'customerProfile')
      .select([
        'user.id',
        'user.email',
        'user.isActive',
        'customerProfile.profileImageUrl',
      ])
      .where('user.role = :role', { role: 'CUSTOMER' });

    if (isActive !== undefined) {
      queryBuilder.andWhere('user.isActive = :isActive', { isActive });
    }

    if (search) {
      queryBuilder.andWhere(
        '(user.username ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    queryBuilder.skip(skip).take(limit);

    const [rows, total] = await queryBuilder.getManyAndCount();

    const customers: CustomerListResponse[] = rows.map((row: any) => mapToCustomerList(row));

    return { customers, total, page, limit };
  }

  /* 
  =======================================
  Find Customer By Id
  ========================================
  */
  async findCustomerById(id: string): Promise<UserEntity | null> {
    const customer = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.customerProfile', 'customerProfile')
      .select([
        ...USER_BASIC_FIELDS,
        'user.phoneNumber',
        'user.authMethod',
        'customerProfile.firstName',
        'customerProfile.lastName',
        'customerProfile.profileImageUrl',
      ])
      .where('user.id = :id', { id })
      .andWhere('user.role = :role', { role: 'CUSTOMER' })
      .getOne();

    return customer ?? null;
  }

  /* 
  =======================================
  Find Customer Profile By User Id
  ========================================
  */
  async findCustomerProfileByUserId(userId: string): Promise<UserEntity | null> {
    const customer = await this.userRepository.findOne({
      where: { id: userId, role: 'CUSTOMER' },
      relations: ['customerProfile'],
      select: ['id', 'email', 'username', 'phoneNumber', 'authMethod', 'isActive', 'isNumberVerified', 'createdAt', 'lastLoginAt'],
    });
    return customer ?? null;
  }

  /* 
  =======================================
  Find By Username
  ========================================
  */
  async findByUsername(username: string): Promise<UserEntity | null> {
    return (await this.userRepository.findOne({ where: { username } })) ?? null;
  }

  /* 
  =======================================
  Update Username
  ========================================
  */
  async updateUsername(userId: string, username: string): Promise<void> {
    await this.userRepository.update(userId, { username });
  }

  /* 
  =======================================
  Upsert Customer Profile
  ========================================
  */
  async upsertCustomerProfile(user: UserEntity, profileData: Partial<CustomerProfileEntity>): Promise<void> {
    const existing = await this.customerProfileRepository.findOne({ where: { user: { id: user.id } } });
    if (existing) {
      await this.customerProfileRepository.update(existing.id, profileData);
    } else {
      const newProfile = this.customerProfileRepository.create({ user, ...profileData });
      await this.customerProfileRepository.save(newProfile);
    }
  }

  /* 
  =======================================
  Find User With Password By Id
  ========================================
  */
  async findUserWithPasswordById(userId: string): Promise<UserEntity | null> {
    return (
      await this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.id = :id', { id: userId })
        .getOne()
    ) ?? null;
  }


  /* 
  =======================================
  Update User Password
  ========================================
  */
  async updateUserPassword(userId: string, hashedPassword: string): Promise<void> {
    await this.userRepository.update(userId, { password: hashedPassword });
  }
}


