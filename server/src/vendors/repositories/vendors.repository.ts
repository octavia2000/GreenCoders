import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { Role } from '../../auth/types/auth-response.types';
import { QueryVendorsDto } from '../dto/query-vendors.dto';
import {
  VENDOR_BASIC_FIELDS,
  VENDOR_DASHBOARD_FIELDS,
  VENDOR_VERIFICATION_FIELDS,
} from '../constants/vendor-select-fields';

export interface VendorFilters {
  page?: number;
  limit?: number;
  isVerified?: boolean;
  isActive?: boolean;
  search?: string;
}

export interface VendorQueryResult {
  vendors: UserEntity[];
  total: number;
}

@Injectable()
export class VendorsRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Get vendor dashboard statistics
   */
  async getDashboardStats(): Promise<{
    totalVendors: number;
    verifiedVendors: number;
    pendingVerification: number;
    recentVendors: UserEntity[];
  }> {
    const [totalVendors, verifiedVendors, pendingVerification, recentVendors] =
      await Promise.all([
        this.userRepository.count({ where: { role: Role.VENDOR } }),
        this.userRepository.count({
          where: { role: Role.VENDOR, isVerified: true },
        }),
        this.userRepository.count({
          where: { role: Role.VENDOR, isVerified: false },
        }),
        this.userRepository.find({
          where: { role: Role.VENDOR },
          order: { createdAt: 'DESC' },
          take: 5,
          select: VENDOR_DASHBOARD_FIELDS as (keyof UserEntity)[],
        }),
      ]);

    return {
      totalVendors,
      verifiedVendors,
      pendingVerification,
      recentVendors,
    };
  }

  /**
   * Find vendor by ID with specific fields
   */
  async findVendorById(
    vendorId: string,
    fields: (keyof UserEntity)[],
  ): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { id: vendorId, role: Role.VENDOR },
      select: fields,
    });
  }

  /**
   * Find vendor by user ID with specific fields
   */
  async findVendorByUserId(
    userId: string,
    fields: (keyof UserEntity)[],
  ): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { id: userId, role: Role.VENDOR },
      select: fields,
    });
  }

  /**
   * Find vendors with filters and pagination
   */
  async findVendorsWithFilters(
    filters: VendorFilters,
  ): Promise<VendorQueryResult> {
    const { page = 1, limit = 10, isVerified, isActive, search } = filters;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .select(VENDOR_BASIC_FIELDS)
      .where('user.role = :role', { role: Role.VENDOR })
      .orderBy('user.createdAt', 'DESC');

    // Apply filters
    if (isActive !== undefined) {
      queryBuilder.andWhere('user.isActive = :isActive', { isActive });
    }

    if (isVerified !== undefined) {
      queryBuilder.andWhere('user.isVerified = :isVerified', { isVerified });
    }

    if (search) {
      queryBuilder.andWhere(
        '(user.username ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Pagination
    queryBuilder.skip(skip).take(limit);

    // Execute query
    const [vendors, total] = await queryBuilder.getManyAndCount();

    return { vendors, total };
  }

  /**
   * Update vendor verification status
   */
  async updateVendorVerification(
    vendorId: string,
    verificationData: {
      isVerified: boolean;
      verifiedAt: Date | null;
      verifiedBy: string | null;
    },
  ): Promise<void> {
    await this.userRepository.update(vendorId, verificationData);
  }

  /**
   * Update vendor profile data
   */
  async updateVendorProfile(
    vendorId: string,
    updateData: Partial<UserEntity>,
  ): Promise<void> {
    await this.userRepository.update(vendorId, updateData);
  }

  /**
   * Check if vendor exists
   */
  async vendorExists(vendorId: string): Promise<boolean> {
    const count = await this.userRepository.count({
      where: { id: vendorId, role: Role.VENDOR },
    });
    return count > 0;
  }

  /**
   * Get vendor count by verification status
   */
  async getVendorCountByStatus(isVerified: boolean): Promise<number> {
    return this.userRepository.count({
      where: { role: Role.VENDOR, isVerified },
    });
  }

  /**
   * Get recent vendors
   */
  async getRecentVendors(limit: number = 5): Promise<UserEntity[]> {
    return this.userRepository.find({
      where: { role: Role.VENDOR },
      order: { createdAt: 'DESC' },
      take: limit,
      select: VENDOR_DASHBOARD_FIELDS as (keyof UserEntity)[],
    });
  }
}

