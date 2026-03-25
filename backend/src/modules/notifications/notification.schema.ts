import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '../../common/enums/notification-type';
import { HydratedDocument } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @ApiProperty({
    description: 'Employee who created the notification',
    example: '60d2c6d7c8f8d9224c8f8b7a',
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'Employee',
    required: true,
  })
  createdBy: Types.ObjectId;

  @ApiProperty({
    description: 'Name or title of the notification',
    example: 'New Item Notification',
  })
  @Prop({
    required: true,
  })
  name: string;

  @ApiProperty({
    description: 'Type of the notification',
    example: NotificationType.NewSalesItem,
    enum: NotificationType,
  })
  @Prop({
    type: String,
    enum: NotificationType,
    required: true,
  })
  type: NotificationType;

  @ApiProperty({
    description: 'Item ID associated with the notification, if applicable',
    example: '60d2c6d7c8f8d9224c8f8b7a',
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'Item',
    required: false,
  })
  itemId: Types.ObjectId;

  @ApiProperty({
    description: 'Sales ID associated with the notification, if applicable',
    example: '60d2c6d7c8f8d9224c8f8b7a',
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'Sales',
    required: false,
  })
  salesId: Types.ObjectId;

  @ApiProperty({
    description: 'Recipe ID associated with the notification, if applicable',
    example: '60d2c6d7c8f8d9224c8f8b7a',
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'Recipe',
    required: false,
  })
  recipeId: Types.ObjectId;

  @ApiProperty({
    description: 'Purchase ID associated with the notification, if applicable',
    example: '60d2c6d7c8f8d9224c8f8b7a',
  })
  @Prop({
    type: Types.ObjectId,
    ref: 'Purchase',
    required: false,
  })
  purchaseId: Types.ObjectId;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
