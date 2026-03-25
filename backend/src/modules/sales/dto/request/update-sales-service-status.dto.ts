import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { SalesServiceStatus } from 'src/modules/sales/enum/sales-service-status';

export class UpdateServiceStatusDto {
  @ApiProperty({
    description: 'Service Status',
    example: 'Dine-In',
  })
  @IsEnum(SalesServiceStatus, { message: 'Invalid status' })
  serviceStatus: SalesServiceStatus;
}
