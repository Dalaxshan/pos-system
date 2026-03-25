import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type LoginHistoryDocument = HydratedDocument<LoginHistory>;

@Schema({ timestamps: true })
export class LoginHistory {
  @ApiProperty({
    description: 'Reference to the Employee who logged in',
    type: Types.ObjectId,
    example: '60d5ec49d8a3f5c8d0f9a1b2',
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'Employee',
    required: true,
  })
  employeeId: Types.ObjectId;

  @ApiProperty({
    description: 'Name of the employee',
    example: 'John Doe',
  })
  @Prop({
    required: true,
  })
  name: string;

  @ApiProperty({
    description: 'Role of the employee during login',
    example: 'admin',
  })
  @Prop({
    required: true,
  })
  role: string;

  @ApiProperty({
    description: 'Timestamp when the employee logged in',
    type: String,
    format: 'date-time',
    example: '2024-09-12T08:00:00Z',
  })
  @Prop({
    type: Date,
    default: Date.now,
  })
  login: Date;

  @ApiProperty({
    description: 'Timestamp when the employee logged out',
    type: String,
    format: 'date-time',
    example: '2024-09-12T17:00:00Z',
    required: false,
  })
  @Prop({
    type: Date,
    default: null,
  })
  logout: Date;

  @ApiProperty({
    description: 'Indicates whether the employee is authenticated',
    type: Boolean,
    default: true,
  })
  @Prop({
    type: Boolean,
    default: true,
  })
  isAuthenticated: boolean;
}

export const LoginHistorySchema = SchemaFactory.createForClass(LoginHistory);
