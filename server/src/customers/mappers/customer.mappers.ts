import { UserEntity } from '../../database/entities/user.entity';
import {
  CustomerListResponse,
  UserBasicResponse,
  ProfileSettingsResponse,
  CustomerProfileResponse,
} from '../types/customer-response.types';

/* 
=======================================
Map To Customer List Item
=======================================
*/
export function mapToCustomerList(user: UserEntity): CustomerListResponse {
  return {
    customer: {
      id: user.id,
      email: user.email,
      username: user.username,
      profileImageUrl: user.profileImageUrl,
      isActive: user.isActive,
    },
  };
}

/* 
=======================================
Map To Customer Response
=======================================
*/
export function mapToCustomerResponse(
  user: UserEntity,
): CustomerProfileResponse {
  return {
    customer: {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
      phoneNumber: user.phoneNumber,
      authMethod: user.authMethod as 'email' | 'google',
      isNumberVerified: user.isNumberVerified,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
    },
    lastLoginAt: user.lastLoginAt?.toISOString(),
  };
}
/* 
=======================================
Map To CustomerBasic Response
=======================================
*/
export function mapToCustomerBasicResponse(
  user: UserEntity,
): CustomerProfileResponse {
  return {
    customer: {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
      phoneNumber: user.phoneNumber,
      authMethod: user.authMethod as 'email' | 'google',
      isNumberVerified: user.isNumberVerified,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
    },
  };
}

/* 
=======================================
Map To User Basic Response
=======================================
*/
export function mapToUserBasicResponse(user: UserEntity): UserBasicResponse {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImageUrl: user.profileImageUrl,
    phoneNumber: user.phoneNumber,
    authMethod: user.authMethod as 'email' | 'google',
    isNumberVerified: user.isNumberVerified,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
  };
}

/* 
=======================================
Map To CustomerProfile Settings
=======================================
*/
export function mapToProfileSettings(
  user: UserEntity,
): ProfileSettingsResponse {
  return mapToCustomerBasicResponse(user);
}
