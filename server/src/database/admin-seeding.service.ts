import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../auth/user/entities.ts/entities/user.entity';
import { AdminProfileEntity } from '../admin/entities/admin-profile.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminSeedingService {
  private readonly logger = new Logger(AdminSeedingService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(AdminProfileEntity)
    private readonly adminProfileRepository: Repository<AdminProfileEntity>,
  ) {}

  async seedDefaultAdmin(): Promise<void> {
    try {
      // Check if admin already exists
      const existingAdmin = await this.userRepository.findOne({
        where: { email: 'admin@ecostore.com' },
      });

      if (existingAdmin) {
        this.logger.log('Default admin already exists');
        return;
      }

      // Create admin user
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      const adminUser = this.userRepository.create({
        email: 'admin@ecostore.com',
        password: hashedPassword,
        username: 'admin',
        phoneNumber: '+1234567890',
        role: 'ADMIN',
        isNumberVerified: true,
        isActive: true,
        authMethod: 'email',
        permissions: ['all'],
      });

      const savedAdmin = await this.userRepository.save(adminUser);

      // Create admin profile
      const adminProfile = this.adminProfileRepository.create({
        userId: savedAdmin.id,
        department: 'IT',
        permissions: ['user_management', 'vendor_management', 'system_settings'],
        accessLevel: 'super_admin',
        employeeId: 'ADM001',
        jobTitle: 'System Administrator',
        officeLocation: 'Head Office',
        officePhoneNumber: '+1234567890',
        isActive: true,
      });

      await this.adminProfileRepository.save(adminProfile);

      this.logger.log('Default admin created successfully');
      this.logger.log('Admin credentials:');
      this.logger.log('Email: admin@ecostore.com');
      this.logger.log('Password: Admin123!');
    } catch (error) {
      this.logger.error('Failed to seed default admin:', error);
      throw error;
    }
  }

  async seedMultipleAdmins(): Promise<void> {
    const admins = [
      {
        email: 'admin@ecostore.com',
        password: 'Admin123!',
        username: 'admin',
        phoneNumber: '+1234567890',
        department: 'IT',
        employeeId: 'ADM001',
        jobTitle: 'System Administrator',
        accessLevel: 'super_admin',
      },
      {
        email: 'manager@ecostore.com',
        password: 'Manager123!',
        username: 'manager',
        phoneNumber: '+1234567891',
        department: 'Operations',
        employeeId: 'MGR001',
        jobTitle: 'Operations Manager',
        accessLevel: 'manager',
      },
    ];

    for (const adminData of admins) {
      try {
        // Check if admin already exists
        const existingAdmin = await this.userRepository.findOne({
          where: { email: adminData.email },
        });

        if (existingAdmin) {
          this.logger.log(`Admin ${adminData.email} already exists`);
          continue;
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash(adminData.password, 10);
        const adminUser = this.userRepository.create({
          email: adminData.email,
          password: hashedPassword,
          username: adminData.username,
          phoneNumber: adminData.phoneNumber,
          role: 'ADMIN',
          isNumberVerified: true,
          isActive: true,
          authMethod: 'email',
          permissions: adminData.accessLevel === 'super_admin' ? ['all'] : ['user_management', 'vendor_management'],
        });

        const savedAdmin = await this.userRepository.save(adminUser);

        // Create admin profile
        const adminProfile = this.adminProfileRepository.create({
          userId: savedAdmin.id,
          department: adminData.department,
          permissions: adminData.accessLevel === 'super_admin' 
            ? ['user_management', 'vendor_management', 'system_settings']
            : ['user_management', 'vendor_management'],
          accessLevel: adminData.accessLevel,
          employeeId: adminData.employeeId,
          jobTitle: adminData.jobTitle,
          officeLocation: 'Head Office',
          officePhoneNumber: adminData.phoneNumber,
          isActive: true,
        });

        await this.adminProfileRepository.save(adminProfile);

        this.logger.log(`Admin ${adminData.email} created successfully`);
      } catch (error) {
        this.logger.error(`Failed to create admin ${adminData.email}:`, error);
      }
    }
  }
}

