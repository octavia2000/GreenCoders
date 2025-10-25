import { HttpStatus } from '@nestjs/common';
import { Role } from '../../auth/types/auth-response.types';

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

export interface CustomerProfileResponse {
  customer: UserBasicResponse;
  lastLoginAt?: string;
}
export interface CustomerBasicResponse {
  customer: UserBasicResponse;
}
export type ProfileSettingsResponse = CustomerBasicResponse;

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

export interface CustomerListItemResponse {
  id: string;
  email: string;
  username: string;
  profileImageUrl?: string;
  isActive: boolean;
}

export interface CustomerListResponse {
  customer: CustomerListItemResponse;
}

export interface PaginatedCustomersListResponse {
  customers: CustomerListResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface ChangePasswordResponse {
  success: boolean;
}

export interface CustomersListResponse {
  customers: CustomerListResponse[];
  total: number;
  page: number;
  limit: number;
}
