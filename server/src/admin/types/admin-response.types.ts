import { HttpStatus } from '@nestjs/common';

export interface BaseResponse<T = any> {
  statusCode: HttpStatus;
  message: string;
  data: T;
}

export interface AdminResponse {
  id: string;
  department?: string;
  permissions?: string[];
  accessLevel: string;
  employeeId?: string;
  jobTitle?: string;
  reportingManager?: string;
  assignedModules?: string[];
  workingHours?: any;
  officeLocation?: string;
  officePhoneNumber?: string;
  emergencyContact?: string;
  emergencyContactDetails?: any;
  isActive: boolean;
  lastLoginAt?: Date;
  lastActivityAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedAdminsResponse {
  items: AdminResponse[];
  meta: PaginationMeta;
}


