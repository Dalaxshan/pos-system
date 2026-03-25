import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type SupplierDocument = HydratedDocument<Supplier>;

@Schema({ timestamps: true })
export class Supplier {
  @ApiProperty({
    description: 'The name of the supplier',
    example: 'John Doe',
  })
  @Prop({
    required: true,
  })
  name: string;

  @ApiProperty({
    description: 'The email of the company',
    example: 'info@gmail.com',
  })
  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @ApiProperty({
    description: 'The contact number of the supplier',
    example: '09123456789',
  })
  @Prop()
  contactNumber: string;

  @ApiProperty({
    description: 'The registered date of the supplier',
    example: '2024-09-01T00:00:00.000Z',
  })
  @Prop({
    type: Date,
  })
  regDate: Date;

  @ApiProperty({
    description: 'The address of the supplier',
    example: '123 Main St.',
  })
  @Prop()
  address: string;

  @ApiProperty({
    description: 'The name of the company',
    example: 'The ABC Company',
  })
  @Prop()
  companyName: string;

  @ApiProperty({
    description: 'The logo of the supplier',
    example: 'https://www.example.com/logo.png',
  })
  @Prop({
    type: String,
    optional: true,
  })
  logoUrl: string;

  @ApiProperty({
    description: 'Unique identifier for the supplier',
    example: 'ma-0001',
  })
  @Prop({
    unique: true,
  })
  supplierId: string;
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);
