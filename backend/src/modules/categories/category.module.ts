import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './category.schema';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }])],
  controllers: [CategoryController],
  exports: [CategoryService],
  providers: [CategoryService],
})
export class CategoryModule {}
