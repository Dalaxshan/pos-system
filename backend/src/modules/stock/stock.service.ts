import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StockDocument } from './stock.schema';
import { CreateStockDto } from './dto/request/create-stocks.dto';
import { UpdateStockDto } from './dto/request/update-stocks.dto';
import { RecipeService } from 'src/modules/recipes/recipe.service';
import { ItemService } from '../items/item.service';
import { PurchaseService } from '../purchases/purchase.service';
import { PurchaseItem } from '../purchases/interfaces/purchase-item';

@Injectable()
export class StockService {
  constructor(
    @InjectModel('Stock')
    private readonly stockModel: Model<StockDocument>,
    private readonly recipeService: RecipeService,
    private readonly purchaseService: PurchaseService,
    private readonly itemService: ItemService,
  ) {}

  async getAllStocks(): Promise<StockDocument[]> {
    return await this.stockModel
      .find()
      .populate({ path: 'employeeId', select: 'name _id' })
      .populate('recipeId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getStockById(id: string): Promise<StockDocument> {
    const stock = await this.stockModel.findById(id);
    if (!stock) {
      throw new NotFoundException('Stock not found');
    }
    return stock;
  }

  async registerStock(createStockDto: CreateStockDto): Promise<StockDocument> {
    let { salesItemId, recipeId, totQty, comments } = createStockDto;

    //check sales item exists
    const salesItem = await this.itemService.getItemById(salesItemId.toString());

    if (!salesItem) {
      throw new NotFoundException(`Sales Item not found for ID ${salesItemId}`);
    }

    if (totQty === undefined || totQty === null || totQty === 0) {
      totQty = 1;
    }
    // Fetch recipe details
    const recipe = await this.recipeService.getRecipeById(recipeId.toString());
    if (!recipe) {
      throw new NotFoundException(`Recipe not found for ID ${recipeId}`);
    }

    // Calculate the total quantity of ingredients based on the stock's total quantity
    const updatedIngredients = recipe.ingredients.map((ingredient) => {
      //get stock item details
      return {
        ...ingredient,
        quantity: {
          value: totQty === 1 ? ingredient.quantity.value : ingredient.quantity.value * totQty,
          volume: ingredient.quantity.volume,
        },
      };
    });

    // const newTotalQty = updatedIngredients.reduce(
    //   (acc, ingredient) => acc + ingredient.quantity.value,
    //   0,
    // );

    const newStock = new this.stockModel({
      ...createStockDto,
      recipeId: recipe._id,
      salesItem: {
        itemId: salesItem._id,
        salesItemId: salesItem.itemId,
        itemName: salesItem.name,
      },
      items: updatedIngredients,
      employeeId: createStockDto.employeeId,
      comments,
    });

    return await newStock.save();
  }

  /**getAll items in stock
   * @return item details
   */
  async getAllStockItems(): Promise<PurchaseItem[]> {
    const stocks = await this.stockModel.find().exec();

    //get all items in stock
    const allItems = stocks.flatMap((stock) => {
      return stock.items;
    });
    return allItems;
  }

  //calculate total stock by item
  async calculateTotalStock(): Promise<PurchaseItem[]> {
    const stockItems = await this.getAllStockItems();

    //calculate total stock in same item
    const totalStock = stockItems.reduce((acc, item) => {
      const found = acc.find((stock) => stock.itemId === item.itemId);
      if (found) {
        found.itemId = item.itemId;
        found.itemName = item.itemName;
        found.quantity.value += item.quantity.value;
        return acc;
      }
      return [...acc, item];
    }, []);

    return totalStock;
  }

  //calculate current stock
  async calculateRemainingStock(): Promise<PurchaseItem[]> {
    const purchaseItems = await this.purchaseService.calculateTotalPurchase(); // get total purchase
    const stockItems = await this.calculateTotalStock(); // get total stock

    //calculate current stock(purcchaseItem value - stockItem value)
    const currentStock = purchaseItems.map((purchaseItem) => {
      const stockItem = stockItems.find((stock) => stock.itemId === purchaseItem.itemId);
      if (stockItem) {
        return {
          itemId: purchaseItem.itemId,
          itemName: purchaseItem.itemName,
          quantity: {
            value:
              purchaseItem.quantity.value - stockItem.quantity.value < 0
                ? 0
                : purchaseItem.quantity.value - stockItem.quantity.value,
            volume: purchaseItem.quantity.volume,
          },
        };
      }
      return purchaseItem;
    });

    return currentStock;
  }

  async updateStock(id: string, updateStockDto: UpdateStockDto): Promise<StockDocument> {
    const stockExists = await this.stockModel.findById(id).exec();
    let { salesItemId, recipeId, totQty } = updateStockDto;

    if (!stockExists) {
      throw new NotFoundException('Stock not found');
    }

    const salesItem = await this.itemService.getItemById(salesItemId.toString());

    if (!salesItem) {
      throw new NotFoundException(`Sales Item not found for ID ${salesItemId}`);
    }

    if (totQty === undefined || totQty === null || totQty === 0) {
      totQty = 1;
    }
    // Fetch recipe details
    const recipe = await this.recipeService.getRecipeById(recipeId.toString());
    if (!recipe) {
      throw new NotFoundException(`Recipe not found for ID ${recipeId}`);
    }

    // Calculate the total quantity of ingredients based on the stock's total quantity
    const updatedIngredients = recipe.ingredients.map((ingredient) => {
      return {
        ...ingredient,
        quantity: {
          value: totQty === 1 ? ingredient.quantity.value : ingredient.quantity.value * totQty,
          volume: ingredient.quantity.volume,
        },
      };
    });

    try {
      const updateFields: any = {
        ...updateStockDto,
        recipeId: recipe._id,
        salesItem: {
          itemId: salesItem._id,
          salesItemId: salesItem.itemId,
          itemName: salesItem.name,
        },
        items: updatedIngredients,
        comments: updateStockDto.comments,
      };

      const updatedStock = await this.stockModel
        .findByIdAndUpdate({ _id: id }, updateFields, { new: true })
        .exec();

      return updatedStock;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update stock: ', error.message);
    }
  }

  async deleteStock(id: string): Promise<void> {
    try {
      await this.stockModel.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
