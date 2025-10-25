export const USER_PUBLIC_FIELDS = [
  'user.id',
  'user.email',
  'user.username',
  'user.phoneNumber',
  'user.isNumberVerified',
  'user.role',
  'user.isActive',
  'user.lastLoginAt',
  'user.createdAt',
  'user.updatedAt',
] as const;

export const USER_BASIC_FIELDS = [
  'user.id',
  'user.email',
  'user.username',
  'user.isNumberVerified',
  'user.role',
  'user.isActive',
  'user.createdAt',
] as const;

export const USER_AUTH_FIELDS = [
  ...USER_BASIC_FIELDS,
  'user.password',
  'user.phoneOtp',
  'user.otpExpiresAt',
  'user.resetPassword',
  'user.resetPasswordExpiresAt',
] as const;

export const CUSTOMER_PROFILE_FIELDS = [
  'customerProfile.id',
  'customerProfile.firstName',
  'customerProfile.lastName',
  'customerProfile.profileImageUrl',
  'customerProfile.dateOfBirth',
  'customerProfile.gender',
  'customerProfile.address',
  'customerProfile.city',
  'customerProfile.state',
  'customerProfile.country',
  'customerProfile.postalCode',
] as const;

export const VENDOR_PROFILE_FIELDS = [
  'vendorProfile.id',
  'vendorProfile.firstName',
  'vendorProfile.lastName',
  'vendorProfile.profileImageUrl',
  'vendorProfile.companyName',
  'vendorProfile.businessRegistrationNumber',
  'vendorProfile.businessType',
  'vendorProfile.isVerified',
  'vendorProfile.verifiedAt',
] as const;

export const ADMIN_PROFILE_FIELDS = [
  'adminProfile.id',
  'adminProfile.firstName',
  'adminProfile.lastName',
  'adminProfile.profileImageUrl',
  'adminProfile.department',
  'adminProfile.accessLevel',
  'adminProfile.employeeId',
  'adminProfile.jobTitle',
] as const;
