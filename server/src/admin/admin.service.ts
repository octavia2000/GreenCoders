import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../auth/user/entities.ts/entities/user.entity';
import { BaseResponse } from './types/admin-response.types';
import * as SYS_MSG from '../helpers/SystemMessages';

export interface AdminDashboardStats {
  totalVendors: number;
  totalAdmins: number;
  totalUsers: number;
  recentVendors: any[];
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /* 
  =======================================
  Get Admin Dashboard Stats
  ========================================
  */
  async getAdminDashboard(): Promise<BaseResponse<AdminDashboardStats>> {
    const [
      totalVendors,
      totalAdmins,
      totalUsers,
      recentVendors
    ] = await Promise.all([
      this.userRepository.count({ where: { role: 'VENDOR' } }),
      this.userRepository.count({ where: { role: 'ADMIN' } }),
      this.userRepository.count(),
      this.userRepository.find({
        where: { role: 'VENDOR' },
        order: { createdAt: 'DESC' },
        take: 5,
        select: ['id', 'username', 'email', 'createdAt'],
      })
    ]);

    return {
      statusCode: 200,
      message: SYS_MSG.ADMIN_DASHBOARD_RETRIEVED_SUCCESS,
      data: {
        totalVendors,
        totalAdmins,
        totalUsers,
        recentVendors: recentVendors.map(vendor => ({
          id: vendor.id,
          username: vendor.username,
          email: vendor.email,
          createdAt: vendor.createdAt,
        })),
      },
    };
  }
}
