import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ItemModule } from 'src/modules/items/item.module';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { RecipeSchema } from './recipe.schema';
import { EmployeeModule } from 'src/modules/employees/employee.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Recipe', schema: RecipeSchema }]),
    ItemModule,
    EmployeeModule,
  ],
  controllers: [RecipeController],
  exports: [RecipeService],
  providers: [RecipeService],
})
export class RecipeModule {}
