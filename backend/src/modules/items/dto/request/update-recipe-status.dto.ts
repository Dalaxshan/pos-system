import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { RecipeStatus } from 'src/modules/items/enum/recipe.status';

export class UpdateRecipeStatusDto {
  @ApiProperty({
    description: 'Recipe Status',
    example: 'Approved',
  })
  @IsEnum(RecipeStatus, {
    message: 'The recipe status needs to be one of the following: pending, approved, or canceled',
  })
  recipeStatus: RecipeStatus;
}
