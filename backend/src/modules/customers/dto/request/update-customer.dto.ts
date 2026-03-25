import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateCustomerDto {
  @ApiPropertyOptional({
    description: 'Customer Name',
    example: 'John Doe',
  })
  @IsOptional()
  customerName?: string;

  @ApiPropertyOptional({
    description: 'Contact Number of the customer',
    example: '1234567890',
  })
  @IsOptional()
  contactNo?: string;
}
