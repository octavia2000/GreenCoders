import { Injectable, Logger } from '@nestjs/common';
import { AdminSeedingService } from '../database/admin-seeding.service';

@Injectable()
export class SeedingCommand {
  private readonly logger = new Logger(SeedingCommand.name);

  constructor(private readonly adminSeedingService: AdminSeedingService) {}

  async runSeeding(): Promise<void> {
    this.logger.log('Starting database seeding...');
    
    try {
      // Seed default admin
      await this.adminSeedingService.seedDefaultAdmin();
      
      this.logger.log('Database seeding completed successfully');
    } catch (error) {
      this.logger.error('Database seeding failed:', error);
      throw error;
    }
  }

  async runMultipleAdminsSeeding(): Promise<void> {
    this.logger.log('Starting multiple admins seeding...');
    
    try {
      // Seed multiple admins
      await this.adminSeedingService.seedMultipleAdmins();
      
      this.logger.log('Multiple admins seeding completed successfully');
    } catch (error) {
      this.logger.error('Multiple admins seeding failed:', error);
      throw error;
    }
  }
}

