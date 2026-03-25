import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { InvoiceNumber } from 'invoice-number';
import { HydratedDocument } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({ timestamps: true, versionKey: false })
export class Customer {
  @ApiProperty({
    description: 'Unique identifier for the customer',
    example: 'CUS-MAK-0001',
  })
  @Prop({
    unique: true,
  })
  customerId: string;

  @ApiProperty({
    description: 'Full name of the customer',
    example: 'John Doe',
  })
  @Prop({
    required: true,
  })
  customerName: string;

  @ApiProperty({
    description: 'Contact number of the customer',
    example: '1234567890',
  })
  @Prop()
  contactNo: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.pre('save', async function (next) {
  if (!this.isNew) {
    return next();
  }
  const lastCustomer = await this.model('Customer').findOne({}).sort({ _id: -1 }).exec();
  if (!lastCustomer || !(lastCustomer as unknown as Customer).customerId) {
    this.customerId = `CUS-MAK-0001`;
  } else {
    const pattern = InvoiceNumber.next((lastCustomer as unknown as Customer).customerId);
    this.customerId = pattern;
  }
  next();
});
