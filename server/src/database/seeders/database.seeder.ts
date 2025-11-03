import { Injectable } from '@nestjs/common';
import { SuperAdminSeeder } from './super-admin.seeder';

@Injectable()
export class DatabaseSeeder {
  constructor(private readonly superAdminSeeder: SuperAdminSeeder) {}

  async seed(): Promise<void> {
    console.log('Starting database seeding...');

    try {
      await this.superAdminSeeder.seedSuperAdmins();
      console.log('Database seeding completed successfully!');
    } catch (error) {
      console.error('Database seeding failed:', error);
      throw error;
    }
  }
}
