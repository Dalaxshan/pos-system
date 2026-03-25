import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StockSchema } from './stock.schema';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { RecipeModule } from 'src/modules/recipes/recipe.module';
import { ItemModule } from '../items/item.module';
import { PurchaseModule } from '../purchases/purchase.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Stock', schema: StockSchema }]),
    RecipeModule,
    ItemModule,
    PurchaseModule,
  ],

  controllers: [StockController],
  exports: [StockService],
  providers: [StockService],
})
export class StockModule {}
