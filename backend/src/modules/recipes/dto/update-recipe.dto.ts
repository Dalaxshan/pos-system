import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { ItemDto } from 'src/modules/recipes/dto/create-recipe.dto';

export class UpdateRecipeDto {
  @ApiProperty({
    description: 'Item ID',
    example: '620000563259742v2',
    required: false,
  })
  @IsMongoId({ message: 'salesId must be a valid ObjectId' })
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
  @IsMongoId({ message: 'chefId must be a valid ObjectId' })
  chefId: Types.ObjectId;

  @ApiProperty({
    description: 'Comment about recipe',
    example: 'Change cheese quantity',
  })
  comment: string;
}
