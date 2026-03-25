import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemSchema } from './item.schema';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { FileUploadModule } from 'src/common/file-upload/file-upload.module';
import { SupplierSchema } from 'src/modules/suppliers/supplier.schema';
import { SupplierService } from 'src/modules/suppliers/supplier.service';
import { CategorySchema } from 'src/modules/categories/category.schema';
import { CategoryService } from 'src/modules/categories/category.service';
import { RecipeSchema } from 'src/modules/recipes/recipe.schema';
import { EmployeeModule } from '../employees/employee.module';
import { CounterModule } from 'src/common/counters/counter.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Item', schema: ItemSchema }]),
    MongooseModule.forFeature([{ name: 'Supplier', schema: SupplierSchema }]),
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
    MongooseModule.forFeature([{ name: 'Recipe', schema: RecipeSchema }]),
    FileUploadModule,
    EmployeeModule,
    CounterModule,
  ],
  controllers: [ItemController],
  exports: [ItemService, MongooseModule],
  providers: [ItemService, SupplierService, CategoryService],
})
export class ItemModule {}
