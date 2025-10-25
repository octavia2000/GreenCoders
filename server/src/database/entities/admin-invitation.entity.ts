import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../shared/entities/base-entity';
import { AdminType } from '../../admin/constants/admin-permissions';

export enum AdminInvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

@Entity('admin_invitations')
@Index(['email']) // For lookup by email
@Index(['invitationToken']) // For token validation
@Index(['status']) // For filtering by status
@Index(['invitedBy']) // For tracking who sent invitations
export class AdminInvitationEntity extends BaseEntity {
  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: AdminType,
  })
  adminType: AdminType;

  @Column({ type: 'uuid', unique: true })
  invitationToken: string;

  @Column({
    type: 'enum',
    enum: AdminInvitationStatus,
    default: AdminInvitationStatus.PENDING,
  })
  status: AdminInvitationStatus;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'uuid' })
  invitedBy: string; // ID of the admin who sent the invitation

  @Column({ nullable: true })
  invitedByName: string; // Name of the admin who sent the invitation

  @Column({ nullable: true })
  department: string;

  @Column({ type: 'text', nullable: true })
  message: string; // Optional message from the inviter

  @Column({ type: 'timestamp', nullable: true })
  acceptedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  acceptedBy: string; // User ID who accepted the invitation

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ type: 'uuid', nullable: true })
  cancelledBy: string; // Admin ID who cancelled the invitation
}