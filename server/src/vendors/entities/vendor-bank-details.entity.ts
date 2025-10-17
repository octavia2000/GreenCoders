import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base-entity';
import { VendorProfileEntity } from '../../users/entities/vendor-profile.entity';

@Entity('vendor_bank_details')
export class VendorBankDetailsEntity extends BaseEntity {
  @Column()
  bankName: string;

  @Column()
  accountNumber: string; // Should be encrypted in production

  @Column()
  accountName: string;

  @Column({ nullable: true })
  accountType: string; // 'savings', 'current', 'business'

  @Column({ nullable: true })
  routingNumber: string;

  @Column({ nullable: true })
  swiftCode: string;

  @Column({ nullable: true })
  iban: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  verifiedAt: Date;

  @Column({ nullable: true })
  verifiedBy: string; // Admin ID who verified

  // Relationship
  @OneToOne(() => VendorProfileEntity)
  @JoinColumn()
  vendorProfile: VendorProfileEntity;

  // NOTE: In production, use encryption for sensitive fields
  // Consider using @BeforeInsert and @BeforeUpdate hooks to encrypt/decrypt
}


