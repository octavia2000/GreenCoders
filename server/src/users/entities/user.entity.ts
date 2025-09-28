import {
  Entity,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BaseEntity } from '../../shared/base-entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  username: string;

  @Column()
  phoneNumber: string;

  @Column({ default: false })
  isNumberVerified: boolean;

  @Column({ nullable: true })
  phoneOtp: string;

  @Column({ nullable: true })
  otpExpiresAt: Date;

  @Column({ nullable: true })
  resetPassword: string;

  @Column({ nullable: true })
  resetPasswordExpiresAt: Date;

  @Column({ default: 'email' })
  authMethod: string; // 'email' | 'google'

  @BeforeInsert()
  async hashPassword() {
    if (this.password && this.password.length > 0) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
