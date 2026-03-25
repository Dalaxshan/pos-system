import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RecipeDocument } from './recipe.schema';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { ItemService } from 'src/modules/items/item.service';
import { RecipeStatus } from 'src/modules/items/enum/recipe.status';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { EmployeeService } from 'src/modules/employees/employee.service';
import { NotificationType } from '../../common/enums/notification-type';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { toObjectId } from 'src/utils/to-object-id';
import { UpdateRecipeCommentDto } from './dto/update-comment.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';

@Injectable()
export class RecipeService {
  constructor(
    @InjectModel('Recipe')
    private readonly recipeModel: Model<RecipeDocument>,
    private readonly itemService: ItemService,
    private readonly employeeService: EmployeeService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * create recipe
   * @params recipeDto
   *
   */
  async createRecipe(recipeDto: CreateRecipeDto): Promise<RecipeDocument> {
    try {
      // Check if the recipe already exists
      const existingRecipe = await this.recipeModel
        .findOne({ saleItemId: recipeDto.saleItemId })
        .exec();

      if (existingRecipe) {
        throw new ConflictException('Recipe already exists');
      }
      // Check for duplicate items in the ingredients list
      const itemIds = recipeDto.ingredients.map((purchaseItem) => purchaseItem.itemId.toString());
      const uniqueItemIds = new Set(itemIds);

      if (itemIds.length !== uniqueItemIds.size) {
        throw new BadRequestException('Duplicate item found in the recipe ingredients');
      }

      // Validate and map ingredients
      const ingredients = await Promise.all(
        recipeDto.ingredients.map(async (purchaseItem) => {
          const item = await this.itemService.getItemById(purchaseItem.itemId.toString());
          if (!item) {
            throw new NotFoundException(`Item not found for ID ${purchaseItem.itemId}`);
          }
          return {
            _id: item._id,
            itemId: item.itemId,
            itemName: item.name,
            quantity: {
              value: purchaseItem.quantity.value,
              volume: purchaseItem.quantity.volume,
            },
          };
        }),
      );

      // Create new recipe
      const newRecipe = new this.recipeModel({
        ...recipeDto,
        saleItemId: recipeDto.saleItemId,
        ingredients,
      });

      const createdRecipe = await newRecipe.save();

      if (createdRecipe) {
        // Update the related item to mark it as having a recipe
        await this.itemService.updateRecipe(recipeDto.saleItemId.toString(), {
          recipeId: createdRecipe._id,
        });

        // Update the related item to mark it as having a recipe status
        await this.itemService.updateRecipeStatus(recipeDto.saleItemId.toString(), {
          recipeStatus: RecipeStatus.NotApproved,
        });
        // Emit recipe created event for notifications
        this.eventEmitter.emit('recipe.created', {
          createdBy: createdRecipe.chefId,
          type: NotificationType.NewRecipe,
          recipeId: createdRecipe._id, // Properly pass recipeId
          name: createdRecipe.saleItemId,
        });
      }

      return createdRecipe;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  /**
   * View recipe by Id
   * @param recipe Id
   * @return recipe
   */
  async getRecipeById(id: string): Promise<RecipeDocument> {
    try {
      let convertedId = toObjectId(id);
      const recipe = await this.recipeModel
        .findById(convertedId)
        .populate('ingredients')
        .populate('saleItemId')
        .sort({ createdAt: -1 })
        .exec();
      if (!recipe) {
        throw new NotFoundException('Recipe is not found');
      }
      return recipe;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**
   * Edit recipe by recipeId
   * @param id - Recipe ID
   * @param updateRecipe - DTO containing updated recipe details
   * @return Updated recipe
   */
  async updateRecipe(id: string, updateRecipe: UpdateRecipeDto): Promise<RecipeDocument> {
    const recipeExists = await this.recipeModel.findById(id).exec();
    if (!recipeExists) {
      throw new NotFoundException('Recipe does not exist');
    }

    updateRecipe.ingredients.forEach((item) => {
      console.log('Ingredient quantity:', item.quantity);
    });

    const chef = await this.employeeService.getEmployeeById(updateRecipe.chefId.toString());
    if (!chef) {
      throw new NotFoundException('Chef not found');
    }

    if (!updateRecipe.ingredients || updateRecipe.ingredients.length === 0) {
      throw new BadRequestException('Ingredients array must not be empty');
    }

    const recipes = await Promise.all(
      updateRecipe.ingredients.map(async (ingredient) => {
        const item = await this.itemService.getItemById(ingredient.itemId.toString());
        if (!item) {
          throw new NotFoundException(`Item not found for id ${ingredient.itemId}`);
        }
        return {
          _id: item._id,
          itemId: item.itemId,
          itemName: item.name,
          quantity: {
            value: ingredient.quantity.value,
            volume: ingredient.quantity.volume,
          },
        };
      }),
    );

    const updatedRecipe = await this.recipeModel.findByIdAndUpdate(
      id,
      {
        ...updateRecipe,
        chefId: chef._id,
        ingredients: recipes,
      },
      { new: true },
    );

    if (!updatedRecipe) {
      throw new BadRequestException('Failed to update recipe');
    }

    return updatedRecipe;
  }

  /**
   * update recipe comment
   * @param recipeId
   * @returns updated recipe comment
   */

  async updateRecipeComment(
    id: string,
    updateRecipeCommentDto: UpdateRecipeCommentDto,
  ): Promise<RecipeDocument> {
    const updatedComment = await this.recipeModel
      .findByIdAndUpdate(id, { comment: updateRecipeCommentDto.comment }, { new: true })
      .exec();

    if (!updatedComment) {
      throw new NotFoundException('Recipe not found or failed to update comment');
    }

    return updatedComment;
  }

  /**
   * update reply to comment
   * @param recipeId
   * @returns updated reply
   */
  async updateReplyComment(id: string, updateReplyDto: UpdateReplyDto): Promise<RecipeDocument> {
    const updatedReply = await this.recipeModel
      .findByIdAndUpdate(id, { reply: updateReplyDto.reply }, { new: true })
      .exec();

    if (!updatedReply) {
      throw new NotFoundException('Recipe not found or failed to update comment');
    }

    return updatedReply;
  }
}
