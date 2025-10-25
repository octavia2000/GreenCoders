/**
 * Predefined select fields for Vendor queries
 * Prevents code duplication and ensures consistency
 */

export const VENDOR_BASIC_FIELDS = [
  'id',
  'email',
  'username',
  'phoneNumber',
  'isNumberVerified',
  'isActive',
  'createdAt',
] as string[];

export const VENDOR_PROFILE_FIELDS = [
  'id',
  'firstName',
  'lastName',
  'profileImageUrl',
  'isVerified',
  'verifiedAt',
  'verifiedBy',
] as string[];

// Additional field sets for different use cases
export const VENDOR_DASHBOARD_FIELDS = [
  'id',
  'username',
  'email',
  'isVerified',
  'createdAt',
] as string[];

export const VENDOR_VERIFICATION_FIELDS = [
  'id',
  'email',
  'username',
  'isVerified',
  'verifiedAt',
  'verifiedBy',
] as string[];
