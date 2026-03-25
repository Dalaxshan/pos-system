import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Volume } from 'src/modules/items/enum/item-volume';
import { HydratedDocument } from 'mongoose';
import { InvoiceNumber } from 'invoice-number';

export type RecipeDocument = HydratedDocument<Recipe>;

export class ItemModel {
  @ApiProperty({
    description: 'Purchase Item Id',
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
    example: { value: 10, volume: 'kg' },
  })
  @Prop({
    type: {
      value: { type: Number, required: true },
      volume: {
        type: String,
        enum: Volume,
        default: Volume.Units,
      },
    },
  })
  quantity: {
    value: number;
    volume: Volume;
  };
}

@Schema({ timestamps: true })
export class Recipe {
  @ApiProperty({
    description: 'Recipe Id',
    example: 'RP-MAK-0001',
    required: true,
  })
  @Prop({ unique: true })
  recipeId: string;

  @ApiProperty({
    description: 'Sale Item ID',
    example: '66a22540e160fa4c2c0ec372',
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'Item',
    required: true,
  })
  saleItemId: Types.ObjectId;

  @ApiProperty({
    description: 'Chef ID',
    example: '66a22540e160fa4c2c0ec372',
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'Employee',
    required: true,
  })
  chefId: Types.ObjectId;

  @ApiProperty({
    description: 'List of ingredients',
    type: [ItemModel],
    example: [
      {
        itemId: '66a22540e160fa4c2c0ec372',
        itemName: 'Item 1',
        quantity: { value: 10, volume: 'kg' },
      },
      {
        itemId: '66a22540e160fa4c2c0ec373',
        itemName: 'Item 2',
        quantity: { value: 5, volume: 'L' },
      },
    ],
  })
  @Prop({
    type: [ItemModel],
    required: true,
  })
  ingredients: ItemModel[];

  @ApiProperty({
    description: 'Comment',
    example: 'Change cheese quantity',
  })
  @Prop({
    required: false,
  })
  comment: string;

  @ApiProperty({
    description: 'Reply',
    example: 'Cheese quantity changed',
  })
  @Prop({
    required: false,
  })
  reply: string;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);

RecipeSchema.pre('save', async function (next) {
  if (!this.isNew) {
    return next();
  }
  const lastRecipe = await this.model('Recipe').findOne({}).sort({ _id: -1 }).exec();

  if (!lastRecipe || !(lastRecipe as unknown as Recipe).recipeId) {
    this.recipeId = 'PO-MAK-0001';
  } else {
    const lastRecipeId = (lastRecipe as unknown as Recipe).recipeId;
    this.recipeId = InvoiceNumber.next(lastRecipeId);
  }
  next();
});
