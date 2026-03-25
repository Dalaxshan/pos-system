import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginHistorySchema } from './login-history.schema';
import { LoginHistoryService } from './login-history.service';
import { LoginHistoryController } from './login-history.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'LoginHistory', schema: LoginHistorySchema }])],
  providers: [LoginHistoryService],
  controllers: [LoginHistoryController],
  exports: [LoginHistoryService],
})
export class LoginHistoryModule {}
