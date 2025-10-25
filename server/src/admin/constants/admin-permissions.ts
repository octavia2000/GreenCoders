// Admin Permission Constants
export enum AdminPermission {
  // Super Admin - Full access
  MANAGE_ALL_ADMINS = 'manage_all_admins',
  MANAGE_SYSTEM_SETTINGS = 'manage_system_settings',
  VIEW_ALL_ANALYTICS = 'view_all_analytics',
  
  // Store Admin - Store management
  MANAGE_STORES = 'manage_stores',
  MANAGE_STORE_ADMINS = 'manage_store_admins',
  VIEW_STORE_ANALYTICS = 'view_store_analytics',
  MANAGE_STORE_PRODUCTS = 'manage_store_products',
  MANAGE_STORE_ORDERS = 'manage_store_orders',
  
  // Vendor Admin - Vendor management
  APPROVE_VENDORS = 'approve_vendors',
  MANAGE_VENDOR_VERIFICATION = 'manage_vendor_verification',
  VIEW_VENDOR_ANALYTICS = 'view_vendor_analytics',
  MANAGE_VENDOR_PROFILES = 'manage_vendor_profiles',
  SUSPEND_VENDORS = 'suspend_vendors',
  
  // Customer Admin - Customer management
  MANAGE_CUSTOMERS = 'manage_customers',
  VIEW_CUSTOMER_DETAILS = 'view_customer_details',
  BLOCK_CUSTOMERS = 'block_customers',
  VIEW_CUSTOMER_ANALYTICS = 'view_customer_analytics',
  MANAGE_CUSTOMER_SUPPORT = 'manage_customer_support',
}

// Admin Types
export enum AdminType {
  SUPER_ADMIN = 'super_admin',
  STORE_ADMIN = 'store_admin',
  VENDOR_ADMIN = 'vendor_admin',
  CUSTOMER_ADMIN = 'customer_admin',
}

// Permission groups for different admin types
export const ADMIN_PERMISSIONS = {
  SUPER_ADMIN: [
    AdminPermission.MANAGE_ALL_ADMINS,
    AdminPermission.MANAGE_SYSTEM_SETTINGS,
    AdminPermission.VIEW_ALL_ANALYTICS,
    AdminPermission.MANAGE_STORES,
    AdminPermission.MANAGE_STORE_ADMINS,
    AdminPermission.VIEW_STORE_ANALYTICS,
    AdminPermission.MANAGE_STORE_PRODUCTS,
    AdminPermission.MANAGE_STORE_ORDERS,
    AdminPermission.APPROVE_VENDORS,
    AdminPermission.MANAGE_VENDOR_VERIFICATION,
    AdminPermission.VIEW_VENDOR_ANALYTICS,
    AdminPermission.MANAGE_VENDOR_PROFILES,
    AdminPermission.SUSPEND_VENDORS,
    AdminPermission.MANAGE_CUSTOMERS,
    AdminPermission.VIEW_CUSTOMER_DETAILS,
    AdminPermission.BLOCK_CUSTOMERS,
    AdminPermission.VIEW_CUSTOMER_ANALYTICS,
    AdminPermission.MANAGE_CUSTOMER_SUPPORT,
  ],
  
  STORE_ADMIN: [
    AdminPermission.MANAGE_STORES,
    AdminPermission.MANAGE_STORE_ADMINS,
    AdminPermission.VIEW_STORE_ANALYTICS,
    AdminPermission.MANAGE_STORE_PRODUCTS,
    AdminPermission.MANAGE_STORE_ORDERS,
  ],
  
  VENDOR_ADMIN: [
    AdminPermission.APPROVE_VENDORS,
    AdminPermission.MANAGE_VENDOR_VERIFICATION,
    AdminPermission.VIEW_VENDOR_ANALYTICS,
    AdminPermission.MANAGE_VENDOR_PROFILES,
    AdminPermission.SUSPEND_VENDORS,
  ],
  
  CUSTOMER_ADMIN: [
    AdminPermission.MANAGE_CUSTOMERS,
    AdminPermission.VIEW_CUSTOMER_DETAILS,
    AdminPermission.BLOCK_CUSTOMERS,
    AdminPermission.VIEW_CUSTOMER_ANALYTICS,
    AdminPermission.MANAGE_CUSTOMER_SUPPORT,
  ],
};

// Helper function to get permissions for admin type
export function getPermissionsForAdminType(adminType: string): AdminPermission[] {
  switch (adminType) {
    case AdminType.SUPER_ADMIN:
      return ADMIN_PERMISSIONS.SUPER_ADMIN;
    case AdminType.STORE_ADMIN:
      return ADMIN_PERMISSIONS.STORE_ADMIN;
    case AdminType.VENDOR_ADMIN:
      return ADMIN_PERMISSIONS.VENDOR_ADMIN;
    case AdminType.CUSTOMER_ADMIN:
      return ADMIN_PERMISSIONS.CUSTOMER_ADMIN;
    default:
      return [];
  }
}

// Helper function to check if admin has specific permission
export function hasPermission(
  adminPermissions: string[],
  requiredPermission: AdminPermission
): boolean {
  return adminPermissions.includes(requiredPermission);
}

// Helper function to check if admin type has permission
export function adminTypeHasPermission(
  adminType: string,
  requiredPermission: AdminPermission
): boolean {
  const permissions = getPermissionsForAdminType(adminType);
  return permissions.includes(requiredPermission);
}

// Helper function to check if admin type is allowed for endpoint
export function isAdminTypeAllowed(
  adminType: string,
  allowedTypes: AdminType[]
): boolean {
  return allowedTypes.includes(adminType as AdminType);
}
