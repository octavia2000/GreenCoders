import {
  Controller,
  Get,
  Param,
  Query,
  HttpCode,
  Request,
  Put,
  Body,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { QueryUsersDto } from './dto/query-users.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/types/auth-response.types';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { ADMIN_PERMISSIONS } from '../admin/constants/admin-permissions';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  /* 
  =======================================
  Get All Customers (Admin only)
  ========================================
  */
  @Get()
  @Roles(Role.ADMIN)
  @RequirePermissions(ADMIN_PERMISSIONS.SUPER_ADMIN, ADMIN_PERMISSIONS.CUSTOMER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get all customers with pagination and filters (Admin only)',
  })
  @ApiResponse({ status: 200, description: 'Customers retrieved successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication cookie',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - Admin role required',
  })
  async getAllCustomers(@Query() queryDto: QueryUsersDto) {
    return this.customersService.getAllCustomers(queryDto);
  }

  /* 
  =======================================
  Get Current Customer Profile
  ========================================
  */
  @Get('profile')
  @Roles(Role.CUSTOMER)
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get current customer profile (includes authMethod for settings)',
  })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication cookie',
  })
  async getProfile(@Request() req) {
    return this.customersService.getCustomerProfile(req.user.id);
  }

  /* 
  =======================================
  Update Customer Profile (username, name, picture)
  ========================================
  */
  @Patch('profile')
  @Roles(Role.CUSTOMER)
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiOperation({
    summary: 'Update customer profile (username, name, picture)',
  })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({
    status: 400,
    description: 'Username already taken or validation error',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication cookie',
  })
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.customersService.updateProfile(req.user.id, updateProfileDto);
  }

  /* 
  =======================================
  Change Customer Password (Only for email auth users)
  ========================================
  */
  @Put('change-password')
  @Roles(Role.CUSTOMER)
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Change customer password (only for email/password users, not Google)',
  })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({
    status: 400,
    description: 'Cannot change password for Google auth users',
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized - Invalid or missing authentication cookie or incorrect current password',
  })
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.customersService.changePassword(req.user.id, changePasswordDto);
  }

  /* 
  =======================================
  Get Customer By Id 
  ========================================
  */
  @Get(':id')
  @Roles(Role.ADMIN)
  @RequirePermissions(ADMIN_PERMISSIONS.SUPER_ADMIN, ADMIN_PERMISSIONS.CUSTOMER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'Get a customer by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Customer retrieved successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication cookie',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - Admin role required',
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  async getCustomerById(@Param('id') id: string) {
    return this.customersService.getCustomerById(id);
  }
}
