import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base-entity';
import { VendorProfileEntity } from '../../users/entities/vendor-profile.entity';

@Entity('vendor_shipping_policies')
export class VendorShippingEntity extends BaseEntity {
  @Column({ type: 'jsonb', nullable: true })
  shippingMethods: any; // [{ name: 'Standard', cost: 1000, duration: '3-5 days' }]

  @Column({ type: 'jsonb', nullable: true })
  shippingZones: any; // [{ zone: 'Lagos', cost: 500 }, { zone: 'Nationwide', cost: 2000 }]

  @Column({ default: true })
  offersLocalPickup: boolean;

  @Column({ nullable: true })
  pickupAddress: string;

  @Column({ type: 'jsonb', nullable: true })
  freeShippingThreshold: any; // { enabled: true, minimumAmount: 10000 }

  @Column({ nullable: true })
  processingTime: string; // '1-2 business days'

  @Column({ type: 'text', nullable: true })
  shippingPolicy: string; // Detailed shipping policy text

  @Column({ type: 'text', nullable: true })
  returnPolicy: string; // Detailed return policy text

  @Column({ default: 14 })
  returnWindowDays: number; // Days customers can return items

  @Column({ default: true })
  acceptsReturns: boolean;

  @Column({ type: 'jsonb', nullable: true })
  returnConditions: string[]; // ['Item must be unused', 'Original packaging required']

  // Relationship
  @OneToOne(() => VendorProfileEntity)
  @JoinColumn()
  vendorProfile: VendorProfileEntity;
}


