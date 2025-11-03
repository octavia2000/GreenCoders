import {
  Injectable,
  NotFoundException,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../database/entities/user.entity';
import {
  BaseResponse,
  CustomerBasicResponse,
  ProfileSettingsResponse,
  CustomersListResponse,
  CustomerProfileResponse,
  ChangePasswordResponse,
} from './types/customer-response.types';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CustomersRepository } from './repositories/customers.repository';
import {
  mapToCustomerBasicResponse,
  mapToProfileSettings,
  mapToCustomerResponse,
} from './mappers/customer.mappers';
import * as SYS_MSG from '../helpers/SystemMessages';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly customersRepository: CustomersRepository,
  ) {}

  /* 
  =======================================
  Get All Customers (Admin only)
  ========================================
  */
  async getAllCustomers(
    queryDto: QueryUsersDto,
  ): Promise<BaseResponse<CustomersListResponse>> {
    const { customers, total, page, limit } =
      await this.customersRepository.findAllCustomers(queryDto);

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.CUSTOMERS_RETRIEVED_SUCCESS,
      data: {
        customers,
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
  async getCustomerById(
    id: string,
  ): Promise<BaseResponse<CustomerProfileResponse>> {
    const customer = await this.customersRepository.findCustomerById(id);

    if (!customer) {
      throw new NotFoundException(SYS_MSG.CUSTOMER_NOT_FOUND);
    }
    const customerResponse: CustomerProfileResponse =
      mapToCustomerResponse(customer);
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
  async getCustomerProfile(
    userId: string,
  ): Promise<BaseResponse<ProfileSettingsResponse>> {
    const customer =
      await this.customersRepository.findCustomerProfileByUserId(userId);

    if (!customer) {
      throw new NotFoundException(SYS_MSG.CUSTOMER_NOT_FOUND);
    }
    const profileResponse: ProfileSettingsResponse =
      mapToProfileSettings(customer);

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.CUSTOMER_PROFILE_RETRIEVED_SUCCESS,
      data: profileResponse,
    };
  }

  /* 
  =======================================
  Update Customer Profile
  ========================================
  */
  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<BaseResponse<CustomerBasicResponse>> {
    const customer =
      await this.customersRepository.findCustomerProfileByUserId(userId);

    if (!customer) {
      throw new NotFoundException(SYS_MSG.CUSTOMER_NOT_FOUND);
    }

    // Check if username is being updated and if it's available
    if (
      updateProfileDto.username &&
      updateProfileDto.username !== customer.username
    ) {
      const existingUser = await this.customersRepository.findByUsername(
        updateProfileDto.username,
      );
      if (existingUser) {
        throw new BadRequestException(SYS_MSG.USERNAME_ALREADY_TAKEN);
      }
    }

    // Update user entity directly with profile data
    const updateData: Partial<UserEntity> = {};

    if (updateProfileDto.username) {
      updateData.username = updateProfileDto.username;
    }
    if (updateProfileDto.firstName !== undefined) {
      updateData.firstName = updateProfileDto.firstName;
    }
    if (updateProfileDto.lastName !== undefined) {
      updateData.lastName = updateProfileDto.lastName;
    }
    if (updateProfileDto.profileImageUrl !== undefined) {
      updateData.profileImageUrl = updateProfileDto.profileImageUrl;
    }

    await this.userRepository.update(userId, updateData);

    // Return updated profile
    const updatedCustomer =
      await this.customersRepository.findCustomerProfileByUserId(userId);
    const updatedCustomerResponse: CustomerBasicResponse =
      mapToCustomerBasicResponse(updatedCustomer);

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.CUSTOMER_PROFILE_UPDATED_SUCCESS,
      data: updatedCustomerResponse,
    };
  }

  /* 
  =======================================
  Change Password (Only for email auth)
  ========================================
  */
  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<BaseResponse<ChangePasswordResponse>> {
    const user =
      await this.customersRepository.findUserWithPasswordById(userId);

    if (!user) {
      throw new NotFoundException(SYS_MSG.USER_ACCOUNT_DOES_NOT_EXIST);
    }

    // Check if user is using Google auth
    if (user.authMethod === 'google') {
      throw new BadRequestException(SYS_MSG.CANNOT_CHANGE_GOOGLE_PASSWORD);
    }
    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(SYS_MSG.CURRENT_PASSWORD_INCORRECT);
    }
    // Check if new passwords match
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException(SYS_MSG.PASSWORD_MISMATCH);
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      changePasswordDto.newPassword,
      salt,
    );

    // Update password
    await this.customersRepository.updateUserPassword(userId, hashedPassword);

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.PASSWORD_CHANGED_SUCCESSFULLY,
      data: { success: true },
    };
  }
}
