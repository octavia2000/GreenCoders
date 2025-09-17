import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { CommonModule } from './modules/common/common.module';
// import { DatabaseModule } from './modules/database/database.module';
// import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
