import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { TableStatus } from './enum/table-status';
import { HydratedDocument } from 'mongoose';

export type TableDocument = HydratedDocument<Table>;
@Schema({ timestamps: true })
export class Table {
  @ApiProperty({
    description: 'name of the table',
    example: 'T1',
  })
  @Prop({
    required: true,
  })
  tableName: string;

  @ApiProperty({
    description: 'Id of the branch',
    example: '626222541236fa4c2c0ec372',
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'Branch',
  })
  branchId: Types.ObjectId;

  @ApiProperty({
    description: 'No of chairs',
    example: '5',
  })
  @Prop()
  chairs: number;

  @ApiProperty({
    description: 'is the table is occupied or not',
    example: 'true',
  })
  @Prop({
    type: String,
    enum: TableStatus,
    default: TableStatus.Available,
  })
  tableStatus: TableStatus;
}

export const TableSchema = SchemaFactory.createForClass(Table);
