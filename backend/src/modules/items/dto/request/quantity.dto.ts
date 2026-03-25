import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { ToNumberPipe } from 'src/common/pipes/to-number.pipe';
import { Volume } from 'src/modules/items/enum/item-volume';

export class QtyDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => new ToNumberPipe().transform(value))
  @IsNumber()
  @IsPositive()
  value: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(Volume)
  volume: Volume;
}
