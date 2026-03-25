import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSchema } from './customer.schema';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema }])],
  controllers: [CustomerController],
  exports: [CustomerService, MongooseModule],
  providers: [CustomerService],
})
export class CustomerModule {}
