import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { TableStatus } from '../enum/table-status';

export class CreateTableDto {
  @ApiProperty()
  @IsMongoId()
  branchId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString({ message: 'Name must be a string' })
  tableName: string;

  @ApiProperty()
  @IsNotEmpty()
  chairs: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(TableStatus)
  tableStatus: string;
}
