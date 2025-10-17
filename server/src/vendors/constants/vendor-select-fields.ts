/**
 * Predefined select fields for Vendor queries
 * Prevents code duplication and ensures consistency
 */

export const VENDOR_BASIC_FIELDS = [
  'user.id',
  'user.email',
  'user.username',
  'user.phoneNumber',
  'user.isNumberVerified',
  'user.isActive',
  'user.createdAt',
] as const;

export const VENDOR_PROFILE_FIELDS = [
  'vendorProfile.id',
  'vendorProfile.firstName',
  'vendorProfile.lastName',
  'vendorProfile.profileImageUrl',
  'vendorProfile.isVerified',
  'vendorProfile.verifiedAt',
  'vendorProfile.verifiedBy',
] as const;


