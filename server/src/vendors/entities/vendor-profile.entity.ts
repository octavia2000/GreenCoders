import { Entity, Column, OneToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base-entity';

@Entity('vendor_profiles')
@Index(['isVerified']) // For admin to query pending vendors
export class VendorProfileEntity extends BaseEntity {
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  profileImageUrl: string;

  // Verification status (admin approves vendors)
  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  verifiedAt: Date;

  @Column({ nullable: true })
  verifiedBy: string; // Admin ID who verified

  // Relationship
  @OneToOne('UserEntity', 'vendorProfile', { onDelete: 'CASCADE' })
  @JoinColumn()
  user: any;
}


