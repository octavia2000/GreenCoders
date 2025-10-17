import { Injectable, NotFoundException, HttpStatus, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import { CustomerProfileEntity } from './entities/customer-profile.entity';
import { 
  BaseResponse, 
  UserBasicResponse, 
  ProfileSettingsResponse, 
  PaginatedUsersResponse 
} from './types/user-response.types';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpdateProfileDto, ChangePasswordDto } from './dto/update-profile.dto';
import { USER_BASIC_FIELDS } from './constants/user-select-fields';
import * as SYS_MSG from '../helpers/SystemMessages';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CustomerProfileEntity)
    private readonly customerProfileRepository: Repository<CustomerProfileEntity>,
  ) {}

  /* 
  =======================================
  Get All Customers
  ========================================
  */
  async getAllCustomers(queryDto: QueryUsersDto): Promise<BaseResponse<PaginatedUsersResponse>> {
    const { page = 1, limit = 10, isActive, search } = queryDto;
    const skip = (page - 1) * limit;
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.customerProfile', 'customerProfile')
      .select([
        ...USER_BASIC_FIELDS,
        'customerProfile.firstName',
        'customerProfile.lastName',
        'customerProfile.profileImageUrl',
      ])
      .where('user.role = :role', { role: 'CUSTOMER' });

    // Apply filters
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

    // Execute query
    const [customers, total] = await queryBuilder.getManyAndCount();

    const customerResponses: UserBasicResponse[] = customers.map(customer => ({
      id: customer.id,
      email: customer.email,
      username: customer.username,
      firstName: customer.customerProfile?.firstName,
      lastName: customer.customerProfile?.lastName,
      profileImageUrl: customer.customerProfile?.profileImageUrl,
      phoneNumber: customer.phoneNumber,
      authMethod: customer.authMethod as 'email' | 'google',
      role: customer.role,
      isActive: customer.isActive,
      isNumberVerified: customer.isNumberVerified,
      createdAt: customer.createdAt.toISOString(),
    }));

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.CUSTOMERS_RETRIEVED_SUCCESS,
      data: {
        users: customerResponses,
        total,
        page,
        limit,
      },
    };
  }

  /*
  =======================================
  Get Customer By Id
  ========================================
  */
  async getUserById(id: string): Promise<BaseResponse<UserBasicResponse>> {
    const customer = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.customerProfile', 'customerProfile')
      .select([
        ...USER_BASIC_FIELDS,
        'customerProfile.firstName',
        'customerProfile.lastName',
        'customerProfile.profileImageUrl',
      ])
      .where('user.id = :id', { id })
      .andWhere('user.role = :role', { role: 'CUSTOMER' }) 
      .getOne();

    if (!customer) {
      throw new NotFoundException(SYS_MSG.CUSTOMER_NOT_FOUND);
    }

    const customerResponse: UserBasicResponse = {
      id: customer.id,
      email: customer.email,
      username: customer.username,
      firstName: customer.customerProfile?.firstName,
      lastName: customer.customerProfile?.lastName,
      profileImageUrl: customer.customerProfile?.profileImageUrl,
      phoneNumber: customer.phoneNumber,
      authMethod: customer.authMethod as 'email' | 'google',
      isNumberVerified: customer.isNumberVerified,
      role: customer.role,
      isActive: customer.isActive,
      createdAt: customer.createdAt.toISOString(),
    };

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.CUSTOMER_RETRIEVED_SUCCESS,
      data: customerResponse,
    };
  }

  /*
  =======================================
  Get Customer Profile (with authMethod for settings)
  ========================================
  */
  async getUserProfile(userId: string): Promise<BaseResponse<ProfileSettingsResponse>> {
    const customer = await this.userRepository.findOne({
      where: { id: userId, role: 'CUSTOMER' },
      relations: ['customerProfile'],
    });

    if (!customer) {
      throw new NotFoundException(SYS_MSG.CUSTOMER_NOT_FOUND);
    }

    const profileResponse: ProfileSettingsResponse = {
      user: {
        id: customer.id,
        username: customer.username,
        email: customer.email,
        firstName: customer.customerProfile?.firstName,
        lastName: customer.customerProfile?.lastName,
        profileImageUrl: customer.customerProfile?.profileImageUrl,
        phoneNumber: customer.phoneNumber,
        authMethod: customer.authMethod as 'email' | 'google',
        role: customer.role,
        isActive: customer.isActive,
        isNumberVerified: customer.isNumberVerified,
        createdAt: customer.createdAt.toISOString(),
      },
      lastLoginAt: customer.lastLoginAt?.toISOString(),
    };

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.CUSTOMER_PROFILE_RETRIEVED_SUCCESS,
      data: profileResponse,
    };
  }

  /* 
  =======================================
  Update Customer Profile (CUSTOMERS ONLY)
  ========================================
  */
  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<BaseResponse<UserBasicResponse>> {
    const customer = await this.userRepository.findOne({
      where: { id: userId, role: 'CUSTOMER' },
      relations: ['customerProfile'],
    });

    if (!customer) {
      throw new NotFoundException(SYS_MSG.CUSTOMER_NOT_FOUND);
    }

    // Check if username is being updated and if it's available
    if (updateProfileDto.username && updateProfileDto.username !== customer.username) {
      const existingUser = await this.userRepository.findOne({
        where: { username: updateProfileDto.username },
      });
      
      if (existingUser) {
        throw new BadRequestException('Username already taken');
      }
    }

    // Update username in user entity if provided
    if (updateProfileDto.username) {
      await this.userRepository.update(userId, { username: updateProfileDto.username });
    }

    // Update customer profile (excluding username)
    const { username, ...profileData } = updateProfileDto;
    if (customer.customerProfile) {
      await this.customerProfileRepository.update(customer.customerProfile.id, profileData);
    } else {
      // Create profile if it doesn't exist
      const newProfile = this.customerProfileRepository.create({
        user: customer,
        ...profileData,
      });
      await this.customerProfileRepository.save(newProfile);
    }

    // Return updated profile
    const updatedCustomer = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['customerProfile'],
    });

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.CUSTOMER_PROFILE_UPDATED_SUCCESS,
      data: {
        id: updatedCustomer.id,
        username: updatedCustomer.username,
        email: updatedCustomer.email,
        firstName: updatedCustomer.customerProfile?.firstName,
        lastName: updatedCustomer.customerProfile?.lastName,
        profileImageUrl: updatedCustomer.customerProfile?.profileImageUrl,
        phoneNumber: updatedCustomer.phoneNumber,
        authMethod: updatedCustomer.authMethod as 'email' | 'google',
        role: updatedCustomer.role,
        isActive: updatedCustomer.isActive,
        isNumberVerified: updatedCustomer.isNumberVerified,
        createdAt: updatedCustomer.createdAt.toISOString(),
      },
    };
  }

  /* 
  =======================================
  Change Password (Only for email auth)
  ========================================
  */
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<BaseResponse<string>> {
    // Get user with password field
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id: userId })
      .getOne();

    if (!user) {
      throw new NotFoundException(SYS_MSG.USER_ACCOUNT_DOES_NOT_EXIST);
    }

    // Check if user is using Google auth
    if (user.authMethod === 'google') {
      throw new BadRequestException(SYS_MSG.CANNOT_CHANGE_GOOGLE_PASSWORD);
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(SYS_MSG.CURRENT_PASSWORD_INCORRECT);
    }

    // Check if new passwords match
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException(SYS_MSG.PASSWORD_MISMATCH);
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, salt);

    // Update password
    await this.userRepository.update(userId, {
      password: hashedPassword,
    });

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.PASSWORD_CHANGED_SUCCESSFULLY,
      data: 'Password has been updated',
    };
  }
}
