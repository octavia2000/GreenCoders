import { Controller, Get, Param, Query, HttpCode, Request, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpdateProfileDto, ChangePasswordDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

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
  @Roles('ADMIN') 
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all customers with pagination and filters (Admin only)' })
  @ApiResponse({ status: 200, description: 'Customers retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication cookie' })
  @ApiResponse({ status: 403, description: 'Access denied - Admin role required' })
  async getAllCustomers(@Query() queryDto: QueryUsersDto) {
    return this.customersService.getAllCustomers(queryDto);
  }

  /* 
  =======================================
  Get Current Customer Profile
  ========================================
  */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'Get current customer profile (includes authMethod for settings)' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication cookie' })
  async getProfile(@Request() req) {
    return this.customersService.getUserProfile(req.user.id);
  }

  /* 
  =======================================
  Update Customer Profile (username, name, picture)
  ========================================
  */
  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'Update customer profile (username, name, picture)' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 400, description: 'Username already taken or validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication cookie' })
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.customersService.updateProfile(req.user.id, updateProfileDto);
  }

  /* 
  =======================================
  Change Customer Password (Only for email auth users)
  ========================================
  */
  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'Change customer password (only for email/password users, not Google)' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Cannot change password for Google auth users' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication cookie or incorrect current password' })
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.customersService.changePassword(req.user.id, changePasswordDto);
  }

  /* 
  =======================================
  Get Customer By Id (Admin only)
  ========================================
  */
  @Get(':id')
  @Roles('ADMIN') // Only admins can get any customer by ID
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'Get a customer by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Customer retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication cookie' })
  @ApiResponse({ status: 403, description: 'Access denied - Admin role required' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  async getUserById(@Param('id') id: string) {
    return this.customersService.getUserById(id);
  }
}
