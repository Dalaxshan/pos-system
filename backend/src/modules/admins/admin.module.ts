import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminSchema } from './admin.schema';
import { AdminService } from './admin.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Admin', schema: AdminSchema }])],
  controllers: [AdminController],
  exports: [AdminService],
  providers: [AdminService],
})
export class AdminModule {}
