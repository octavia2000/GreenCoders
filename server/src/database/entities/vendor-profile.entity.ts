import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base-entity';
import { UserEntity } from './user.entity';

@Entity('vendor_profiles')
export class VendorProfileEntity extends BaseEntity {
  // Personal Information
  @Column({ type: 'varchar', length: 100, nullable: true })
  firstName?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  region?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profileImageUrl?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'uuid' })
  userId: string;
}

