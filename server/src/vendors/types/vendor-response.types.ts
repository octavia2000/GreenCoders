import { HttpStatus } from '@nestjs/common';

export interface BaseResponse<T = any> {
  statusCode: HttpStatus;
  message: string;
  data: T;
}

export interface VendorBasicResponse {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  isNumberVerified: boolean;
  isActive?: boolean;
  isVerified?: boolean;
  verifiedAt?: Date | null;
  verifiedBy?: string | null;
  createdAt: Date | string;
}

export interface PaginatedVendorsResponse {
  vendors: VendorBasicResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface VendorVerificationResponse {
  id: string;
  firstName?: string;
  lastName?: string;
  isVerified: boolean;
  verifiedAt?: Date;
  verifiedBy?: string; // Admin ID who verified
}

export interface VendorDashboardStats {
  totalVendors: number;
  verifiedVendors: number;
  pendingVerification: number;
  recentVendors: VendorBasicResponse[];
}

export interface VendorProfileResponse {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  isNumberVerified: boolean;
  isActive?: boolean;
  isVerified?: boolean;
  verifiedAt?: Date | null;
  verifiedBy?: string | null;
  createdAt: Date | string;
}

export interface VendorUpdateResponse {
  vendorId: string;
  message: string;
}

export interface VendorVerificationUpdateResponse {
  vendorId: string;
  message: string;
}

export interface VendorRejectionResponse {
  vendorId: string;
  reason: string;
  message: string;
}

// Additional response types for better API documentation
export interface VendorExistsResponse {
  exists: boolean;
  vendorId: string;
}

export interface VendorCountResponse {
  count: number;
  filter?: {
    isVerified?: boolean;
    isActive?: boolean;
  };
}
