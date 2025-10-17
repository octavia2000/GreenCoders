import { Entity, Column, OneToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base-entity';

@Entity('admin_profiles')
@Index(['accessLevel']) // For querying by admin type
export class AdminProfileEntity extends BaseEntity {
  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  profileImageUrl: string;

  @Column({ nullable: true })
  department: string;

  @Column({ type: 'jsonb', nullable: true })
  permissions: string[]; // Array of specific permissions

  @Column({ type: 'enum', enum: ['super_admin', 'admin', 'moderator'], default: 'admin' })
  accessLevel: string;

  // Relationship
  @OneToOne('UserEntity', 'adminProfile', { onDelete: 'CASCADE' })
  @JoinColumn()
  user: any;
}


