import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { Role } from '../../auth/types/auth-response.types';

@Injectable()
export class SuperAdminSeeder {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async seedSuperAdmins(): Promise<void> {
    const superAdmins = [
      {
        email: 'superadmin1@greencoders.com',
        username: 'superadmin1',
        password: 'SuperAdmin123!',
        phoneNumber: '+2348000000001',
        firstName: 'Super',
        lastName: 'Admin',
        role: Role.ADMIN,
        isActive: true,
        isNumberVerified: true,
        authMethod: 'email',
      },
      {
        email: 'superadmin2@greencoders.com',
        username: 'superadmin2',
        password: 'SuperAdmin123!',
        phoneNumber: '+2348000000002',
        firstName: 'Super',
        lastName: 'Admin Two',
        role: Role.ADMIN,
        isActive: true,
        isNumberVerified: true,
        authMethod: 'email',
      },
    ];

    for (const adminData of superAdmins) {
      const existingAdmin = await this.userRepository.findOne({
        where: { email: adminData.email },
      });

      if (!existingAdmin) {
        const admin = this.userRepository.create(adminData);
        await this.userRepository.save(admin);
        console.log(`Super admin created: ${adminData.email}`);
      } else {
        console.log(`Super admin already exists: ${adminData.email}`);
      }
    }
  }
}
