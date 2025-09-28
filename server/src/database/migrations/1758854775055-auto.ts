import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1758854775055 implements MigrationInterface {
    name = 'Auto1758854775055'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refreshToken"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "refreshToken" character varying`);
    }

}
