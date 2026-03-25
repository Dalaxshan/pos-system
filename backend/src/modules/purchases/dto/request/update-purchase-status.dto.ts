import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { PurchaseStatus } from '../../enum/purchase-status';

export class UpdateOrderStatusDto {
  @ApiProperty()
  @IsEnum(PurchaseStatus, { message: 'Invalid status' })
  status: PurchaseStatus;
}
