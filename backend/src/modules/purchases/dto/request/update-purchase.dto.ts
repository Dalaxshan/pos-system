import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsEnum } from 'class-validator';
import { Types } from 'mongoose';
import { PurchasePaymentStatus } from '../../enum/purchase-payment-status';
import { PurchaseStatus } from '../../enum/purchase-status';
import { OrderItemDto } from './create-purchase.dto';
export class UpdateOrderDto {
  @ApiProperty({
    description: 'Employee Id',
    example: '66a22540e160fa4c2c0ec372',
  })
  @IsNotEmpty()
  employeeId: Types.ObjectId;

  @ApiProperty({
    description: 'Supplier Id',
    example: '66a22540e160fa4c2c0ec372',
  })
  @IsNotEmpty()
  supplierId: Types.ObjectId;

  @ApiProperty({
    description: 'Items in order',
    type: [OrderItemDto],
  })
  @IsArray()
  items: OrderItemDto[];

  @ApiProperty({
    description: 'discount for purchase order',
    example: 10,
  })
  @IsNotEmpty()
  discount: number;

  @ApiProperty({
    description: 'Delivery status of purchase order',
    example: 'Delivered',
  })
  @IsEnum(PurchaseStatus)
  deliveryStatus: string;

  @ApiProperty({
    description: 'Payment status of purchase order',
    example: 'Paid',
  })
  @IsEnum(PurchasePaymentStatus)
  paymentStatus: string;
}
