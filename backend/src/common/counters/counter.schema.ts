import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CounterDocument = HydratedDocument<Counter>;

@Schema()
export class Counter {
  @ApiProperty({
    description: 'The pattern used for the sequence, which should be unique.',
    example: 'I-MAK-2024',
  })
  @Prop({ required: true, unique: true })
  sequencePattern: string;

  @ApiProperty({
    description: 'The current value of the sequence.',
    example: 5,
  })
  @Prop({ required: true, default: 0 })
  sequenceValue: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);
