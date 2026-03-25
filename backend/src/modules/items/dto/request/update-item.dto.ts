import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { QtyDto } from './quantity.dto';
import { CustomizationDto } from './customization.dto';
import { Types } from 'mongoose';
import { toObjectId } from 'src/utils/to-object-id';
import { toBoolean } from 'src/utils/to-boolean';

export class UpdateItemDto {
  @ApiProperty({
    description: 'Name of the item',
    example: 'Apple',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Category Id',
    example: '620000563259742v2',
  })
  @IsOptional()
  @Transform(({ value }) => toObjectId(value), { toClassOnly: true })
  categoryId?: Types.ObjectId;

  @ApiPropertyOptional({
    description: 'Recipe Id',
    example: '620000563259742v2',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => toObjectId(value), { toClassOnly: true })
  recipeId?: Types.ObjectId;

  @ApiPropertyOptional({
    description: 'Supplier Id',
    example: '620000563259742v2',
  })
  @IsOptional()
  @Transform(({ value }) => toObjectId(value), { toClassOnly: true })
  supplierId?: Types.ObjectId;

  @ApiPropertyOptional({
    description: 'Employee Id',
    example: '620000563259742v2',
  })
  @IsOptional()
  @Transform(({ value }) => toObjectId(value), { toClassOnly: true })
  employeeId?: Types.ObjectId;

  @ApiProperty({
    description: 'Is item for sale',
    example: true,
  })
  @IsNotEmpty()
  @Transform(({ value }) => toBoolean(value), { toClassOnly: true })
  isForSale: boolean;

  @ApiPropertyOptional({
    description: 'Description of the item',
    example: 'Fresh Apple',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Unit price of an item',
    example: 1000,
  })
  @IsNotEmpty()
  unitPrice: number;

  @ApiProperty({
    description: 'Quantity of the item',
    type: QtyDto,
    example: { quantity: 10, volume: 'liters' },
  })
  @ValidateNested()
  @Type(() => QtyDto)
  quantity: QtyDto;

  @ApiPropertyOptional({
    description: 'Discount of the item',
    example: 10,
  })
  @IsOptional()
  discount?: number;

  @ApiPropertyOptional({
    description: 'Item customizations',
    type: [CustomizationDto],
    example: [
      {
        variation: 'Extra cheese',
        price: 300,
        isRequired: true,
      },
    ],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CustomizationDto)
  customizations?: CustomizationDto[];

  @ApiPropertyOptional({
    description: 'Cover image of the item',
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsString()
  itemImage?: string;
}
