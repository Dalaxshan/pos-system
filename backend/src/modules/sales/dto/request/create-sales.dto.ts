import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsArray, ValidateNested, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { OrderStatus } from 'src/modules/sales/enum/order-status';
import { SalesPaymentStatus } from 'src/modules/sales/enum/sales-payment-status';
import { SalesServiceStatus } from 'src/modules/sales/enum/sales-service-status';
import { PaymentType } from '../../enum/payment-type';

//customizations dto
export class CustomizationDto {
  @ApiProperty({
    description: 'Customization variation',
    example: 'Extra cheese',
  })
  variation: string;

  @ApiProperty({
    description: 'Extra charge of the variation',
  })
  @IsNumber()
  price: number;
}

//Items dto
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
    description: 'Quantity of sales order',
    example: 2,
  })
  quantity: number;

  @ApiProperty({
    description: 'discount for sales order',
    example: 10,
  })
  @IsOptional()
  discount: number;

  @ApiProperty({
    type: [CustomizationDto],
    description: 'Customizations for the item',
    example: '[{"variation":"Extra cheese","price":150}]',
  })
  @ValidateNested({ each: true })
  @Type(() => CustomizationDto)
  customizations: CustomizationDto[];

  @ApiProperty({
    description: 'total amount of item(unit price+charges)',
    example: 1250,
  })
  @IsOptional()
  totalAmount: number;

  @ApiProperty({
    description: 'Extra notes',
    example: 'Coffee must be sugar free.',
  })
  note: string;
}

export class CreateSalesDto {
  @ApiProperty({
    description: 'Customer name',
    example: 'john doe',
  })
  @IsOptional()
  customerName: string;

  @ApiProperty({
    description: 'Table Id',
    example: '66a22540e160fa4c2c0ec372',
  })
  @IsOptional()
  @IsString()
  tableId: string;

  @ApiProperty({
    description: 'Customer contact no',
    example: '0712233692',
  })
  @IsOptional()
  contactNo: string;

  @ApiProperty({
    type: [OrderItemDto],
    description: 'Items in the order',
    example:
      '[{"itemId":"I-MAK-0001","itemName":"Apple","quantity":2,"discount":10,"subTotal":2000,"grandTotal":1900}]',
  })
  @IsArray()
  items: OrderItemDto[];

  @ApiProperty({
    description: 'Employee Id',
    example: '2633597d1b1b1b1b1b1b',
    required: false,
  })
  @IsOptional()
  @IsString()
  employeeId: string;

  @ApiProperty({
    description: 'Quantity of total items',
    example: 2,
  })
  quantity: number;

  @ApiProperty({
    description: 'Discount for sales order',
    example: 10,
  })
  @IsOptional()
  discount: number;

  @ApiProperty({
    description: 'Payment Status',
    example: 'PENDING',
  })
  @IsEnum(SalesPaymentStatus)
  paymentStatus: string;

  @ApiProperty({
    description: 'Service Status',
    example: 'Dine-in',
  })
  @IsEnum(SalesServiceStatus)
  serviceStatus: string;

  @ApiProperty({
    description: 'pre order date',
    example: '2021-09-01T00:00:00.000Z',
  })
  @IsOptional()
  preOrderDate?: Date;

  @ApiProperty({
    description: 'Order Status',
    example: 'Placed',
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  orderStatus: string;

  @ApiProperty({
    description: 'Payment type',
    example: 'CASH',
  })
  @IsEnum(PaymentType)
  paymentType: string;
}
