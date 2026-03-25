import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Customer Name',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString({ message: '  Name must be a string' })
  customerName: string;

  @ApiProperty({
    description: 'Contact Number of the customer',
    example: '1234567890',
  })
  @IsString()
  contactNo: string;
}
