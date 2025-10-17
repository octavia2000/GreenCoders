import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base-entity';
import { VendorProfileEntity } from '../../users/entities/vendor-profile.entity';

@Entity('vendor_business_details')
export class VendorBusinessEntity extends BaseEntity {
  @Column({ nullable: true })
  businessName: string;

  @Column({ nullable: true })
  businessCategory: string;

  @Column({ nullable: true })
  businessAddress: string;

  @Column({ nullable: true })
  businessEmail: string;

  @Column({ nullable: true })
  businessPhoneNumber: string;

  @Column({ nullable: true })
  businessRegistrationNumber: string;

  @Column({ nullable: true })
  businessType: string; // 'sole_proprietor', 'partnership', 'llc', 'corporation'

  @Column({ type: 'text', nullable: true })
  businessDescription: string;

  @Column({ nullable: true })
  websiteUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  socialMediaLinks: any; // { facebook, instagram, twitter, linkedin }

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ type: 'jsonb', nullable: true })
  businessHours: any; // { monday: { open: '09:00', close: '17:00' }, ... }

  @Column({ nullable: true })
  yearsInBusiness: number;

  // Relationship
  @OneToOne(() => VendorProfileEntity)
  @JoinColumn()
  vendorProfile: VendorProfileEntity;
}


