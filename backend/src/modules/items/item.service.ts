import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ItemDocument } from './item.schema';
import { CreateItemDto } from './dto/request/create-item.dto';
import { UpdateItemDto } from './dto/request/update-item.dto';
import { SupplierService } from 'src/modules/suppliers/supplier.service';
import { PaginatedDto } from 'src/common/pagination/paginated.dto';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';
import { CategoryService } from 'src/modules/categories/category.service';
import { NotificationType } from '../../common/enums/notification-type';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UpdateRecipeStatusDto } from './dto/request/update-recipe-status.dto';
import { UpdateRecipeDto } from './dto/request/update-recipe.dto';
import { RecipeStatus } from './enum/recipe.status';
import { CategoryDocument } from 'src/modules/categories/category.schema';
import { SupplierDocument } from 'src/modules/suppliers/supplier.schema';
import { ItemCountByCategory } from './interfaces/item-by-categoy';
import { EmployeeService } from '../employees/employee.service';
import { toObjectId } from 'src/utils/to-object-id';
import { CounterService } from 'src/common/counters/counter.service';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel('Item') private readonly itemModel: Model<ItemDocument>,
    @InjectModel('Supplier') private readonly supplierModel: Model<SupplierDocument>,
    @InjectModel('Category') private readonly categoryModel: Model<CategoryDocument>,

    private readonly supplierService: SupplierService,
    private readonly categoryService: CategoryService,
    private readonly employeeService: EmployeeService,
    private readonly fileUploadService: FileUploadService,
    private readonly eventEmitter: EventEmitter2,
    private readonly counterService: CounterService,
  ) {}

  async createItem(item: CreateItemDto, itemImage: string): Promise<ItemDocument> {
    try {
      const existingItem = await this.itemModel
        .findOne({ name: { $regex: new RegExp(`^${item.name}$`, 'i') } })
        .exec();
      if (existingItem) {
        throw new ConflictException('Item with this name already exists');
      } else if (item.isForSale === true) {
        const category = await this.categoryService.getCategoryById(item.categoryId);
        if (!category) {
          throw new NotFoundException('Cateogry Not Found');
        }
        const employee = await this.employeeService.getEmployeeById(item.employeeId.toString());
        if (!employee) {
          throw new NotFoundException('Employee Not Found');
        }
      }
      if (item.isForSale === false) {
        const supplier = await this.supplierService.getSupplierById(item.supplierId.toString());
        if (!supplier) {
          throw new NotFoundException('Supplier Not Found');
        }
      }

      const { unitPrice, discount } = item;
      const discountAmount = unitPrice * (discount / 100);
      const netPrice = unitPrice - discountAmount;

      const mappedCustomizations = item.customizations?.map((customization) => ({
        variation: customization.variation,
        price: customization.price,
        isRequired: customization.isRequired,
      }));

      const itemId = await this.counterService.generateItemId('I-MAK-0001');
      const newItem = new this.itemModel({
        ...item,
        itemId,
        itemImage,
        netPrice,
        customizations: mappedCustomizations || [],
      });

      const savedItem = await newItem.save();

      // Emit an event after item creation
      this.eventEmitter.emit('item.created', {
        name: savedItem.name,
        createdBy: savedItem.employeeId,
        type: savedItem.isForSale
          ? NotificationType.NewSalesItem
          : NotificationType.NewPurchaseItem,
        itemId: savedItem._id,
      });

      return savedItem;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }

  /**
   * getAll salesItems
   * @condition isForSale='true'
   * @returns salesItem
   */

  async getAllSalesItems(): Promise<ItemDocument[]> {
    const items = await this.itemModel
      .find({ isForSale: true })
      .populate('supplierId')
      .populate('categoryId')
      .sort({ createdAt: -1 }) // Sort by latest items
      .exec();
    if (!items) {
      throw new NotFoundException('Sales items empty!');
    }
    return items;
  }

  /**
   * getAll purchaseItems
   * @condition isForSale='false'
   * @returns salesItem
   */

  async getAllPurchaseItems(): Promise<ItemDocument[]> {
    const items = await this.itemModel
      .find({ isForSale: false })
      .populate('supplierId')
      .populate('categoryId')
      .populate({ path: 'recipeId', select: 'name' })
      .sort({ createdAt: -1 }) // Sort by latest item
      .exec();
    if (!items) {
      throw new NotFoundException('Sales items empty!');
    }
    return items;
  }

  /**
   * count items
   * @condition filter categoryId
   * @return items count
   */

  async countItemsByCategory(): Promise<ItemCountByCategory[]> {
    const categories = await this.categoryModel.find().exec();

    const categoryMap = categories.reduce((map, category) => {
      map[category._id.toString()] = category.name;
      return map;
    }, {});

    const result = await this.itemModel.aggregate([
      {
        $match: { isForSale: true },
      },
      {
        $group: {
          _id: '$categoryId',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          categoryId: '$_id',
          count: 1,
        },
      },
    ]);

    return result.map((item) => ({
      categoryId: item.categoryId,
      count: item.count,
      categoryName: categoryMap[item.categoryId],
    }));
  }

  /**
   * @param id
   * @param updateItemDto
   * @param itemImage
   * @returns
   */

  async updateItem(
    id: string,
    item: UpdateItemDto,
    itemImageUrl: string | null,
  ): Promise<ItemDocument> {
    const itemExists = await this.itemModel.findById(id).exec();
    if (!itemExists) {
      throw new NotFoundException('Item does not exist');
    }

    const existingItem = await this.itemModel
      .findOne({ name: { $regex: new RegExp(`^${item.name}$`, 'i') } })
      .exec();
    if (existingItem && itemExists._id.toString() !== existingItem._id.toString()) {
      throw new ConflictException('Item with this name already exists');
    } else if (item.isForSale === true) {
      const category = await this.categoryService.getCategoryById(item.categoryId);
      if (!category) {
        throw new NotFoundException('Cateogry Not Found');
      }
      const employee = await this.employeeService.getEmployeeById(item.employeeId.toString());
      if (!employee) {
        throw new NotFoundException('Employee Not Found');
      }
    }
    if (item.isForSale === false) {
      const supplier = await this.supplierService.getSupplierById(item.supplierId.toString());
      if (!supplier) {
        throw new NotFoundException('Supplier Not Found');
      }
    }

    const { unitPrice, discount } = item;
    const discountAmount = unitPrice * (discount / 100);
    const netPrice = unitPrice - discountAmount;

    const updateFields: Partial<UpdateItemDto & { itemImage: string | null; netPrice: number }> = {
      ...item,
      itemImage: itemExists.itemImage,
      netPrice: netPrice,
    };

    if (itemImageUrl) {
      if (itemExists.itemImage) {
        await this.fileUploadService.deleteFileFromS3(itemExists.itemImage);
      }
      updateFields.itemImage = itemImageUrl;
    }

    const updatedItem = await this.itemModel
      .findOneAndUpdate({ _id: id }, updateFields, { new: true })
      .exec();
    if (!updatedItem) {
      throw new BadRequestException('Failed to update item');
    }

    return updatedItem;
  }

  /**
   * getAll Items
   * @condition isForSale='true'
   * @returns salesItem
   */
  async getAllItems(page: number = 1): Promise<PaginatedDto<ItemDocument>> {
    const skip = (page - 1) * 12;
    const items = await this.itemModel
      .find()
      .populate('supplierId')
      .populate('categoryId')
      .sort({ createdAt: -1 }) // Sort by latest item
      .limit(12)
      .skip(skip)
      .exec();

    const totalQty = await this.itemModel.countDocuments().exec();
    return new PaginatedDto(page, 12, totalQty, items);
  }

  async getItemById(id: string): Promise<ItemDocument> {
    const item = await this.itemModel
      .findById(id)
      .populate('recipeId')
      .populate('supplierId', 'companyName')
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 }) // Sort by latest item
      .exec();

    return item;
  }

  async getItemsBySupplierId(
    supplierId: string,
    page: number = 1,
  ): Promise<PaginatedDto<ItemDocument>> {
    const supplier = await this.supplierService.getSupplierById(supplierId);
    if (!supplier) {
      throw new NotFoundException('suppiler not found');
    }
    const skip = (page - 1) * 12;
    const query = {
      supplierId: supplier._id,
    };

    const items = await this.itemModel
      .find(query)
      // .select('orderDate companyName supplierId name quantity discount price')
      .sort({ createdAt: -1 }) // Sort by latest item
      .limit(12)
      .skip(skip)
      .lean()
      .exec();

    const total = await this.itemModel.countDocuments(query).exec();

    return new PaginatedDto(page, 12, total, items);
  }

  /**
   * update recipe status
   * @param recipe Status(Approved,pending & cancelled)
   * @returns
   */

  async updateRecipeStatus(id: string, updateStatus: UpdateRecipeStatusDto): Promise<ItemDocument> {
    const updatedItem = await this.itemModel
      .findByIdAndUpdate(id, { recipeStatus: updateStatus.recipeStatus }, { new: true })
      .exec();

    if (!updatedItem) {
      throw new NotFoundException('Item not found or failed to update status');
    }

    return updatedItem;
  }

  /**
   * update recipe ID
   * @param itemId
   * @returns updatedRecipe
   */

  async updateRecipe(id: string, updateRecipeDto: UpdateRecipeDto): Promise<ItemDocument> {
    const item = await this.itemModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    const updatedItem = await this.itemModel
      .findByIdAndUpdate(id, { recipeId: updateRecipeDto.recipeId }, { new: true })
      .exec();

    if (!updatedItem) {
      throw new BadRequestException('Failed to update recipe');
    }

    return updatedItem;
  }

  /**
   * getAll approved recipe
   * @returns approved recipes
   */
  async getAllApprovedRecipes(): Promise<ItemDocument[]> {
    const recipes = await this.itemModel
      .find({ recipeStatus: RecipeStatus.Approved })
      .populate('recipeId')
      .sort({ createdAt: -1 }) // Sort by latest item
      .exec();

    if (!recipes) {
      throw new NotFoundException('No any approved recipes');
    }
    return recipes;
  }

  /**
   * getAll added recipe
   * @returns recipes added items
   */
  async getAllRecipesItems(): Promise<ItemDocument[]> {
    const recipes = await this.itemModel
      .find({ recipeId: { $exists: true } })
      .sort({ createdAt: -1 }) // Sort by latest item
      .exec();

    if (!recipes) {
      throw new NotFoundException('Recipes not added any items');
    }
    return recipes;
  }

  async getItemsByCategoryId(
    categoryId: string,
    page: number = 1,
  ): Promise<PaginatedDto<ItemDocument>> {
    const category = await this.categoryService.getCategoryById(toObjectId(categoryId));
    if (!category) {
      throw new NotFoundException('category not found');
    }
    const skip = (page - 1) * 12;
    const query = {
      categoryId: category._id,
    };

    const items = await this.itemModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(12)
      .skip(skip)
      .lean()
      .exec();

    const total = await this.itemModel.countDocuments(query).exec();

    return new PaginatedDto(page, 12, total, items);
  }

  async getLatestItemsBySupplierId(supplierId: string, limit: number = 3): Promise<ItemDocument[]> {
    const supplier = await this.supplierService.getSupplierById(supplierId);
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    const items = await this.itemModel
      .find({ supplierId: supplier._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();

    return items;
  }

  async deleteItem(id: string): Promise<void> {
    try {
      const item = await this.itemModel.findById(id).exec();
      if (!item) {
        throw new NotFoundException('Item not found');
      }
      const supplierId = item.supplierId;
      const quantity = item.quantity;
      if (item.itemImage) {
        await this.fileUploadService.deleteFileFromS3(item.itemImage);
      }

      await item.deleteOne();

      await this.supplierModel.findByIdAndUpdate(
        supplierId,
        {
          $inc: {
            quantity: -quantity,
          },
        },
        { new: true },
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteItemsBySupplierId(supplierId: string): Promise<void> {
    const supplier = await this.supplierService.getSupplierById(supplierId);
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    const result = await this.itemModel.deleteMany({ supplierId: supplier._id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('No items found for the given supplier ID');
    }
  }

  async deleteItemsByCategoryId(categoryId: string): Promise<void> {
    const category = await this.categoryService.getCategoryById(toObjectId(categoryId));
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const result = await this.itemModel.deleteMany({ categoryId: category._id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('No items found for the given category ID');
    }
  }

  //update net price using discount
  async updateNetPrice(id: string, discount: number): Promise<ItemDocument> {
    const item = await this.itemModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    const unitPrice = item.unitPrice;
    const discountAmount = unitPrice * (discount / 100);
    const updatedNetPrice = unitPrice - discountAmount;

    const updatedItem = await this.itemModel.findByIdAndUpdate(
      id,
      { discount: discount, netPrice: updatedNetPrice },
      { new: true },
    );

    if (!updatedItem) {
      throw new BadRequestException('Failed to update net price');
    }
    return updatedItem;
  }
}
