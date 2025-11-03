import { Entity, Column, OneToOne, JoinColumn, Index } from 'typeorm';
import { UserEntity } from './user.entity';
import { BaseEntity } from '../../shared/entities/base-entity';

@Entity('vendor_profiles')
export class VendorEntity extends BaseEntity {
  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ name: 'userId' })
  userId: string;

  @Column({ nullable: true })
  businessName?: string;

  @Column({ nullable: true })
  businessType?: string;

  @Column({ nullable: true })
  businessRegistrationNumber?: string;

  @Column({ nullable: true })
  taxId?: string;

  @Column({ nullable: true })
  businessAddress?: string;

  @Column({ nullable: true })
  businessPhone?: string;

  @Column({ nullable: true })
  businessEmail?: string;

  @Column({ nullable: true })
  website?: string;

  @Column('text', { array: true, nullable: true })
  certifications?: string[];

  @Column('jsonb', { nullable: true })
  businessDetails?: any;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  verifiedAt?: Date;

  @Column({ nullable: true })
  verifiedBy?: string;
}



