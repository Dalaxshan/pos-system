import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesSchema } from './sales.schema';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { ItemModule } from 'src/modules/items/item.module';
import { CustomerModule } from 'src/modules/customers/customer.module';
import { EmployeeModule } from 'src/modules/employees/employee.module';
import { TableModule } from 'src/modules/tables/table.module';
import { NotificationModule } from '../notifications/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Sales', schema: SalesSchema }]),
    ItemModule,
    EmployeeModule,
    CustomerModule,
    TableModule,
    NotificationModule,
  ],
  controllers: [SalesController],
  exports: [SalesService],
  providers: [SalesService],
})
export class SalesModule {}
