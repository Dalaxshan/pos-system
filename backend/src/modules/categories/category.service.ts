import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CategoryDocument } from './category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category')
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async createCategory(name: string): Promise<CategoryDocument> {
    const formattedCategoryName = name.toLowerCase();

    const existingCategory = await this.categoryModel.findOne({
      name: formattedCategoryName,
    });
    if (existingCategory) {
      throw new ConflictException('Category Name is already entered!');
    }

    const createdCategory = new this.categoryModel({
      name: formattedCategoryName,
    });
    return createdCategory.save();
  }

  async getAllCategory(): Promise<CategoryDocument[]> {
    return await this.categoryModel.find().sort({ createdAt: -1 });
  }

  /**
   * getCategoryById
   * @param id categoryId
   * @returns
   */
  async getCategoryById(id: Types.ObjectId): Promise<CategoryDocument> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category ID  ${id} not found`);
    }
    return category;
  }
}
