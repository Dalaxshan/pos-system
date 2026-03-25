import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { NotificationType } from '../../../../common/enums/notification-type';

export class CreateNotificationRequestDto {
  @ApiProperty({
    description: 'Created person associated with the notification',
    example: '60d2c6d7c8f8d9224c8f8b7a',
  })
  createdBy: Types.ObjectId;

  @ApiProperty({
    description: 'Name of the notification',
    example: 'New Item Notification',
  })
  name: string;

  @ApiProperty({
    description: 'The type of notification',
    example: NotificationType.NewPurchaseItem,
    enum: NotificationType,
  })
  type: string;

  @ApiProperty({
    description: 'The item id',
    example: '60d2c6d7c8f8d9224c8f8b7a',
    required: false,
  })
  @IsMongoId()
  itemId: Types.ObjectId;

  @ApiProperty({
    description: 'The sales order id',
    example: '60d2c6d7c8f8d9224c8f8b7a',
    required: false,
  })
  @IsMongoId()
  salesId: Types.ObjectId;

  @ApiProperty({
    description: 'The recipe id',
    example: '60d2c6d7c8f8d9224c8f8b7a',
    required: false,
  })
  @IsMongoId()
  recipeId: Types.ObjectId;

  @ApiProperty({
    description: 'The purchase order id',
    example: '60d2c6d7c8f8d9224c8f8b7a',
    required: false,
  })
  @IsMongoId()
  purchaseId: Types.ObjectId;
}
