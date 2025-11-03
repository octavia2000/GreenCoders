import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../database/entities/user.entity';
import { VendorProfileEntity } from '../database/entities/vendor-profile.entity';
import { VendorBusinessVerificationEntity } from '../database/entities/vendor-business-verification.entity';
import {
  BaseResponse,
  VendorDashboardStats,
  VendorProfileResponse,
  PaginatedVendorsResponse,
  VendorUpdateResponse,
} from './types/vendor-response.types';
import { QueryVendorsDto } from './dto/query-vendors.dto';
import { UpdateVendorProfileDto } from './dto/update-vendor-profile.dto';
import { SubmitBusinessVerificationDto } from './dto/submit-business-verification.dto';
import {
  VENDOR_BASIC_FIELDS,
  VENDOR_VERIFICATION_FIELDS,
} from './constants/vendor-select-fields';
import { InputSanitizationService } from '../shared/services/input-sanitization.service';
import { VendorsRepository } from './repositories/vendors.repository';
import {
  mapVendorToBasicResponse,
  mapVendorToProfileResponse,
} from './mappers/vendor.mappers';
import * as SYS_MSG from '../helpers/SystemMessages';

@Injectable()
export class VendorService {
  constructor(
    private readonly vendorsRepository: VendorsRepository,
    private readonly sanitizationService: InputSanitizationService,
    @InjectRepository(VendorProfileEntity)
    private readonly vendorProfileRepository: Repository<VendorProfileEntity>,
    @InjectRepository(VendorBusinessVerificationEntity)
    private readonly businessVerificationRepository: Repository<VendorBusinessVerificationEntity>,
  ) {}

  /* 
  =======================================
  Get Vendor Dashboard Stats
  ========================================
  */
  async getVendorDashboard(): Promise<BaseResponse<VendorDashboardStats>> {
    const dashboardStats = await this.vendorsRepository.getDashboardStats();

    const response: VendorDashboardStats = {
      totalVendors: dashboardStats.totalVendors,
      verifiedVendors: dashboardStats.verifiedVendors,
      pendingVerification: dashboardStats.pendingVerification,
      recentVendors: dashboardStats.recentVendors.map((vendor) =>
        mapVendorToBasicResponse(vendor),
      ),
    };

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.VENDOR_DASHBOARD_RETRIEVED_SUCCESS,
      data: response,
    };
  }

  /* 
  =======================================
  Get Self Vendor Profile
  ========================================
  */
  async getSelfVendorProfile(
    userId: string,
  ): Promise<BaseResponse<VendorProfileResponse>> {
    const vendor = await this.vendorsRepository.findVendorByUserId(
      userId,
      VENDOR_BASIC_FIELDS as (keyof UserEntity)[],
    );

    if (!vendor) {
      throw new NotFoundException(SYS_MSG.VENDOR_NOT_FOUND);
    }

    const response: VendorProfileResponse = mapVendorToProfileResponse(vendor);

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.VENDOR_PROFILE_RETRIEVED_SUCCESS,
      data: response,
    };
  }

  /* 
  =======================================
  Get All Vendors (Paginated & Filtered)
  ========================================
  */
  async getAllVendors(
    queryDto: QueryVendorsDto,
  ): Promise<BaseResponse<PaginatedVendorsResponse>> {
    // Sanitize input parameters
    const sanitizedPage =
      this.sanitizationService.sanitizeNumber(queryDto.page) || 1;
    const sanitizedLimit =
      this.sanitizationService.sanitizeNumber(queryDto.limit) || 10;
    const sanitizedSearch = queryDto.search
      ? this.sanitizationService.sanitizeSearchQuery(queryDto.search)
      : undefined;
    const sanitizedIsVerified =
      queryDto.isVerified !== undefined
        ? this.sanitizationService.sanitizeBoolean(queryDto.isVerified)
        : undefined;
    const sanitizedIsActive =
      queryDto.isActive !== undefined
        ? this.sanitizationService.sanitizeBoolean(queryDto.isActive)
        : undefined;

    const filters = {
      page: sanitizedPage,
      limit: sanitizedLimit,
      isVerified: sanitizedIsVerified,
      isActive: sanitizedIsActive,
      search: sanitizedSearch,
    };

    const result = await this.vendorsRepository.findVendorsWithFilters(filters);

    const response: PaginatedVendorsResponse = {
      vendors: result.vendors.map((vendor) => mapVendorToBasicResponse(vendor)),
      total: result.total,
      page: sanitizedPage,
      limit: sanitizedLimit,
    };

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.VENDORS_RETRIEVED_SUCCESS,
      data: response,
    };
  }

  /* 
  =======================================
  Get Vendor by ID
  ========================================
  */
  async getVendorById(
    vendorId: string,
  ): Promise<BaseResponse<VendorProfileResponse>> {
    const vendor = await this.vendorsRepository.findVendorById(
      vendorId,
      VENDOR_BASIC_FIELDS as (keyof UserEntity)[],
    );

    if (!vendor) {
      throw new NotFoundException(SYS_MSG.VENDOR_NOT_FOUND);
    }

    const response: VendorProfileResponse = mapVendorToProfileResponse(vendor);

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.VENDOR_RETRIEVED_SUCCESS,
      data: response,
    };
  }

  /* 
  =======================================
  Update Vendor Profile (Personal info only)
  ========================================
  */
  async updateVendorProfile(
    vendorId: string,
    updateData: UpdateVendorProfileDto,
  ): Promise<BaseResponse<VendorUpdateResponse>> {
    const vendorExists = await this.vendorsRepository.vendorExists(vendorId);

    if (!vendorExists) {
      throw new NotFoundException(SYS_MSG.VENDOR_NOT_FOUND);
    }

    await this.vendorsRepository.updateVendorProfile(vendorId, updateData);

    const response: VendorUpdateResponse = {
      vendorId,
      message: SYS_MSG.VENDOR_PROFILE_UPDATED_SUCCESS,
    };

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.VENDOR_PROFILE_UPDATED_SUCCESS,
      data: response,
    };
  }

  /* 
  =======================================
  Submit Business Verification
  ========================================
  */
  async submitBusinessVerification(
    userId: string,
    verificationDto: SubmitBusinessVerificationDto,
  ): Promise<BaseResponse<{ message: string }>> {
    // Check if verification already exists
    let verification = await this.businessVerificationRepository.findOne({
      where: { userId },
    });

    if (verification) {
      // Update existing verification
      verification.businessName = verificationDto.businessName;
      verification.businessIdNumber = verificationDto.businessIdNumber;
      verification.businessWebsite = verificationDto.businessWebsite;
      verification.businessEmail = verificationDto.businessEmail;
      verification.socialLinks = verificationDto.socialLinks;
      verification.verificationStatus = 'pending';
      verification.verificationNotes = null;
      verification.verifiedAt = null;
      verification.verifiedBy = null;
    } else {
      // Create new verification
      verification = this.businessVerificationRepository.create({
        userId,
        businessName: verificationDto.businessName,
        businessIdNumber: verificationDto.businessIdNumber,
        businessWebsite: verificationDto.businessWebsite,
        businessEmail: verificationDto.businessEmail,
        socialLinks: verificationDto.socialLinks,
        verificationStatus: 'pending',
      });
    }

    await this.businessVerificationRepository.save(verification);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Business verification submitted successfully',
      data: {
        message: 'Business verification submitted successfully',
      },
    };
  }

  /* 
  =======================================
  Update Vendor Profile (Personal Info)
  ========================================
  */
  async updateVendorPersonalProfile(
    userId: string,
    profileDto: UpdateVendorProfileDto,
  ): Promise<BaseResponse<{ message: string }>> {
    // Check if profile exists
    let profile = await this.vendorProfileRepository.findOne({
      where: { userId },
    });

    if (profile) {
      // Update existing profile
      Object.assign(profile, profileDto);
    } else {
      // Create new profile
      profile = this.vendorProfileRepository.create({
        userId,
        ...profileDto,
      });
    }

    await this.vendorProfileRepository.save(profile);

    return {
      statusCode: HttpStatus.OK,
      message: 'Vendor profile updated successfully',
      data: {
        message: 'Vendor profile updated successfully',
      },
    };
  }


  /* 
  =======================================
  Get Vendor Verification Status
  ========================================
  */
  async getVendorVerificationStatus(
    userId: string,
  ): Promise<BaseResponse<{
    verificationStatus: string;
    businessName?: string;
    businessIdNumber?: string;
    businessWebsite?: string;
    businessEmail?: string;
    socialLinks?: any;
    verificationNotes?: string;
    verifiedAt?: Date;
  }>> {
    const verification = await this.businessVerificationRepository.findOne({
      where: { userId },
    });

    if (!verification) {
      return {
        statusCode: HttpStatus.OK,
        message: 'No verification found',
        data: {
          verificationStatus: 'not_submitted',
        },
      };
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Verification status retrieved successfully',
      data: {
        verificationStatus: verification.verificationStatus,
        businessName: verification.businessName,
        businessIdNumber: verification.businessIdNumber,
        businessWebsite: verification.businessWebsite,
        businessEmail: verification.businessEmail,
        socialLinks: verification.socialLinks,
        verificationNotes: verification.verificationNotes,
        verifiedAt: verification.verifiedAt,
      },
    };
  }
}
