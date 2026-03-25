import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TableStatus } from 'src/modules/tables/enum/table-status';

export class UpdateTableStatusDto {
  @ApiProperty({
    description: 'Table Status',
    example: 'Occupied',
  })
  @IsEnum(TableStatus, { message: 'Invalid status' })
  tableStatus: string;
}
