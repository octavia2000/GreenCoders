import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1758993070194 implements MigrationInterface {
    name = 'Auto1758993070194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "authMethod" character varying NOT NULL DEFAULT 'email'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "authMethod"`);
    }

}
