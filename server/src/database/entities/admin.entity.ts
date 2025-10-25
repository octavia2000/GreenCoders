import { Entity, Column, OneToOne, JoinColumn, Index } from 'typeorm';
import { UserEntity } from '../../database/entities/user.entity';
import { BaseEntity } from '../../shared/entities/base-entity';
import { AdminType } from '../constants/admin-permissions';

@Entity('admin_profiles')
@Index(['employeeId'], { unique: true, where: '"employeeId" IS NOT NULL' })
export class AdminEntity extends BaseEntity {
  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ name: 'userId' })
  userId: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column()
  department: string;

  @Column({
    type: 'enum',
    enum: AdminType,
    default: AdminType.CUSTOMER_ADMIN,
  })
  accessLevel: AdminType;

  @Column({ nullable: true, unique: true })
  employeeId?: string;

  @Column({ nullable: true })
  jobTitle?: string;

  @Column({ nullable: true })
  reportingManager?: string;

  @Column('text', { array: true, nullable: true })
  assignedModules?: string[];

  @Column('jsonb', { nullable: true })
  workingHours?: any;

  @Column({ nullable: true })
  officeLocation?: string;

  @Column({ nullable: true })
  officePhoneNumber?: string;

  @Column({ nullable: true })
  emergencyContact?: string;

  @Column('jsonb', { nullable: true })
  emergencyContactDetails?: any;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLoginAt?: Date;

  @Column({ nullable: true })
  lastActivityAt?: Date;
}
