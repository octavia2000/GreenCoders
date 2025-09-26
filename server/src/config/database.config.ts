import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables from .env file
config();
export default () => ({
  database: {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/database/migrations/*.js'],
    synchronize: false,
    logging: false,
    ssl:
      process.env.DATABASE_SSL === 'require'
        ? {
            rejectUnauthorized: false,
          }
        : false,
  },
});