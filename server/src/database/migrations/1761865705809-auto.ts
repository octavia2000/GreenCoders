import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1761865705809 implements MigrationInterface {
    name = 'Auto1761865705809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('CUSTOMER', 'VENDOR', 'ADMIN')`);
        await queryRunner.query(`CREATE TYPE "public"."users_admintype_enum" AS ENUM('super_admin', 'store_admin', 'vendor_admin', 'customer_admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, "username" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "isNumberVerified" boolean NOT NULL DEFAULT false, "phoneOtp" character varying, "otpExpiresAt" TIMESTAMP, "resetPassword" character varying, "resetPasswordExpiresAt" TIMESTAMP, "authMethod" character varying NOT NULL DEFAULT 'email', "role" "public"."users_role_enum" NOT NULL DEFAULT 'CUSTOMER', "isActive" boolean NOT NULL DEFAULT true, "lastLoginAt" TIMESTAMP, "firstName" character varying, "lastName" character varying, "profileImageUrl" character varying, "isVerified" boolean NOT NULL DEFAULT false, "verifiedAt" TIMESTAMP, "verifiedBy" character varying, "department" character varying, "permissions" jsonb, "adminType" "public"."users_admintype_enum", CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cb49ffedefc177517b9ccfd650" ON "users" ("role", "isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_409a0298fdd86a6495e23c25c6" ON "users" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_ace513fa30d485cfd25c11a9e4" ON "users" ("role") `);
        await queryRunner.query(`CREATE INDEX "IDX_1e3d0240b49c40521aaeb95329" ON "users" ("phoneNumber") `);
        await queryRunner.query(`CREATE INDEX "IDX_fe0bb3f6520ee0469504521e71" ON "users" ("username") `);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE TABLE "vendor_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "businessName" character varying, "businessType" character varying, "businessRegistrationNumber" character varying, "taxId" character varying, "businessAddress" character varying, "businessPhone" character varying, "businessEmail" character varying, "website" character varying, "certifications" text array, "businessDetails" jsonb, "isVerified" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "verifiedAt" TIMESTAMP, "verifiedBy" character varying, CONSTRAINT "REL_658558b7f3a6163382505c8009" UNIQUE ("userId"), CONSTRAINT "PK_bcb47b1a47f4f1447447eaf73a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."vendor_business_verifications_verificationstatus_enum" AS ENUM('pending', 'verified', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "vendor_business_verifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "businessName" character varying(255), "businessIdNumber" character varying(50), "businessWebsite" character varying(255), "businessEmail" character varying(255), "socialLinks" json, "verificationStatus" "public"."vendor_business_verifications_verificationstatus_enum" NOT NULL DEFAULT 'pending', "verificationNotes" text, "verifiedAt" TIMESTAMP, "verifiedBy" uuid, "userId" uuid NOT NULL, CONSTRAINT "REL_9e6d81a4d0b9a303071a793a46" UNIQUE ("userId"), CONSTRAINT "PK_692f21707f68f81251dd0e82771" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."admin_invitations_admintype_enum" AS ENUM('super_admin', 'store_admin', 'vendor_admin', 'customer_admin')`);
        await queryRunner.query(`CREATE TYPE "public"."admin_invitations_status_enum" AS ENUM('pending', 'accepted', 'expired', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "admin_invitations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "adminType" "public"."admin_invitations_admintype_enum" NOT NULL, "invitationToken" uuid NOT NULL, "status" "public"."admin_invitations_status_enum" NOT NULL DEFAULT 'pending', "expiresAt" TIMESTAMP NOT NULL, "invitedBy" uuid NOT NULL, "invitedByName" character varying, "department" character varying, "message" text, "acceptedAt" TIMESTAMP, "acceptedBy" uuid, "cancelledAt" TIMESTAMP, "cancelledBy" uuid, CONSTRAINT "UQ_2852f22e27695b6d0b502f1a180" UNIQUE ("invitationToken"), CONSTRAINT "PK_0c710b9106ea89847bcf62bd3e1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0355a578c031756accff409f25" ON "admin_invitations" ("invitedBy") `);
        await queryRunner.query(`CREATE INDEX "IDX_eded2c3fc048f444fca79a4ff5" ON "admin_invitations" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_2852f22e27695b6d0b502f1a18" ON "admin_invitations" ("invitationToken") `);
        await queryRunner.query(`CREATE INDEX "IDX_3648cb96bcc04ac5cbb7ca84c2" ON "admin_invitations" ("email") `);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "businessName"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "businessType"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "businessRegistrationNumber"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "taxId"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "businessAddress"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "businessPhone"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "businessEmail"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "website"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "certifications"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "businessDetails"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "isVerified"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "verifiedAt"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "verifiedBy"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "businessName" character varying`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "businessType" character varying`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "businessRegistrationNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "taxId" character varying`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "businessAddress" character varying`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "businessPhone" character varying`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "businessEmail" character varying`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "website" character varying`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "certifications" text array`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "businessDetails" jsonb`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "isVerified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "verifiedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "verifiedBy" character varying`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "firstName" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "lastName" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "address" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "state" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "region" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "profileImageUrl" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD CONSTRAINT "FK_658558b7f3a6163382505c8009e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vendor_business_verifications" ADD CONSTRAINT "FK_9e6d81a4d0b9a303071a793a461" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vendor_business_verifications" DROP CONSTRAINT "FK_9e6d81a4d0b9a303071a793a461"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP CONSTRAINT "FK_658558b7f3a6163382505c8009e"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "profileImageUrl"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "region"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "state"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "verifiedBy"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "verifiedAt"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "isVerified"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "businessDetails"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "certifications"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "website"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "businessEmail"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "businessPhone"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "businessAddress"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "taxId"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "businessRegistrationNumber"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "businessType"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" DROP COLUMN "businessName"`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "verifiedBy" character varying`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "verifiedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "isVerified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "businessDetails" jsonb`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "certifications" text array`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "website" character varying`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "businessEmail" character varying`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "businessPhone" character varying`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "businessAddress" character varying`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "taxId" character varying`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "businessRegistrationNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "businessType" character varying`);
        await queryRunner.query(`ALTER TABLE "vendor_profiles" ADD "businessName" character varying`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3648cb96bcc04ac5cbb7ca84c2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2852f22e27695b6d0b502f1a18"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eded2c3fc048f444fca79a4ff5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0355a578c031756accff409f25"`);
        await queryRunner.query(`DROP TABLE "admin_invitations"`);
        await queryRunner.query(`DROP TYPE "public"."admin_invitations_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."admin_invitations_admintype_enum"`);
        await queryRunner.query(`DROP TABLE "vendor_business_verifications"`);
        await queryRunner.query(`DROP TYPE "public"."vendor_business_verifications_verificationstatus_enum"`);
        await queryRunner.query(`DROP TABLE "vendor_profiles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fe0bb3f6520ee0469504521e71"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1e3d0240b49c40521aaeb95329"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ace513fa30d485cfd25c11a9e4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_409a0298fdd86a6495e23c25c6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cb49ffedefc177517b9ccfd650"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_admintype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
