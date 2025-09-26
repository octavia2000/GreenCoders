import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1758853897636 implements MigrationInterface {
    name = 'CreateInitialTables1758853897636'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "rPExpiresAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "resetPasswordExpiresAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_1e3d0240b49c40521aaeb953293"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "otpExpiresAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "otpExpiresAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "otpExpiresAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "otpExpiresAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_1e3d0240b49c40521aaeb953293" UNIQUE ("phoneNumber")`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "resetPasswordExpiresAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "rPExpiresAt" TIMESTAMP WITH TIME ZONE`);
    }

}
