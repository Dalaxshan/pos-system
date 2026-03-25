import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatus } from 'src/modules/sales/enum/order-status';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'Order Status',
    example: 'Placed',
  })
  @IsEnum(OrderStatus, { message: 'Invalid status' })
  orderStatus: OrderStatus;
}
