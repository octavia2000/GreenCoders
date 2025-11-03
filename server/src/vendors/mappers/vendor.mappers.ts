import { UserEntity } from '../../database/entities/user.entity';
import {
  VendorBasicResponse,
  VendorProfileResponse,
  VendorVerificationResponse,
} from '../types/vendor-response.types';

/**
 * Maps UserEntity to VendorBasicResponse
 * Used for basic vendor information display
 */
export function mapVendorToBasicResponse(
  vendor: UserEntity,
): VendorBasicResponse {
  return {
    id: vendor.id,
    username: vendor.username,
    email: vendor.email,
    phoneNumber: vendor.phoneNumber,
    firstName: vendor.firstName,
    lastName: vendor.lastName,
    profileImageUrl: vendor.profileImageUrl,
    isNumberVerified: vendor.isNumberVerified,
    isActive: vendor.isActive,
    isVerified: vendor.isVerified || false,
    verifiedAt: vendor.verifiedAt,
    verifiedBy: vendor.verifiedBy,
    createdAt: vendor.createdAt,
  };
}

/**
 * Maps UserEntity to VendorProfileResponse
 * Used for detailed vendor profile information
 */
export function mapVendorToProfileResponse(
  vendor: UserEntity,
): VendorProfileResponse {
  return {
    id: vendor.id,
    username: vendor.username,
    email: vendor.email,
    phoneNumber: vendor.phoneNumber,
    firstName: vendor.firstName,
    lastName: vendor.lastName,
    profileImageUrl: vendor.profileImageUrl,
    isNumberVerified: vendor.isNumberVerified,
    isActive: vendor.isActive,
    isVerified: vendor.isVerified,
    verifiedAt: vendor.verifiedAt,
    verifiedBy: vendor.verifiedBy,
    createdAt: vendor.createdAt,
  };
}

/**
 * Maps UserEntity to VendorVerificationResponse
 * Used for vendor verification operations
 */
export function mapVendorToVerificationResponse(
  vendor: UserEntity,
): VendorVerificationResponse {
  return {
    id: vendor.id,
    firstName: vendor.firstName,
    lastName: vendor.lastName,
    isVerified: vendor.isVerified || false,
    verifiedAt: vendor.verifiedAt,
    verifiedBy: vendor.verifiedBy,
  };
}

/**
 * Maps array of UserEntity to array of VendorBasicResponse
 * Used for bulk operations
 */
export function mapVendorsToBasicResponse(
  vendors: UserEntity[],
): VendorBasicResponse[] {
  return vendors.map((vendor) => mapVendorToBasicResponse(vendor));
}

/**
 * Maps array of UserEntity to array of VendorProfileResponse
 * Used for bulk profile operations
 */
export function mapVendorsToProfileResponse(
  vendors: UserEntity[],
): VendorProfileResponse[] {
  return vendors.map((vendor) => mapVendorToProfileResponse(vendor));
}

/**
 * Maps array of UserEntity to array of VendorVerificationResponse
 * Used for bulk verification operations
 */
export function mapVendorsToVerificationResponse(
  vendors: UserEntity[],
): VendorVerificationResponse[] {
  return vendors.map((vendor) => mapVendorToVerificationResponse(vendor));
}

