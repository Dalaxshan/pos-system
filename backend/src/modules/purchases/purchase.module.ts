import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PurchaseSchema } from './purchase.schema';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { ItemModule } from 'src/modules/items/item.module';
import { SupplierModule } from 'src/modules/suppliers/supplier.module';
import { EmployeeModule } from 'src/modules/employees/employee.module';
import { SalesModule } from '../sales/sales.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Purchase', schema: PurchaseSchema }]),
    ItemModule,
    SupplierModule,
    EmployeeModule,
    SalesModule,
  ],
  controllers: [PurchaseController],
  exports: [PurchaseService],
  providers: [PurchaseService],
})
export class PurchaseModule {}
