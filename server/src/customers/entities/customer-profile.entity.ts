import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base-entity';

@Entity('customer_profiles')
export class CustomerProfileEntity extends BaseEntity {
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  profileImageUrl: string;

  // Relationship
  @OneToOne('UserEntity', 'customerProfile', { onDelete: 'CASCADE' })
  @JoinColumn()
  user: any;
}

