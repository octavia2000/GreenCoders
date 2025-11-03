// import { Command, CommandRunner } from 'nest-commander';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { DatabaseSeeder } from './database.seeder';

// @Command({
//   name: 'seed',
//   description: 'Seed the database with initial data',
// })
export class SeedCommand {
  async run(): Promise<void> {
    const app = await NestFactory.createApplicationContext(AppModule);
    const seeder = app.get(DatabaseSeeder);

    try {
      await seeder.seed();
    } catch (error) {
      console.error('Seeding failed:', error);
      process.exit(1);
    } finally {
      await app.close();
    }
  }
}
