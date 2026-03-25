import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Volume } from 'src/modules/items/enum/item-volume';

export class QtyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  value: number;

  @ApiProperty()
  @IsEnum(Volume, { message: 'Invalid volume type' })
  @IsOptional()
  volume: Volume;
}
