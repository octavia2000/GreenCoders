import { Injectable, NotFoundException, ForbiddenException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../customers/entities/user.entity';
import { VendorProfileEntity } from './entities/vendor-profile.entity';
import { BaseResponse } from './types/vendor-response.types';
import { QueryVendorsDto } from './dto/query-vendors.dto';
import { UpdateVendorProfileDto } from './dto/update-vendor-profile.dto';
import { VENDOR_BASIC_FIELDS, VENDOR_PROFILE_FIELDS } from './constants/vendor-select-fields';
import * as SYS_MSG from '../helpers/SystemMessages';

export interface VendorDashboardStats {
  totalVendors: number;
  verifiedVendors: number;
  pendingVerification: number;
  recentVendors: any[];
}

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(VendorProfileEntity)
    private readonly vendorProfileRepository: Repository<VendorProfileEntity>,
  ) {}

  /* 
  =======================================
  Get Vendor Dashboard Stats
  ========================================
  */
  async getVendorDashboard(): Promise<BaseResponse<VendorDashboardStats>> {
    const [
      totalVendors,
      verifiedVendors,
      pendingVerification,
      recentVendors
    ] = await Promise.all([
      this.userRepository.count({ where: { role: 'VENDOR' } }),
      this.vendorProfileRepository.count({ where: { isVerified: true } }),
      this.vendorProfileRepository.count({ where: { isVerified: false } }),
      this.userRepository.find({
        where: { role: 'VENDOR' },
        relations: ['vendorProfile'],
        order: { createdAt: 'DESC' },
        take: 5,
        select: ['id', 'username', 'email', 'createdAt'],
      })
    ]);

    return {
      statusCode: 200,
      message: SYS_MSG.VENDOR_DASHBOARD_RETRIEVED_SUCCESS,
      data: {
        totalVendors,
        verifiedVendors,
        pendingVerification,
        recentVendors: recentVendors.map(vendor => ({
          id: vendor.id,
          username: vendor.username,
          email: vendor.email,
          isVerified: vendor.vendorProfile?.isVerified || false,
          createdAt: vendor.createdAt,
        })),
      },
    };
  }

  /* 
  =======================================
  Get All Vendors (Paginated & Filtered)
  Uses database indexes on: role, isActive, isVerified
  ========================================
  */
  async getAllVendors(queryDto: QueryVendorsDto): Promise<BaseResponse<{ vendors: any[], total: number, page: number, limit: number }>> {
    const { page = 1, limit = 10, isVerified, isActive, search } = queryDto;
    const skip = (page - 1) * limit;

    // ✅ Use Query Builder for better performance and flexibility
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.vendorProfile', 'vendorProfile')
      .select([...VENDOR_BASIC_FIELDS, ...VENDOR_PROFILE_FIELDS])
      .where('user.role = :role', { role: 'VENDOR' }) // Only vendors
      .orderBy('user.createdAt', 'DESC');

    // Apply filters
    if (isActive !== undefined) {
      queryBuilder.andWhere('user.isActive = :isActive', { isActive });
    }

    if (isVerified !== undefined) {
      queryBuilder.andWhere('vendorProfile.isVerified = :isVerified', { isVerified });
    }

    if (search) {
      queryBuilder.andWhere(
        '(user.username ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Pagination
    queryBuilder.skip(skip).take(limit);

    // Execute query
    const [vendors, total] = await queryBuilder.getManyAndCount();

    const vendorResponses = vendors.map(vendor => ({
      id: vendor.id,
      username: vendor.username,
      email: vendor.email,
      phoneNumber: vendor.phoneNumber,
      firstName: vendor.vendorProfile?.firstName,
      lastName: vendor.vendorProfile?.lastName,
      profileImageUrl: vendor.vendorProfile?.profileImageUrl,
      isNumberVerified: vendor.isNumberVerified,
      isActive: vendor.isActive,
      isVerified: vendor.vendorProfile?.isVerified || false,
      verifiedAt: vendor.vendorProfile?.verifiedAt,
      verifiedBy: vendor.vendorProfile?.verifiedBy,
      createdAt: vendor.createdAt,
    }));

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.VENDORS_RETRIEVED_SUCCESS,
      data: {
        vendors: vendorResponses,
        total,
        page,
        limit,
      },
    };
  }

  /* 
  =======================================
  Get Vendor by ID
  ========================================
  */
  async getVendorById(vendorId: string): Promise<BaseResponse<any>> {
    const vendor = await this.userRepository.findOne({
      where: { id: vendorId, role: 'VENDOR' },
      relations: ['vendorProfile'],
      select: ['id', 'username', 'email', 'isNumberVerified', 'createdAt'],
    });

    if (!vendor) {
      throw new NotFoundException(SYS_MSG.VENDOR_NOT_FOUND);
    }

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.VENDOR_RETRIEVED_SUCCESS,
      data: {
        ...vendor,
        vendorProfile: vendor.vendorProfile,
      },
    };
  }

  /* 
  =======================================
  Update Vendor Profile (Personal info only)
  ========================================
  */
  async updateVendorProfile(vendorId: string, updateData: UpdateVendorProfileDto): Promise<BaseResponse<any>> {
    const vendor = await this.userRepository.findOne({
      where: { id: vendorId, role: 'VENDOR' },
      relations: ['vendorProfile'],
    });

    if (!vendor) {
      throw new NotFoundException(SYS_MSG.VENDOR_NOT_FOUND);
    }

    if (!vendor.vendorProfile) {
      // Create vendor profile if it doesn't exist
      const vendorProfile = this.vendorProfileRepository.create({
        user: vendor,
        ...updateData,
      });
      await this.vendorProfileRepository.save(vendorProfile);
    } else {
      // Update existing vendor profile
      await this.vendorProfileRepository.update(vendor.vendorProfile.id, updateData);
    }

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.VENDOR_PROFILE_UPDATED_SUCCESS,
      data: { vendorId, message: SYS_MSG.VENDOR_PROFILE_UPDATED_SUCCESS },
    };
  }

  /* 
  =======================================
  Verify Vendor
  ========================================
  */
  async verifyVendor(vendorId: string, verifiedBy: string): Promise<BaseResponse<any>> {
    const vendor = await this.userRepository.findOne({
      where: { id: vendorId, role: 'VENDOR' },
      relations: ['vendorProfile'],
    });

    if (!vendor) {
      throw new NotFoundException(SYS_MSG.VENDOR_NOT_FOUND);
    }

    if (!vendor.vendorProfile) {
      throw new NotFoundException('Vendor profile not found');
    }

    await this.vendorProfileRepository.update(vendor.vendorProfile.id, {
      isVerified: true,
      verifiedAt: new Date(),
      verifiedBy,
    });

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.VENDOR_VERIFIED_SUCCESS,
      data: { vendorId },
    };
  }

  /* 
  =======================================
  Reject Vendor Verification
  ========================================
  */
  async rejectVendorVerification(vendorId: string, reason: string): Promise<BaseResponse<any>> {
    const vendor = await this.userRepository.findOne({
      where: { id: vendorId, role: 'VENDOR' },
      relations: ['vendorProfile'],
    });

    if (!vendor) {
      throw new NotFoundException(SYS_MSG.VENDOR_NOT_FOUND);
    }

    if (!vendor.vendorProfile) {
      throw new NotFoundException('Vendor profile not found');
    }

    await this.vendorProfileRepository.update(vendor.vendorProfile.id, {
      isVerified: false,
      verifiedAt: null,
      verifiedBy: null,
    });

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.VENDOR_VERIFICATION_REJECTED,
      data: { vendorId, reason },
    };
  }
}