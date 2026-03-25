import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateRecipeCommentDto {
  @ApiProperty({
    description: 'Comment about recipe',
    example: 'Change cheese quantity',
  })
  @IsOptional()
  comment: string;
}
