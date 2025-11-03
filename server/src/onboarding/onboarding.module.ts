import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';
import { AuthModule } from '../auth/auth.module';
import { UserEntity } from '../database/entities/user.entity';
import { EmailModule } from '../shared/notifications/email.module';
import { SmsModule } from '../shared/notifications/sms.module';
import { RateLimitGuard } from '../shared/guards/rate-limit.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    EmailModule,
    SmsModule,
  ],
  controllers: [OnboardingController],
  providers: [OnboardingService, RateLimitGuard],
  exports: [OnboardingService],
})
export class OnboardingModule {}
