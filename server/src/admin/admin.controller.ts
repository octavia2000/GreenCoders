import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Admin')
@Controller('admin')
@Roles('ADMIN') // Only admins can access admin routes
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /* 
  =======================================
  Get Admin Dashboard
  ========================================
  */
  @Get('dashboard')
  @ApiOperation({ summary: 'Get admin dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication cookie' })
  @ApiResponse({ status: 403, description: 'Access denied - Admin role required' })
  async getDashboard() {
    return this.adminService.getAdminDashboard();
  }

  /* 
  =======================================
  Get All Customers
  ========================================
  */
  @Get('customers')
  @ApiOperation({ summary: 'Get all customers (Admin only)' })
  @ApiResponse({ status: 200, description: 'Customers retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication cookie' })
  @ApiResponse({ status: 403, description: 'Access denied - Admin role required' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by username or email' })
  async getAllCustomers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('isActive') isActive?: boolean,
    @Query('search') search?: string,
  ) {
    return this.adminService.getAllCustomers(page, limit, isActive, search);
  }

  /* 
  =======================================
  Get Customer by ID
  ========================================
  */
  @Get('customers/:id')
  @ApiOperation({ summary: 'Get customer by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Customer retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication cookie' })
  @ApiResponse({ status: 403, description: 'Access denied - Admin role required' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  async getCustomerById(@Param('id') id: string) {
    return this.adminService.getCustomerById(id);
  }

  /* 
  =======================================
  Get All Vendors
  ========================================
  */
  @Get('vendors')
  @ApiOperation({ summary: 'Get all vendors (Admin only)' })
  @ApiResponse({ status: 200, description: 'Vendors retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication cookie' })
  @ApiResponse({ status: 403, description: 'Access denied - Admin role required' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'isVerified', required: false, type: Boolean, description: 'Filter by verification status' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by username or email' })
  async getAllVendors(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('isVerified') isVerified?: boolean,
    @Query('isActive') isActive?: boolean,
    @Query('search') search?: string,
  ) {
    return this.adminService.getAllVendors(page, limit, isVerified, isActive, search);
  }

  /* 
  =======================================
  Get Vendor by ID
  ========================================
  */
  @Get('vendors/:id')
  @ApiOperation({ summary: 'Get vendor by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Vendor retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication cookie' })
  @ApiResponse({ status: 403, description: 'Access denied - Admin role required' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  @ApiParam({ name: 'id', description: 'Vendor ID' })
  async getVendorById(@Param('id') id: string) {
    return this.adminService.getVendorById(id);
  }

  /* 
  =======================================
  Verify Vendor
  ========================================
  */
  @Put('vendors/:id/verify')
  @ApiOperation({ summary: 'Verify vendor (Admin only)' })
  @ApiResponse({ status: 200, description: 'Vendor verified successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication cookie' })
  @ApiResponse({ status: 403, description: 'Access denied - Admin role required' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  @ApiParam({ name: 'id', description: 'Vendor ID' })
  async verifyVendor(@Param('id') id: string, @Request() req) {
    return this.adminService.verifyVendor(id, req.user.id);
  }

  /* 
  =======================================
  Reject Vendor Verification
  ========================================
  */
  @Put('vendors/:id/reject')
  @ApiOperation({ summary: 'Reject vendor verification (Admin only)' })
  @ApiResponse({ status: 200, description: 'Vendor verification rejected' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication cookie' })
  @ApiResponse({ status: 403, description: 'Access denied - Admin role required' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  @ApiParam({ name: 'id', description: 'Vendor ID' })
  async rejectVendorVerification(@Param('id') id: string, @Body() body: { reason: string }, @Request() req) {
    return this.adminService.rejectVendorVerification(id, body.reason);
  }
}
