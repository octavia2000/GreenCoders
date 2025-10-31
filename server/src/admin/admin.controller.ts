import { Controller, Get, Post, Body, Param, Query, UseGuards, Request, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { ApproveVendorVerificationDto } from './dto/approve-vendor-verification.dto';
import { InviteAdminDto, SetupAdminPasswordDto, ValidateInvitationDto } from './dto/admin-invitation.dto';
import { CreateAdminDto, UpdateAdminDto, QueryAdminsDto } from './dto/admin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { ADMIN_PERMISSIONS } from './constants/admin-permissions';
import { AdminInvitationStatus } from '../database/entities/admin-invitation.entity';
import { Role } from '../auth/types/auth-response.types';
import {
  RateLimitGuard,
  RateLimit,
  RATE_LIMITS,
} from '../shared/guards/rate-limit.guard';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /* 
  =======================================
  Get Admin Dashboard
  ========================================
  */
  @Get('dashboard')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(ADMIN_PERMISSIONS.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get admin dashboard statistics (All Admin Types)' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard data retrieved successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication cookie',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - Admin role required',
  })
  async getDashboard() {
    return this.adminService.getAdminDashboard();
  }

  /* 
  =======================================
  Approve/Reject Vendor Verification
  ========================================
  */
  @Post('vendor/:id/approve')
  @UseGuards(PermissionsGuard, RateLimitGuard)
  @RequirePermissions(ADMIN_PERMISSIONS.SUPER_ADMIN, ADMIN_PERMISSIONS.VENDOR_ADMIN)
  @RateLimit(RATE_LIMITS.STRICT)
  @ApiOperation({ summary: 'Approve or reject vendor verification (Super Admin & Vendor Admin only)' })
  @ApiResponse({ status: 200, description: 'Vendor verification status updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied - Super Admin or Vendor Admin required' })
  @ApiResponse({ status: 404, description: 'Vendor verification not found' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async approveVendorVerification(
    @Param('id') vendorId: string,
    @Body() approvalDto: ApproveVendorVerificationDto,
    @Request() req,
  ) {
    return this.adminService.approveVendorVerification(vendorId, approvalDto, req.user.id);
  }

  /* 
  =======================================
  Admin Invitation Endpoints
  ========================================
  */
  @Post('invite')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(ADMIN_PERMISSIONS.SUPER_ADMIN)
  @ApiOperation({ summary: 'Invite a new admin (Super Admin only)' })
  @ApiResponse({ status: 201, description: 'Admin invitation sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'User already exists or invitation pending' })
  async inviteAdmin(
    @Body() inviteDto: InviteAdminDto,
    @Request() req: any,
  ) {
    const invitedBy = req.user.id;
    const invitedByName = req.user.username || req.user.email;
    
    return await this.adminService.inviteAdmin(
      inviteDto,
      invitedBy,
      invitedByName,
    );
  }

  @Get('invitations')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(ADMIN_PERMISSIONS.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get admin invitations list (Super Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'status', required: false, enum: AdminInvitationStatus, description: 'Filter by status' })
  @ApiResponse({ status: 200, description: 'Admin invitations retrieved successfully' })
  async getAdminInvitations(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: AdminInvitationStatus,
  ) {
    return await this.adminService.getAdminInvitations(
      page || 1,
      limit || 10,
      status,
    );
  }

  @Post('invitations/:id/cancel')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(ADMIN_PERMISSIONS.SUPER_ADMIN)
  @ApiOperation({ summary: 'Cancel an admin invitation (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Invitation cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Invitation not found' })
  @ApiResponse({ status: 400, description: 'Only pending invitations can be cancelled' })
  async cancelInvitation(
    @Param('id') invitationId: string,
    @Request() req: any,
  ) {
    const cancelledBy = req.user.id;
    return await this.adminService.cancelInvitation(invitationId, cancelledBy);
  }

  /* 
  =======================================
  Customer Management Endpoints
  ========================================
  */
  @Get('customers/:id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(ADMIN_PERMISSIONS.SUPER_ADMIN, ADMIN_PERMISSIONS.CUSTOMER_ADMIN)
  @ApiOperation({ summary: 'Get customer by ID (Super Admin & Customer Admin only)' })
  @ApiResponse({ status: 200, description: 'Customer retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({ status: 403, description: 'Access denied - Super Admin or Customer Admin required' })
  async getCustomerById(@Param('id') customerId: string) {
    return await this.adminService.getCustomerById(customerId);
  }

  @Post('customers/:id/block')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(ADMIN_PERMISSIONS.SUPER_ADMIN, ADMIN_PERMISSIONS.CUSTOMER_ADMIN)
  @ApiOperation({ summary: 'Block customer (Super Admin & Customer Admin only)' })
  @ApiResponse({ status: 200, description: 'Customer blocked successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({ status: 403, description: 'Access denied - Super Admin or Customer Admin required' })
  async blockCustomer(
    @Param('id') customerId: string,
    @Request() req: any,
  ) {
    const adminId = req.user.id;
    return await this.adminService.blockCustomer(customerId, adminId);
  }

  @Post('customers/:id/unblock')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(ADMIN_PERMISSIONS.SUPER_ADMIN, ADMIN_PERMISSIONS.CUSTOMER_ADMIN)
  @ApiOperation({ summary: 'Unblock customer (Super Admin & Customer Admin only)' })
  @ApiResponse({ status: 200, description: 'Customer unblocked successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({ status: 403, description: 'Access denied - Super Admin or Customer Admin required' })
  async unblockCustomer(
    @Param('id') customerId: string,
    @Request() req: any,
  ) {
    const adminId = req.user.id;
    return await this.adminService.unblockCustomer(customerId, adminId);
  }

  /* 
  =======================================
  Public Admin Setup Endpoints (No Auth Required)
  ========================================
  */
  @Public()
  @Get('setup/validate')
  @ApiOperation({ summary: 'Validate admin invitation token (Public endpoint)' })
  @ApiQuery({ name: 'token', description: 'Invitation token from email' })
  @ApiQuery({ name: 'email', description: 'Email address from invitation' })
  @ApiResponse({ status: 200, description: 'Invitation validation result' })
  @ApiResponse({ status: 404, description: 'Invitation not found' })
  async validateInvitation(
    @Query('token') token: string,
    @Query('email') email: string,
  ) {
    const validateDto: ValidateInvitationDto = {
      invitationToken: token,
      email: email,
    };
    
    return await this.adminService.validateInvitation(validateDto);
  }

  @Public()
  @Post('setup/password')
  @ApiOperation({ summary: 'Setup admin password using invitation token (Public endpoint)' })
  @ApiResponse({ status: 201, description: 'Admin account created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request or invitation expired' })
  @ApiResponse({ status: 404, description: 'Invitation not found' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async setupAdminPassword(@Body() setupDto: SetupAdminPasswordDto) {
    return await this.adminService.setupAdminPassword(setupDto);
  }

  /* 
  =======================================
  Admin Management Endpoints
  ========================================
  */

  @Get('admins')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(ADMIN_PERMISSIONS.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all admins with pagination and filters (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Admins retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied - Super Admin required' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by username or email' })
  @ApiQuery({ name: 'department', required: false, type: String, description: 'Filter by department' })
  @ApiQuery({ name: 'accessLevel', required: false, enum: ['super_admin', 'store_admin', 'vendor_admin', 'customer_admin'], description: 'Filter by access level' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' })
  async getAllAdmins(@Query() queryDto: QueryAdminsDto) {
    return await this.adminService.getAllAdmins(queryDto);
  }

  @Get('admins/:id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(ADMIN_PERMISSIONS.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get admin by ID (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Admin retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied - Super Admin required' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @ApiParam({ name: 'id', description: 'Admin ID' })
  async getAdminById(@Param('id') id: string) {
    return await this.adminService.getAdminById(id);
  }

  @Post('admins')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(ADMIN_PERMISSIONS.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create new admin (Super Admin only)' })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied - Super Admin required' })
  @ApiResponse({ status: 409, description: 'Email or username already exists' })
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return await this.adminService.createAdmin(createAdminDto);
  }

  @Put('admins/:id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(ADMIN_PERMISSIONS.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update admin profile (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Admin updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied - Super Admin required' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @ApiParam({ name: 'id', description: 'Admin ID' })
  async updateAdmin(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return await this.adminService.updateAdmin(id, updateAdminDto);
  }

  @Delete('admins/:id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(ADMIN_PERMISSIONS.SUPER_ADMIN)
  @ApiOperation({ summary: 'Deactivate admin (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Admin deactivated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Access denied - Super Admin required' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  @ApiParam({ name: 'id', description: 'Admin ID' })
  async deactivateAdmin(@Param('id') id: string) {
    return await this.adminService.deactivateAdmin(id);
  }
}
