import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { InvoiceNumber } from 'invoice-number';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @ApiProperty({
    description: 'The unique identifier for the category',
    example: 'CA-MAK-0001',
  })
  @Prop({
    unique: true,
  })
  categoryId: string;

  @ApiProperty({
    description: 'The name of the category',
    example: 'Electronics',
  })
  @Prop({
    required: true,
  })
  name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.pre('save', async function (next) {
  if (!this.isNew) {
    return next();
  }
  const lastCategory = await this.model('Category').findOne({}).sort({ _id: -1 }).exec();
  if (!lastCategory || !(lastCategory as unknown as Category).categoryId) {
    this.categoryId = `CA-MAK-0001`;
  } else {
    const pattern = InvoiceNumber.next((lastCategory as unknown as Category).categoryId);
    this.categoryId = pattern;
  }
  next();
});
