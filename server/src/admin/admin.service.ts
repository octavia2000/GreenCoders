import { Injectable, NotFoundException, HttpStatus, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from '../database/entities/user.entity';
import { VendorEntity } from '../database/entities/vendor.entity';
import { VendorBusinessVerificationEntity } from '../database/entities/vendor-business-verification.entity';
import { AdminInvitationEntity, AdminInvitationStatus } from '../database/entities/admin-invitation.entity';
import { Role } from '../auth/types/auth-response.types';
import { AdminType, getPermissionsForAdminType } from './constants/admin-permissions';
import { BaseResponse } from './types/admin-response.types';
import { ApproveVendorVerificationDto } from './dto/approve-vendor-verification.dto';
import { InviteAdminDto, SetupAdminPasswordDto, ValidateInvitationDto } from './dto/admin-invitation.dto';
import { CreateAdminDto, UpdateAdminDto, QueryAdminsDto } from './dto/admin.dto';
import { EmailService } from '../shared/notifications/email.service';
import * as SYS_MSG from '../helpers/SystemMessages';
// Note: Password hashing is handled by UserEntity hooks

export interface AdminDashboardStats {
  totalVendors: number;
  totalAdmins: number;
  totalUsers: number;
  recentVendors: any[];
}

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(VendorEntity)
    private readonly vendorRepository: Repository<VendorEntity>,
    @InjectRepository(VendorBusinessVerificationEntity)
    private readonly businessVerificationRepository: Repository<VendorBusinessVerificationEntity>,
    @InjectRepository(AdminInvitationEntity)
    private readonly invitationRepository: Repository<AdminInvitationEntity>,
    private readonly emailService: EmailService,
  ) {}

  /* 
  =======================================
  Get Admin Dashboard Stats
  ========================================
  */
  async getAdminDashboard(): Promise<BaseResponse<AdminDashboardStats>> {
    const [totalVendors, totalAdmins, totalUsers, recentVendors] =
      await Promise.all([
        this.userRepository.count({ where: { role: Role.VENDOR } }),
        this.userRepository.count({ where: { role: Role.ADMIN } }),
        this.userRepository.count(),
        this.userRepository.find({
          where: { role: Role.VENDOR },
          order: { createdAt: 'DESC' },
          take: 5,
          select: ['id', 'username', 'email', 'createdAt'],
        }),
      ]);

    return {
      statusCode: 200,
      message: SYS_MSG.ADMIN_DASHBOARD_RETRIEVED_SUCCESS,
      data: {
        totalVendors,
        totalAdmins,
        totalUsers,
        recentVendors: recentVendors.map((vendor) => ({
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
  Approve/Reject Vendor Verification
  ========================================
  */
  async approveVendorVerification(
    vendorId: string,
    approvalDto: ApproveVendorVerificationDto,
    adminId: string,
  ): Promise<BaseResponse<{ message: string }>> {
    const verification = await this.businessVerificationRepository.findOne({
      where: { userId: vendorId },
    });

    if (!verification) {
      throw new NotFoundException('Vendor verification not found');
    }

    verification.verificationStatus = approvalDto.status;
    verification.verificationNotes = approvalDto.notes;
    verification.verifiedBy = adminId;
    verification.verifiedAt = new Date();

    await this.businessVerificationRepository.save(verification);

    const statusMessage = approvalDto.status === 'verified' 
      ? 'Vendor verification approved successfully'
      : 'Vendor verification rejected';

    return {
      statusCode: HttpStatus.OK,
      message: statusMessage,
      data: {
        message: statusMessage,
      },
    };
  }

  /* 
  =======================================
  Invite Admin Method
  ========================================
  */
  async inviteAdmin(
    inviteDto: InviteAdminDto,
    invitedBy: string,
    invitedByName: string,
  ): Promise<BaseResponse<{ invitationId: string }>> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: inviteDto.email },
    });

    if (existingUser) {
      throw new ConflictException(SYS_MSG.USER_ACCOUNT_EXIST);
    }

    // Check if there's already a pending invitation
    const existingInvitation = await this.invitationRepository.findOne({
      where: {
        email: inviteDto.email,
        status: AdminInvitationStatus.PENDING,
      },
    });

    if (existingInvitation) {
      throw new ConflictException(SYS_MSG.ADMIN_INVITATION_ALREADY_PENDING);
    }

    // Create invitation
    const invitationToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const invitation = this.invitationRepository.create({
      email: inviteDto.email,
      adminType: inviteDto.adminType,
      invitationToken,
      status: AdminInvitationStatus.PENDING,
      expiresAt,
      invitedBy,
      invitedByName,
      department: inviteDto.department,
      message: inviteDto.message,
    });

    const savedInvitation = await this.invitationRepository.save(invitation);

    // Send invitation email
    try {
      await this.emailService.sendAdminInvitationEmail(
        inviteDto.email,
        inviteDto.adminType,
        invitationToken,
        invitedByName,
        inviteDto.department,
        inviteDto.message,
      );
    } catch (error) {
      this.logger.error(`Failed to send invitation email to ${inviteDto.email}:`, error);
      // Don't throw error here, invitation is still created
    }

    return {
      statusCode: HttpStatus.CREATED,
      message: SYS_MSG.ADMIN_INVITATION_SENT_SUCCESS,
      data: { invitationId: savedInvitation.id },
    };
  }

  /* 
  =======================================
  Validate Invitation Method
  ========================================
  */
  async validateInvitation(
    validateDto: ValidateInvitationDto,
  ): Promise<BaseResponse<{ valid: boolean; adminType?: string; department?: string }>> {
    const invitation = await this.invitationRepository.findOne({
      where: {
        invitationToken: validateDto.invitationToken,
        email: validateDto.email,
        status: AdminInvitationStatus.PENDING,
      },
    });

    if (!invitation) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: SYS_MSG.ADMIN_INVITATION_NOT_FOUND,
        data: { valid: false },
      };
    }

    if (invitation.expiresAt < new Date()) {
      // Mark as expired
      invitation.status = AdminInvitationStatus.EXPIRED;
      await this.invitationRepository.save(invitation);

      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: SYS_MSG.ADMIN_INVITATION_EXPIRED,
        data: { valid: false },
      };
    }

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.ADMIN_INVITATION_VALIDATED_SUCCESS,
      data: {
        valid: true,
        adminType: invitation.adminType,
        department: invitation.department,
      },
    };
  }

  /* 
  =======================================
  Setup Admin Password Method
  ========================================
  */
  async setupAdminPassword(
    setupDto: SetupAdminPasswordDto,
  ): Promise<BaseResponse<{ userId: string }>> {
    // Validate passwords match
    if (setupDto.password !== setupDto.confirmPassword) {
      throw new BadRequestException(SYS_MSG.ADMIN_SETUP_PASSWORD_MISMATCH);
    }

    // Validate invitation
    const invitation = await this.invitationRepository.findOne({
      where: {
        invitationToken: setupDto.invitationToken,
        email: setupDto.email,
        status: AdminInvitationStatus.PENDING,
      },
    });

    if (!invitation) {
      throw new NotFoundException(SYS_MSG.ADMIN_INVITATION_INVALID);
    }

    if (invitation.expiresAt < new Date()) {
      invitation.status = AdminInvitationStatus.EXPIRED;
      await this.invitationRepository.save(invitation);
      throw new BadRequestException(SYS_MSG.ADMIN_INVITATION_EXPIRED);
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: setupDto.email },
    });

    if (existingUser) {
      throw new ConflictException(SYS_MSG.USER_ACCOUNT_EXIST);
    }

    // Create admin user
    const permissions = getPermissionsForAdminType(invitation.adminType);
    const username = setupDto.email.split('@')[0]; // Use email prefix as username

    const adminUser = this.userRepository.create({
      email: setupDto.email,
      password: setupDto.password, // Will be hashed by @BeforeInsert
      username: username,
      phoneNumber: '', // Will be set later
      role: Role.ADMIN,
      adminType: invitation.adminType,
      permissions: permissions,
      department: invitation.department,
      isActive: true,
    });

    const savedUser = await this.userRepository.save(adminUser);

    // Update invitation status
    invitation.status = AdminInvitationStatus.ACCEPTED;
    invitation.acceptedAt = new Date();
    invitation.acceptedBy = savedUser.id;
    await this.invitationRepository.save(invitation);

    this.logger.log(`Admin user created successfully: ${savedUser.email}`);

    return {
      statusCode: HttpStatus.CREATED,
      message: SYS_MSG.ADMIN_ACCOUNT_CREATED_SUCCESS,
      data: { userId: savedUser.id },
    };
  }

  /* 
  =======================================
  Get Admin Invitations Method
  ========================================
  */
  async getAdminInvitations(
    page: number = 1,
    limit: number = 10,
    status?: AdminInvitationStatus,
  ): Promise<BaseResponse<{ invitations: any[]; total: number; page: number; limit: number }>> {
    const queryBuilder = this.invitationRepository.createQueryBuilder('invitation');

    if (status) {
      queryBuilder.where('invitation.status = :status', { status });
    }

    const [invitations, total] = await queryBuilder
      .orderBy('invitation.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.ADMIN_INVITATIONS_RETRIEVED_SUCCESS,
      data: {
        invitations: invitations.map(inv => ({
          id: inv.id,
          email: inv.email,
          adminType: inv.adminType,
          status: inv.status,
          department: inv.department,
          invitedByName: inv.invitedByName,
          expiresAt: inv.expiresAt,
          createdAt: inv.createdAt,
        })),
        total,
        page,
        limit,
      },
    };
  }

  /* 
  =======================================
  Cancel Invitation Method
  ========================================
  */
  async cancelInvitation(
    invitationId: string,
    cancelledBy: string,
  ): Promise<BaseResponse<{ message: string }>> {
    const invitation = await this.invitationRepository.findOne({
      where: { id: invitationId },
    });

    if (!invitation) {
      throw new NotFoundException(SYS_MSG.ADMIN_INVITATION_NOT_FOUND);
    }

    if (invitation.status !== AdminInvitationStatus.PENDING) {
      throw new BadRequestException('Only pending invitations can be cancelled');
    }

    invitation.status = AdminInvitationStatus.CANCELLED;
    invitation.cancelledAt = new Date();
    invitation.cancelledBy = cancelledBy;

    await this.invitationRepository.save(invitation);

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.ADMIN_INVITATION_CANCELLED_SUCCESS,
      data: { message: SYS_MSG.ADMIN_INVITATION_CANCELLED_SUCCESS },
    };
  }

  /* 
  =======================================
  Get Customer By ID (Admin with Customer Admin permission)
  ========================================
  */
  async getCustomerById(customerId: string): Promise<BaseResponse<any>> {
    const customer = await this.userRepository.findOne({
      where: { 
        id: customerId,
        role: Role.CUSTOMER 
      },
      select: [
        'id', 'email', 'username', 'phoneNumber', 'firstName', 'lastName',
        'profileImageUrl', 'isNumberVerified', 'authMethod', 'isActive',
        'createdAt', 'updatedAt'
      ],
    });

    if (!customer) {
      throw new NotFoundException(SYS_MSG.CUSTOMER_NOT_FOUND);
    }

    return {
      statusCode: HttpStatus.OK,
      message: SYS_MSG.CUSTOMER_RETRIEVED_SUCCESS,
      data: {
        id: customer.id,
        email: customer.email,
        username: customer.username,
        phoneNumber: customer.phoneNumber,
        firstName: customer.firstName,
        lastName: customer.lastName,
        profileImageUrl: customer.profileImageUrl,
        isNumberVerified: customer.isNumberVerified,
        authMethod: customer.authMethod,
        isActive: customer.isActive,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
      },
    };
  }

  /* 
  =======================================
  Block Customer (Admin with Customer Admin permission)
  ========================================
  */
  async blockCustomer(customerId: string, adminId: string): Promise<BaseResponse<{ message: string }>> {
    const customer = await this.userRepository.findOne({
      where: { 
        id: customerId,
        role: Role.CUSTOMER 
      },
    });

    if (!customer) {
      throw new NotFoundException(SYS_MSG.CUSTOMER_NOT_FOUND);
    }

    customer.isActive = false;
    await this.userRepository.save(customer);

    return {
      statusCode: HttpStatus.OK,
      message: 'Customer blocked successfully',
      data: { message: 'Customer blocked successfully' },
    };
  }

  /* 
  =======================================
  Unblock Customer (Admin with Customer Admin permission)
  ========================================
  */
  async unblockCustomer(customerId: string, adminId: string): Promise<BaseResponse<{ message: string }>> {
    const customer = await this.userRepository.findOne({
      where: { 
        id: customerId,
        role: Role.CUSTOMER 
      },
    });

    if (!customer) {
      throw new NotFoundException(SYS_MSG.CUSTOMER_NOT_FOUND);
    }

    customer.isActive = true;
    await this.userRepository.save(customer);

    return {
      statusCode: HttpStatus.OK,
      message: 'Customer unblocked successfully',
      data: { message: 'Customer unblocked successfully' },
    };
  }

  /* 
  =======================================
  Admin Management Methods
  ========================================
  */

  async getAllAdmins(queryDto: QueryAdminsDto): Promise<BaseResponse<any>> {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.role = :role', { role: Role.ADMIN });

    // Apply filters
    if (queryDto.search) {
      queryBuilder.andWhere(
        '(user.username ILIKE :search OR user.email ILIKE :search)',
        { search: `%${queryDto.search}%` }
      );
    }

    if (queryDto.department) {
      queryBuilder.andWhere('user.department = :department', { department: queryDto.department });
    }

    if (queryDto.accessLevel) {
      queryBuilder.andWhere('user.adminType = :accessLevel', { accessLevel: queryDto.accessLevel });
    }

    if (queryDto.isActive !== undefined) {
      queryBuilder.andWhere('user.isActive = :isActive', { isActive: queryDto.isActive });
    }

    const [admins, total] = await queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      statusCode: HttpStatus.OK,
      message: 'Admins retrieved successfully',
      data: {
        admins: admins.map(admin => ({
          id: admin.id,
          email: admin.email,
          username: admin.username,
          firstName: admin.firstName,
          lastName: admin.lastName,
          department: admin.department,
          adminType: admin.adminType,
          permissions: admin.permissions,
          isActive: admin.isActive,
          lastLoginAt: admin.lastLoginAt,
          createdAt: admin.createdAt,
          updatedAt: admin.updatedAt,
        })),
        total,
        page,
        limit,
      },
    };
  }

  async getAdminById(adminId: string): Promise<BaseResponse<any>> {
    const admin = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :adminId', { adminId })
      .andWhere('user.role = :role', { role: Role.ADMIN })
      .getOne();

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Admin retrieved successfully',
      data: {
        id: admin.id,
        email: admin.email,
        username: admin.username,
        firstName: admin.firstName,
        lastName: admin.lastName,
        department: admin.department,
        adminType: admin.adminType,
        permissions: admin.permissions,
        isActive: admin.isActive,
        lastLoginAt: admin.lastLoginAt,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    };
  }

  async createAdmin(createAdminDto: CreateAdminDto): Promise<BaseResponse<any>> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: createAdminDto.email },
        { username: createAdminDto.username },
      ],
    });

    if (existingUser) {
      throw new ConflictException('User with this email or username already exists');
    }

    // Create user
    const user = this.userRepository.create({
      email: createAdminDto.email,
      password: createAdminDto.password, // Will be hashed by entity hooks
      username: createAdminDto.username,
      phoneNumber: createAdminDto.phoneNumber,
      firstName: createAdminDto.firstName,
      lastName: createAdminDto.lastName,
      role: Role.ADMIN,
      isActive: true,
    });

    const savedUser = await this.userRepository.save(user);

    // Update user with admin-specific fields
    savedUser.firstName = createAdminDto.firstName;
    savedUser.lastName = createAdminDto.lastName;
    savedUser.department = createAdminDto.department;
    savedUser.adminType = createAdminDto.accessLevel;
    savedUser.permissions = getPermissionsForAdminType(createAdminDto.accessLevel);

    const savedAdmin = await this.userRepository.save(savedUser);

    this.logger.log(`Admin created successfully: ${savedUser.email}`);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Admin created successfully',
      data: {
        id: savedAdmin.id,
        email: savedUser.email,
        username: savedUser.username,
      },
    };
  }

  async updateAdmin(adminId: string, updateAdminDto: UpdateAdminDto): Promise<BaseResponse<any>> {
    const admin = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :adminId', { adminId })
      .andWhere('user.role = :role', { role: Role.ADMIN })
      .getOne();

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    // Update user fields if provided
    if (updateAdminDto.firstName !== undefined) {
      admin.firstName = updateAdminDto.firstName;
    }
    if (updateAdminDto.lastName !== undefined) {
      admin.lastName = updateAdminDto.lastName;
    }
    if (updateAdminDto.phoneNumber !== undefined) {
      admin.phoneNumber = updateAdminDto.phoneNumber;
    }
    if (updateAdminDto.department !== undefined) {
      admin.department = updateAdminDto.department;
    }
    if (updateAdminDto.accessLevel !== undefined) {
      admin.adminType = updateAdminDto.accessLevel;
      admin.permissions = getPermissionsForAdminType(updateAdminDto.accessLevel);
    }

    const savedAdmin = await this.userRepository.save(admin);

    this.logger.log(`Admin updated successfully: ${admin.email}`);

    return {
      statusCode: HttpStatus.OK,
      message: 'Admin updated successfully',
      data: {
        id: savedAdmin.id,
        email: savedAdmin.email,
        username: savedAdmin.username,
      },
    };
  }

  async deactivateAdmin(adminId: string): Promise<BaseResponse<any>> {
    const admin = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :adminId', { adminId })
      .andWhere('user.role = :role', { role: Role.ADMIN })
      .getOne();

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    // Deactivate user account
    admin.isActive = false;
    await this.userRepository.save(admin);

    this.logger.log(`Admin deactivated successfully: ${admin.email}`);

    return {
      statusCode: HttpStatus.OK,
      message: 'Admin deactivated successfully',
      data: { message: 'Admin deactivated successfully' },
    };
  }
}
