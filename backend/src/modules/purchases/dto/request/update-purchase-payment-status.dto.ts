import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { PurchasePaymentStatus } from '../../enum/purchase-payment-status';

export class UpdatePaymentStatusDto {
  @ApiProperty()
  @IsEnum(PurchasePaymentStatus, { message: 'Invalid status' })
  paymentStatus: PurchasePaymentStatus;
}
