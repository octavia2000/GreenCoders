import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { VendorService } from './vendors.service';
import { QueryVendorsDto } from './dto/query-vendors.dto';
import { UpdateVendorProfileDto } from './dto/update-vendor-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

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
  @Roles('ADMIN') // Only admins can access vendor dashboard stats
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get vendor dashboard statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication cookie' })
  @ApiResponse({ status: 403, description: 'Access denied - Admin role required' })
  async getDashboard() {
    return this.vendorsService.getVendorDashboard();
  }

  /* 
  =======================================
  Get All Vendors (Admin only)
  ========================================
  */
  @Get('all')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get all vendors with pagination and filters (Admin only)' })
  @ApiResponse({ status: 200, description: 'Vendors retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication cookie' })
  @ApiResponse({ status: 403, description: 'Access denied - Admin role required' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'isVerified', required: false, type: Boolean, description: 'Filter by verification status' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by username or email' })
  async getAllVendors(@Query() queryDto: QueryVendorsDto) {
    return this.vendorsService.getAllVendors(queryDto);
  }

  /* 
  =======================================
  Get Vendor by ID (Admin only)
  ========================================
  */
  @Get(':id')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get vendor by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Vendor retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication cookie' })
  @ApiResponse({ status: 403, description: 'Access denied - Admin role required' })
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
  @Roles('VENDOR') 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Update vendor profile (Vendor only)' })
  @ApiResponse({ status: 200, description: 'Vendor profile updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication cookie' })
  @ApiResponse({ status: 403, description: 'Access denied - Vendor role required' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async updateProfile(@Body() updateVendorDto: UpdateVendorProfileDto, @Request() req) {
    return this.vendorsService.updateVendorProfile(req.user.id, updateVendorDto);
  }

  /* 
  =======================================
  Verify Vendor (Admin only)
  ========================================
  */
  @Put(':id/verify')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Verify vendor (Admin only)' })
  @ApiResponse({ status: 200, description: 'Vendor verified successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication cookie' })
  @ApiResponse({ status: 403, description: 'Access denied - Admin role required' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async verifyVendor(@Param('id') id: string, @Request() req) {
    return this.vendorsService.verifyVendor(id, req.user.id);
  }

  /* 
  =======================================
  Reject Vendor Verification (Admin only)
  ========================================
  */
  @Put(':id/reject')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Reject vendor verification (Admin only)' })
  @ApiResponse({ status: 200, description: 'Vendor verification rejected' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication cookie' })
  @ApiResponse({ status: 403, description: 'Access denied - Admin role required' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async rejectVendorVerification(@Param('id') id: string, @Body() body: { reason: string }, @Request() req) {
    return this.vendorsService.rejectVendorVerification(id, body.reason);
  }
}