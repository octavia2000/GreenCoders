import { HttpStatus } from '@nestjs/common';

export interface BaseResponse<T = any> {
  statusCode: HttpStatus;
  message: string;
  data: T;
}

export interface AdminDashboardStats {
  totalVendors: number;
  totalAdmins: number;
  totalUsers: number;
  recentVendors: any[];
}

export interface AdminInvitationResponse {
  id: string;
  email: string;
  adminType: string;
  status: string;
  department?: string;
  invitedByName: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface AdminInvitationsListResponse {
  invitations: AdminInvitationResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface CustomerDetailsResponse {
  id: string;
  email: string;
  username: string;
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  isNumberVerified: boolean;
  authMethod: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminResponse {
  id: string;
  firstName?: string;
  lastName?: string;
  department?: string;
  accessLevel: 'super_admin' | 'store_admin' | 'vendor_admin' | 'customer_admin';
  employeeId?: string;
  jobTitle?: string;
  reportingManager?: string;
  assignedModules?: string[];
  workingHours?: any;
  officeLocation?: string;
  officePhoneNumber?: string;
  emergencyContact?: string;
  emergencyContactDetails?: any;
  isActive: boolean;
  lastLoginAt?: Date;
  lastActivityAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedAdminsResponse {
  items: AdminResponse[];
  meta: PaginationMeta;
}

export interface AdminBasicResponse {
  id: string;
  firstName?: string;
  lastName?: string;
  department?: string;
  accessLevel: 'super_admin' | 'store_admin' | 'vendor_admin' | 'customer_admin';
}
