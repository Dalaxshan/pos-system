import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { SalesPaymentStatus } from 'src/modules/sales/enum/sales-payment-status';

export class UpdatePaymentStatusDto {
  @ApiProperty({
    description: 'Payment Status',
    example: 'PENDING',
  })
  @IsEnum(SalesPaymentStatus, { message: 'Invalid status' })
  paymentStatus: SalesPaymentStatus;
}
