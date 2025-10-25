import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base-entity';
import { UserEntity } from './user.entity';

export interface SocialLinks {
  instagram?: string;
  tiktok?: string;
  whatsapp?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
}

@Entity('vendor_business_verifications')
export class VendorBusinessVerificationEntity extends BaseEntity {
  // Business Information
  @Column({ type: 'varchar', length: 255, nullable: true })
  businessName?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  businessIdNumber?: string; // CAC number in Nigeria

  @Column({ type: 'varchar', length: 255, nullable: true })
  businessWebsite?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  businessEmail?: string;

  @Column({ type: 'json', nullable: true })
  socialLinks?: SocialLinks;

  // Verification Status
  @Column({ 
    type: 'enum', 
    enum: ['pending', 'verified', 'rejected'], 
    default: 'pending' 
  })
  verificationStatus: 'pending' | 'verified' | 'rejected';

  @Column({ type: 'text', nullable: true })
  verificationNotes?: string;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt?: Date;

  @Column({ type: 'uuid', nullable: true })
  verifiedBy?: string; // Admin user ID who verified

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'uuid' })
  userId: string;
}

