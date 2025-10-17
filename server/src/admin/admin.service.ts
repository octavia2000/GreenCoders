import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../customers/entities/user.entity';
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

  /* 
  =======================================
  Get All Vendors
  ========================================
  */
  async getAllVendors(page: number = 1, limit: number = 10): Promise<BaseResponse<{ vendors: any[], total: number }>> {
    const [vendors, total] = await this.userRepository.findAndCount({
      where: { role: 'VENDOR' },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      select: ['id', 'username', 'email', 'isNumberVerified', 'createdAt'],
    });

    return {
      statusCode: 200,
      message: SYS_MSG.VENDORS_RETRIEVED_SUCCESS,
      data: {
        vendors: vendors.map(vendor => ({
          id: vendor.id,
          username: vendor.username,
          email: vendor.email,
          isNumberVerified: vendor.isNumberVerified,
          createdAt: vendor.createdAt,
        })),
        total,
      },
    };
  }
}
