import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationSchema } from './notification.schema';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { EmployeeModule } from 'src/modules/employees/employee.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema }]),
    EmployeeModule,
  ],
  controllers: [NotificationController],
  exports: [NotificationService],
  providers: [NotificationService],
})
export class NotificationModule {}
