import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { PurchasePaymentStatus } from './enum/purchase-payment-status';
import { InvoiceNumber } from 'invoice-number';
import { ApiProperty } from '@nestjs/swagger';
import { PurchaseStatus } from './enum/purchase-status';
import { HydratedDocument } from 'mongoose';
import { Quantity } from 'src/modules/items/item.schema';

export type PurchaseDocument = HydratedDocument<Purchase>;

export class ItemModel {
  @ApiProperty({
    description: 'Item Id',
    example: '66a22540e160fa4c2c0ec372',
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'Item',
    required: true,
  })
  itemId: Types.ObjectId;

  @ApiProperty({
    description: 'Item Name',
    example: 'Item 1',
  })
  @Prop({
    required: true,
  })
  itemName: string;

  @ApiProperty({
    description: 'Quantity of the item',
    type: Quantity,
    example: { value: 10, volume: 'kg' },
  })
  @Prop({ type: Quantity })
  quantity: Quantity;

  @ApiProperty({
    description: 'Discount for item in purchase order',
    example: 10,
  })
  @Prop()
  discount?: number;
}

@Schema({ timestamps: true })
export class Purchase {
  @ApiProperty({
    description: 'Purchase Order Id',
    example: 'PO-MAK-0001',
  })
  @Prop({ unique: true })
  orderId: string;

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
    description: 'Supplier Id',
    example: '66a22540e160fa4c2c0ec372',
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'Supplier',
    required: true,
  })
  supplierId: Types.ObjectId;

  @ApiProperty({
    description: 'Items in the purchase order',
    type: [ItemModel],
    example: [
      {
        itemId: '66a22540e160fa4c2c0ec372',
        itemName: 'Item 1',
        quantity: { value: 10, volume: 'kg' },
        discount: 10,
      },
    ],
  })
  @Prop({
    type: [ItemModel],
    required: true,
  })
  items: ItemModel[];

  @ApiProperty({
    description: 'Discount for purchase order',
    example: 10,
  })
  @Prop()
  discount: number;

  @ApiProperty({
    description: 'Gross price for purchase order (without discount)',
    example: 2000,
  })
  @Prop({ required: true })
  grossPrice: number;

  @ApiProperty({
    description: 'Net price for purchase order with discount',
    example: 1900,
  })
  @Prop({ required: true })
  netPrice: number;

  @ApiProperty({
    description: 'Delivery status of the purchase order',
    example: 'Pending',
    enum: PurchaseStatus,
  })
  @Prop({
    type: String,
    default: PurchaseStatus.Pending,
    enum: PurchaseStatus,
  })
  deliveryStatus: PurchaseStatus;

  @ApiProperty({
    description: 'Payment status of the purchase order',
    example: 'Unpaid',
    enum: PurchasePaymentStatus,
  })
  @Prop({
    type: String,
    default: PurchasePaymentStatus.Unpaid,
    enum: PurchasePaymentStatus,
  })
  paymentStatus: PurchasePaymentStatus;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);

PurchaseSchema.pre('save', async function (next) {
  if (!this.isNew) {
    return next();
  }
  const lastOrder = await this.model('Purchase').findOne({}).sort({ _id: -1 }).exec();

  if (!lastOrder || !(lastOrder as unknown as Purchase).orderId) {
    this.orderId = 'PO-MAK-0001';
  } else {
    const lastOrderId = (lastOrder as unknown as Purchase).orderId;
    this.orderId = InvoiceNumber.next(lastOrderId);
  }
  next();
});
