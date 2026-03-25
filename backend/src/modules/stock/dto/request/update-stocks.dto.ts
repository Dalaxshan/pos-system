import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsNotEmpty, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class ItemDto {
  @ApiProperty({
    description: 'Item Id',
    example: '66a22540e160fa4c2c0ec372',
  })
  @IsMongoId()
  itemId: Types.ObjectId;

  @ApiProperty({
    description: 'Item Name',
    example: 'Apple',
  })
  itemName: string;

  @ApiProperty({
    description: 'Quantity of stock order',
    example: 2,
  })
  quantity: number;
}

export class UpdateStockDto {
  @ApiProperty({
    description: 'Receipe Id',
    example: '66a22540e160fa4c2c0ec372',
  })
  @IsMongoId()
  recipeId: Types.ObjectId;

  @ApiProperty({
    description: 'Sales item Id',
    example: '66a22540e160fa4c2c0ec372',
  })
  @IsMongoId()
  salesItemId: Types.ObjectId;

  @ApiProperty({
    type: [ItemDto],
    description: 'Items in the order',
    example: '[{"itemId":"I-MAK-0001","itemName":"Apple","quantity":2,}]',
  })
  @IsArray()
  items: ItemDto[];

  @ApiProperty({
    description: 'Employee Id',
    example: '2633597d1b1b1b1b1b1b',
  })
  @IsMongoId()
  employeeId: Types.ObjectId;

  @ApiProperty({
    description: 'Quantity of stock order',
    example: 2,
  })
  @IsNotEmpty()
  totQty: number;

  @ApiProperty({
    description: 'Additional comment on stock ',
    example: 'added butter instead of oil since out of stock',
  })
  @IsOptional()
  comments?: string;
}
