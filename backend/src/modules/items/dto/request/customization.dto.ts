import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { toBoolean } from 'src/utils/to-boolean';

export class CustomizationDto {
  @ApiProperty({
    description: 'Item customization',
    example: 'Extra cheese',
  })
  @IsOptional()
  variation: string;

  @ApiProperty({
    description: 'Extra charge',
    example: 'LKR 120',
  })
  @IsNotEmpty()
  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  price: number;

  @ApiProperty({
    description: 'Choose the variation required or not',
    example: 'true',
  })
  @IsNotEmpty()
  @Transform(({ value }) => toBoolean(value), { toClassOnly: true })
  isRequired: boolean;
}
