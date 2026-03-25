import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { IsArray, IsEnum, IsMongoId, IsOptional, ValidateNested } from 'class-validator';
import { PurchasePaymentStatus } from '../../enum/purchase-payment-status';
import { PurchaseStatus } from '../../enum/purchase-status';
import { QtyDto } from 'src/modules/items/dto/request/quantity.dto';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty({
    description: 'Item Id',
    example: 'I-MAK-0001',
  })
  itemId: string;

  @ApiProperty({
    description: 'Item Name',
    example: 'Apple',
  })
  itemName: string;

  @ApiProperty({
    description: 'Quantity of the item',
    example: { quantity: 10, volume: 'liters' },
  })
  @ValidateNested()
  @Type(() => QtyDto)
  quantity: QtyDto;

  @ApiProperty({
    description: 'discount for purchase order',
    example: 10,
  })
  @IsOptional()
  discount?: number;
}

export class CreatePurchaseDto {
  @ApiProperty({
    description: 'Employee Id',
    example: '66a22540e160fa4c2c0ec372',
  })
  @IsMongoId()
  employeeId: Types.ObjectId;

  @ApiProperty({
    description: 'Supplier Id',
    example: '66a22540e160fa4c2c0ec372',
  })
  @IsMongoId()
  supplierId: Types.ObjectId;

  @ApiProperty({
    description: 'Items in the order',
    type: [OrderItemDto],
    example: '[{"itemId":"I-MAK-0001","itemName":"Apple","quantity":2,"discount":10}]',
  })
  @IsArray()
  items: OrderItemDto[];

  @ApiProperty({
    description: 'Discount for purchase order',
    example: 10,
  })
  @IsOptional()
  discount: number;

  @ApiProperty({
    description: 'Delivery status',
    enum: PurchaseStatus,
    example: PurchaseStatus.Pending,
  })
  @IsEnum(PurchaseStatus)
  deliveryStatus: string;

  @ApiProperty({
    description: 'Payment status',
    enum: PurchasePaymentStatus,
    example: PurchasePaymentStatus.Unpaid,
  })
  @IsEnum(PurchasePaymentStatus)
  paymentStatus: string;
}
