import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SalesPaymentStatus } from './enum/sales-payment-status';
import { ApiProperty } from '@nestjs/swagger';
import { InvoiceNumber } from 'invoice-number';
import { SalesServiceStatus } from './enum/sales-service-status';
import { OrderStatus } from './enum/order-status';
import { ItemModel } from '../purchases/purchase.schema';
import { HydratedDocument } from 'mongoose';
import { PaymentType } from './enum/payment-type';

export type SalesDocument = HydratedDocument<Sales>;

// Customization model
export class CustomizationsModel {
  @ApiProperty({
    description: 'Customization variation',
    example: 'Extra cheese',
  })
  @Prop({ required: true })
  variation: string;

  @ApiProperty({
    description: 'Extra charge for the customization',
    example: 150,
  })
  @Prop({ required: true })
  price: number;
}

@Schema({ timestamps: true })
export class Sales {
  @ApiProperty({
    description: 'Sales Order Id',
    example: 'SO-MAK-0001',
  })
  @Prop()
  orderId: string;

  @ApiProperty({
    description: 'Table Id',
    example: '66a22540e160fa4c2c0ec372',
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'Table',
    required: false,
  })
  tableId: Types.ObjectId;

  @ApiProperty({
    description: 'Customer Id',
    example: 'John Doe',
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'Customer',
    required: false,
  })
  customerId: Types.ObjectId;

  @ApiProperty({
    description: 'Items in sales order',
    example: '[{ itemId: "Item 1", price: 100 }]',
  })
  @Prop({
    type: [ItemModel],
    required: true,
  })
  items: ItemModel[];

  @ApiProperty({
    description: 'Employee Id',
    example: '66a22540e160fa4c2c0ec372',
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'Employee',
    required: true,
  })
  employeeId: Types.ObjectId;

  @ApiProperty({
    description: 'Quantity of sales order',
    example: 2,
  })
  @Prop()
  quantity: number;

  @ApiProperty({
    description: 'Discount for sales order',
    example: 10,
  })
  @Prop({
    required: false,
  })
  discount: number;

  @ApiProperty({
    description: 'Payment Status',
    example: 'PENDING',
  })
  @Prop({
    required: true,
    type: String,
    enum: SalesPaymentStatus,
    default: SalesPaymentStatus.Paid,
  })
  paymentStatus: SalesPaymentStatus;

  @ApiProperty({
    description: 'Order Status',
    example: 'placed',
  })
  @Prop({
    required: true,
    type: String,
    enum: OrderStatus,
    default: OrderStatus.Placed,
  })
  orderStatus: OrderStatus;

  @ApiProperty({
    description: 'Service Status',
    example: 'Dine-in',
  })
  @Prop({
    required: true,
    type: String,
    enum: SalesServiceStatus,
  })
  serviceStatus: SalesServiceStatus;

  @ApiProperty({
    description: 'Payment Type',
    example: 'CASH',
    enum: PaymentType,
  })
  @Prop({
    required: true,
  })
  paymentType: PaymentType;

  @ApiProperty({
    description: 'Sub total for sales order (without discount)',
    example: 2000,
  })
  @Prop({
    required: true,
  })
  subTotal: number;

  @ApiProperty({
    description: 'Grand Total for sales order with discount',
    example: 1900,
  })
  @Prop({
    required: true,
  })
  grandTotal: number;

  @ApiProperty({
    description: 'Service Charge for dine-in orders',
    example: 100,
  })
  @Prop({
    required: false,
  })
  serviceCharge: number;

  @ApiProperty({
    description: 'Pre Order Date',
    example: '2021-07-01T00:00:00.000Z',
  })
  @Prop({
    type: Date,
    required: false,
  })
  preOrderDate: Date;
}

export const SalesSchema = SchemaFactory.createForClass(Sales);

SalesSchema.pre('save', async function (next) {
  if (!this.isNew) {
    return next();
  }
  const lastOrder = await this.model('Sales').findOne({}).sort({ _id: -1 }).exec();

  if (!lastOrder || !(lastOrder as unknown as Sales).orderId) {
    this.orderId = `SO-MAK-0001`;
  } else {
    const pattern = InvoiceNumber.next((lastOrder as unknown as Sales).orderId);
    this.orderId = pattern;
  }
  next();
});
