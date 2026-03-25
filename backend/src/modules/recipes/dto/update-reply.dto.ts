import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateReplyDto {
  @ApiProperty({
    description: 'Reply comment',
    example: 'Cheese quantity changed',
  })
  @IsOptional()
  reply: string;
}
