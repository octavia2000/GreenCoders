import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles'; // Create a unique key for storing metadata
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles); // Decorator to set the roles metadata
