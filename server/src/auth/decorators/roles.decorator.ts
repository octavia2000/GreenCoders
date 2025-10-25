import { SetMetadata } from '@nestjs/common';
import { Role } from '../types/auth-response.types';

export const ROLES_KEY = 'roles'; // Create a unique key for storing metadata
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles); // Decorator to set the roles metadata
