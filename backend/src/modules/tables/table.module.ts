import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TableSchema } from './table.schema';
import { TableController } from './table.controller';
import { TableService } from './table.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Table', schema: TableSchema }])],
  controllers: [TableController],
  exports: [TableService],
  providers: [TableService],
})
export class TableModule {}
