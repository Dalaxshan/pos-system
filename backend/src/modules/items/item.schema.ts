import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Volume } from './enum/item-volume';
import { RecipeStatus } from './enum/recipe.status';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type ItemDocument = HydratedDocument<Item>;

class Customizations {
  @ApiProperty({
    description: 'Variation of the customization',
    type: String,
  })
  @Prop({ required: true })
  variation: string;

  @ApiProperty({
    description: 'Price of the customization',
    type: Number,
  })
  @Prop({ required: true })
  price: number;

  @ApiProperty({
    description: 'Whether the customization is required',
    type: Boolean,
  })
  @Prop({ required: true })
  isRequired: boolean;
}

export class Quantity {
  @ApiProperty({
    description: 'Value of the quantity',
    type: Number,
  })
  @Prop({ required: true })
  value: number;

  @ApiProperty({
    description: 'Volume of the quantity',
    type: String,
    enum: Volume,
  })
  @Prop({ required: true, enum: Volume })
  volume: Volume;

  @ApiProperty({
    description: 'Current stock quantity',
  })
  @Prop({ required: true, default: 0 })
  currentStock: number;
}

@Schema({ timestamps: true })
export class Item {
  @ApiProperty({
    description: 'Unique identifier for the item',
    example: 'I-MAK-0001',
    type: String,
  })
  @Prop({ unique: true })
  itemId: string;

  @ApiProperty({
    description: 'Reference to the Recipe',
    example: '620000563259742v2',
    type: String,
  })
  @Prop({ type: Types.ObjectId, ref: 'Recipe', required: false })
  recipeId?: Types.ObjectId;

  @ApiProperty({
    description: 'Status of the recipe',
    type: String,
    enum: RecipeStatus,
  })
  @Prop({ type: String, enum: RecipeStatus, default: RecipeStatus.NotApproved })
  recipeStatus: RecipeStatus;

  @ApiProperty({
    description: 'Reference to the Category',
    example: '620000563259742v2',
    type: String,
  })
  @Prop({ type: Types.ObjectId, ref: 'Category', required: false })
  categoryId?: Types.ObjectId;

  @ApiProperty({
    description: 'Reference to the Supplier',
    example: '620000563259742v2',
    type: String,
  })
  @Prop({ type: Types.ObjectId, ref: 'Supplier', required: false })
  supplierId?: Types.ObjectId;

  @ApiProperty({
    description: 'Reference to the Employee',
    example: '620000563259742v2',
    type: String,
  })
  @Prop({ type: Types.ObjectId, ref: 'Employee', required: false })
  employeeId?: Types.ObjectId;

  @ApiProperty({
    description: 'Indicates if the item is for sale',
    type: Boolean,
    default: true,
  })
  @Prop({ type: Boolean, default: true })
  isForSale: boolean;

  @ApiProperty({
    description: 'Name of the item',
    example: 'Milk',
    type: String,
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'Description of the item',
    type: String,
  })
  @Prop()
  description?: string;

  @ApiProperty({
    description: 'Unit price of the item',
    type: Number,
  })
  @Prop({ required: true })
  unitPrice: number;

  @ApiProperty({
    description: 'Net price of the item',
    type: Number,
  })
  @Prop({ required: true })
  netPrice: number;

  @ApiProperty({
    description: 'Quantity of the item',
    type: Quantity,
  })
  @Prop({ type: Quantity, required: true })
  quantity: Quantity;

  @ApiProperty({
    description: 'Discount applied to the item',
    type: Number,
  })
  @Prop()
  discount?: number;

  @ApiProperty({
    description: 'URL of the item image',
    type: String,
  })
  @Prop()
  itemImage?: string;

  @ApiProperty({
    description: 'Customizations for the item',
    type: [Customizations],
  })
  @Prop({ type: [Customizations] })
  customizations?: Customizations[];
}

export const ItemSchema = SchemaFactory.createForClass(Item);
