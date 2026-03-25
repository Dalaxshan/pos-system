import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsArray, IsMongoId, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';
import { QtyDto } from './quantity.dto';
import { toObjectId } from 'src/utils/to-object-id';

export class ItemDto {
  @ApiProperty({
    description: 'Item ID',
    example: '66a22540e160fa4c2c0ec37',
  })
  @IsMongoId({ message: 'itemId must be a valid ObjectId' })
  itemId: Types.ObjectId;

  @ApiProperty({
    description: 'Quantity of the items',
    example: { quantity: 20, volume: 'litre' },
  })
  @ValidateNested()
  @Type(() => QtyDto)
  quantity: QtyDto;
}

export class CreateRecipeDto {
  @ApiProperty({
    description: 'Item ID',
    example: '620000563259742v2',
  })
  @IsNotEmpty()
  @Transform(({ value }) => toObjectId(value), { toClassOnly: true })
  saleItemId: Types.ObjectId;

  @ApiProperty({
    type: [ItemDto],
    description: 'Purchase item',
  })
  @IsArray()
  ingredients: ItemDto[];

  @ApiProperty({
    description: 'Chef ID',
    example: '66a22540e160fa4c2c0ec37',
  })
  @IsOptional()
  @Transform(({ value }) => toObjectId(value), { toClassOnly: true })
  chefId: Types.ObjectId;

  @ApiProperty({
    description: 'Comment about recipe',
    example: 'Change cheese quantity',
  })
  @IsOptional()
  comment: string;
}
