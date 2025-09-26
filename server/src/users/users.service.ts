import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { BaseResponse, UserResponse } from '../shared/types/user-response.types';
import * as SYS_MSG from '../helpers/SystemMessages';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getAllUsers(page: number = 1, limit: number = 10): Promise<BaseResponse<{ users: UserResponse[]; total: number; page: number; limit: number }>> {
    const skip = (page - 1) * limit;
    const [users, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
      select: ['id', 'email', 'username', 'isNumberVerified', 'createdAt'],
    });

    const userResponses: UserResponse[] = users.map(user => ({
      id: user.id,
      email: user.email,
      username: user.username,
      isNumberVerified: user.isNumberVerified,
      createdAt: user.createdAt.toISOString(),
    }));

    return {
      statusCode: 200,
      message: SYS_MSG.USERS_RETRIEVED_SUCCESS,
      data: {
        users: userResponses,
        total,
        page,
        limit,
      },
    };
  }

  async getUserById(id: string): Promise<BaseResponse<UserResponse>> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'username', 'isNumberVerified', 'createdAt'],
    });

    if (!user) {
      throw new NotFoundException(SYS_MSG.USER_ACCOUNT_DOES_NOT_EXIST);
    }

    const userResponse: UserResponse = {
      id: user.id,
      email: user.email,
      username: user.username,
      isNumberVerified: user.isNumberVerified,
      createdAt: user.createdAt.toISOString(),
    };

    return {
      statusCode: 200,
      message: SYS_MSG.USER_RETRIEVED_SUCCESS,
      data: userResponse,
    };
  }
}
