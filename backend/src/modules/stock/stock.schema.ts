import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { InvoiceNumber } from 'invoice-number';
import { Types } from 'mongoose';
import { ItemModel } from '../purchases/purchase.schema';
import { HydratedDocument } from 'mongoose';

export type StockDocument = HydratedDocument<Stock>;

@Schema({ timestamps: true })
export class Stock {
  @ApiProperty({
    description: 'Stock Order Id',
    example: 'ST-MAK-0001',
  })
  @Prop({
    unique: true,
  })
  stockId: string;

  @ApiProperty({
    description: 'Receipe Id',
    example: '66a22540e160fa4c2c0ec372',
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'Recipe',
  })
  recipeId: Types.ObjectId;

  @ApiProperty({
    description: 'Sales Item details',
    example: '{ itemId: 66a22540e160fa4c2c0ec372, itemName: Item 1 }',
  })
  @Prop({
    type: ItemModel,
    required: true,
  })
  salesItem: ItemModel;

  @ApiProperty({
    description: 'Items in stock order',
    example: 'Item 1, Item 2',
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
    description: 'Quantity of stock order',
    example: 2,
  })
  @Prop({ required: true })
  totQty: number;

  @ApiProperty({
    description: 'Additional comment on stock ',
    example: 'added butter instead of oil since out of stock',
  })
  @Prop({
    required: false,
  })
  comments: string;
}

export const StockSchema = SchemaFactory.createForClass(Stock);

StockSchema.pre('save', async function (next) {
  if (!this.isNew) {
    return next();
  }
  const lastOrder = await this.model('Stock').findOne({}).sort({ _id: -1 }).exec();

  if (!lastOrder || !(lastOrder as unknown as Stock).stockId) {
    this.stockId = `ST-MAK-0001`;
  } else {
    const pattern = InvoiceNumber.next((lastOrder as unknown as Stock).stockId);
    this.stockId = pattern;
  }
  next();
});
