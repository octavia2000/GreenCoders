import {
  Entity,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToOne,
  Index,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BaseEntity } from '../../shared/entities/base-entity';
import { Role } from '../../auth/types/auth-response.types';
import { AdminType, AdminPermission } from '../../admin/constants/admin-permissions';

@Entity('users')
@Index(['email']) // For login queries
@Index(['username']) // For uniqueness checks
@Index(['phoneNumber']) // For OTP lookup
@Index(['role']) // For filtering by role
@Index(['isActive']) // For filtering active users
@Index(['role', 'isActive']) // Composite for filtered queries
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // Don't select password by default for security
  password: string;

  @Column({ unique: true })
  username: string;

  @Column()
  phoneNumber: string;

  @Column({ default: false })
  isNumberVerified: boolean;

  @Column({ nullable: true, select: false }) // Don't select OTP fields by default
  phoneOtp: string;

  @Column({ nullable: true, select: false })
  otpExpiresAt: Date;

  @Column({ nullable: true, select: false }) // Don't select password reset fields by default
  resetPassword: string;

  @Column({ nullable: true, select: false })
  resetPasswordExpiresAt: Date;

  @Column({ default: 'email' })
  authMethod: string; // 'email' | 'google'

  @Column({ type: 'enum', enum: Role, default: Role.CUSTOMER })
  role: Role;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLoginAt: Date;

  // Customer profile fields (merged from CustomerProfileEntity)
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  profileImageUrl: string;

  // Vendor profile fields (merged from VendorProfileEntity)
  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  verifiedAt: Date;

  @Column({ nullable: true })
  verifiedBy: string; // Admin ID who verified

  // Admin profile fields (merged from AdminProfileEntity)
  @Column({ nullable: true })
  department: string;

  @Column({ type: 'jsonb', nullable: true })
  permissions?: AdminPermission[]; // Array of specific permissions

  @Column({
    type: 'enum',
    enum: AdminType,
    nullable: true,
  })
  adminType?: AdminType;

  @BeforeInsert()
  async hashPassword() {
    if (this.password && this.password.length > 0) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @BeforeUpdate()
  async updatePasswordHash() {
    if (this.password && this.password.length > 0) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
