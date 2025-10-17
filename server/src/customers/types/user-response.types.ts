import { HttpStatus } from '@nestjs/common';

export type Role = 'CUSTOMER' | 'VENDOR' | 'ADMIN';

export interface BaseResponse<T = any> {
  statusCode: HttpStatus;
  message: string;
  data: T;
}

export interface UserBasicResponse {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  phoneNumber: string;
  authMethod: 'email' | 'google';
  role: Role;
  isActive: boolean;
  isNumberVerified: boolean;
  createdAt: string;
}

export interface ProfileSettingsResponse {
  user: UserBasicResponse;
  lastLoginAt?: string;
}

export interface AdminBasicResponse {
  id: string;
  firstName?: string;
  lastName?: string;
  department?: string;
  accessLevel: 'super_admin' | 'admin' | 'moderator';
}

export interface VendorVerificationResponse {
  id: string;
  firstName?: string;
  lastName?: string;
  isVerified: boolean;
  verifiedAt?: Date;
  verifiedBy?: string; // Admin ID who verified
}

/**
 * Pagination metadata
 * Use with paginated responses
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedUsersResponse {
  users: UserBasicResponse[];
  total: number;
  page: number;
  limit: number;
}