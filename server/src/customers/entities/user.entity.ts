import {
  Entity,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BaseEntity } from '../../shared/entities/base-entity';
import type { Role } from '../types/user-response.types';

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

  @Column({ type: 'enum', enum: ['CUSTOMER', 'VENDOR', 'ADMIN'], default: 'CUSTOMER' })
  role: Role;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLoginAt: Date;


  @OneToOne('CustomerProfileEntity', 'user', { cascade: true })
  customerProfile: any;

  @OneToOne('VendorProfileEntity', 'user', { cascade: true })
  vendorProfile: any;

  @OneToOne('AdminProfileEntity', 'user', { cascade: true })
  adminProfile: any;

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
