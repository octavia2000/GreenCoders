import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from './ormconfig'
import { UserModule } from './users/user.module';
// import { CommonModule } from './modules/common/common.module';
// import { DatabaseModule } from './modules/database/database.module';
// import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), ConfigModule.forRoot({isGlobal: true,}),UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
