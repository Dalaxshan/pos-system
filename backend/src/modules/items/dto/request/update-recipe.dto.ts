import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateRecipeDto {
  @ApiProperty({
    description: 'Recipe ID',
    example: '620000563259742v2',
    required: false,
  })
  @IsNotEmpty()
  recipeId: Types.ObjectId;
}
