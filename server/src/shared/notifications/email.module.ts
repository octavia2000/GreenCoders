import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import { ContentService } from './content.service';

@Module({
  imports: [ConfigModule],
  providers: [EmailService, ContentService],
  exports: [EmailService],
})
export class EmailModule {}
