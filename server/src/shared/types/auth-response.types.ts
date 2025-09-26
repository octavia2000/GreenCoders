import { HttpStatus } from '@nestjs/common';

export interface BaseResponse<T = any> {
  statusCode: HttpStatus;
  message: string;
  data: T;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  isNumberVerified: boolean;
  createdAt: string;
}

export interface LoginResponse {
  user: UserResponse;
}

export interface RegisterResponse {
  user: UserResponse;
  message: string;
}

export interface OtpResponse {
  phoneNumber: string;
  message: string;
}

export interface OtpVerificationResponse {
  message: string;
}

export interface TokenValidationResponse {
  isValid: boolean;
  user: UserResponse | null;
}

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedUsersResponse {
  items: UserResponse[];
  meta: PaginationMeta;
}
