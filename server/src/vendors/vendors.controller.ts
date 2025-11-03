import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { VendorService } from './vendors.service';
import { QueryVendorsDto } from './dto/query-vendors.dto';
import { UpdateVendorProfileDto } from './dto/update-vendor-profile.dto';
import { SubmitBusinessVerificationDto } from './dto/submit-business-verification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/types/auth-response.types';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { ADMIN_PERMISSIONS } from '../admin/constants/admin-permissions';
import {
  RateLimitGuard,
  RateLimit,
  RATE_LIMITS,
} from '../shared/guards/rate-limit.guard';

@ApiTags('Vendor')
@Controller('vendor')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VendorsController {
  constructor(private readonly vendorsService: VendorService) {}

  /* 
  =======================================
  Get Vendor Dashboard Stats (Admin only)
  ========================================
  */
  @Get('dashboard')
  @Roles(Role.ADMIN)
  @RequirePermissions(ADMIN_PERMISSIONS.SUPER_ADMIN, ADMIN_PERMISSIONS.VENDOR_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard, RateLimitGuard)
  @RateLimit(RATE_LIMITS.MODERATE)
  @ApiOperation({ summary: 'Get vendor dashboard statistics (Admin only)' })
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
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async getDashboard() {
    return this.vendorsService.getVendorDashboard();
  }

  /* 
  =======================================
  Get My Vendor Profile (Vendor only)
  ========================================
  */
  @Get('profile')
  @Roles(Role.VENDOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get current vendor profile (Vendor only)' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication cookie',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - Vendor role required',
  })
  async getMyProfile(@Request() req) {
    return this.vendorsService.getSelfVendorProfile(req.user.id);
  }

  /* 
  =======================================
  Get All Vendors (Admin only)
  ========================================
  */
  @Get('all-vendors')
  @Roles(Role.ADMIN)
  @RequirePermissions(ADMIN_PERMISSIONS.SUPER_ADMIN, ADMIN_PERMISSIONS.VENDOR_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard, RateLimitGuard)
  @RateLimit(RATE_LIMITS.MODERATE)
  @ApiOperation({
    summary: 'Get all vendors with pagination and filters (Admin only)',
  })
  @ApiResponse({ status: 200, description: 'Vendors retrieved successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication cookie',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - Admin role required',
  })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'isVerified',
    required: false,
    type: Boolean,
    description: 'Filter by verification status',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Filter by active status',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by username or email',
  })
  async getAllVendors(@Query() queryDto: QueryVendorsDto) {
    return this.vendorsService.getAllVendors(queryDto);
  }

  /* 
  =======================================
  Get Vendor Verification Status
  ========================================
  */
  @Get('verification/status')
  @Roles(Role.VENDOR)
  @ApiOperation({ summary: 'Get vendor verification status (Vendor only)' })
  @ApiResponse({ status: 200, description: 'Verification status retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Access denied - Vendor role required' })
  async getVendorVerificationStatus(@Request() req) {
    return this.vendorsService.getVendorVerificationStatus(req.user.id);
  }

  /* 
  =======================================
  Get Vendor by ID (Admin only)
  ========================================
  */
  @Get(':id')
  @Roles(Role.ADMIN)
  @RequirePermissions(ADMIN_PERMISSIONS.SUPER_ADMIN, ADMIN_PERMISSIONS.VENDOR_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @ApiOperation({ summary: 'Get vendor by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Vendor retrieved successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication cookie',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - Admin role required',
  })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async getVendorById(@Param('id') id: string) {
    return this.vendorsService.getVendorById(id);
  }

  /* 
  =======================================
  Update Vendor Profile
  ========================================
  */
  @Put('profile')
  @Roles(Role.VENDOR)
  @UseGuards(JwtAuthGuard, RolesGuard, RateLimitGuard)
  @RateLimit(RATE_LIMITS.VENDOR_PROFILE_UPDATE)
  @ApiOperation({ summary: 'Update vendor profile (Vendor only)' })
  @ApiResponse({
    status: 200,
    description: 'Vendor profile updated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication cookie',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - Vendor role required',
  })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async updateProfile(
    @Body() updateVendorDto: UpdateVendorProfileDto,
    @Request() req,
  ) {
    return this.vendorsService.updateVendorProfile(
      req.user.id,
      updateVendorDto,
    );
  }

  /* 
  =======================================
  Submit Business Verification
  ========================================
  */
  @Post('verification/submit')
  @Roles(Role.VENDOR)
  @UseGuards(RateLimitGuard)
  @RateLimit(RATE_LIMITS.STRICT)
  @ApiOperation({ summary: 'Submit business verification (Vendor only)' })
  @ApiResponse({ status: 201, description: 'Business verification submitted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Access denied - Vendor role required' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async submitBusinessVerification(
    @Body() verificationDto: SubmitBusinessVerificationDto,
    @Request() req,
  ) {
    return this.vendorsService.submitBusinessVerification(req.user.id, verificationDto);
  }

}
