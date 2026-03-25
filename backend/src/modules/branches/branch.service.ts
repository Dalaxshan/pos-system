import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BranchDocument } from './branch.schema';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { toObjectId } from 'src/utils/to-object-id';

@Injectable()
export class BranchService {
  constructor(
    @InjectModel('Branch')
    private readonly branchModel: Model<BranchDocument>,
  ) {}

  async getAllBranches(): Promise<BranchDocument[]> {
    return await this.branchModel
      .find()
      .populate('employeeId', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getBranchesById(id: string): Promise<BranchDocument> {
    const branch = await this.branchModel.findById(id).populate('employeeId', 'name email');
    if (!branch) {
      throw new NotFoundException('table not found');
    }
    return branch;
  }

  async getBranchByName(branchName: string): Promise<BranchDocument> {
    return await this.branchModel.findOne({ branchName }).exec();
  }

  async createBranch(createBranchDto: CreateBranchDto): Promise<BranchDocument> {
    const formattedBranchName = createBranchDto.branchName.toUpperCase();
    const convertedEmployeeId = toObjectId(createBranchDto.employeeId);
    const existingBranch = await this.branchModel.findOne({
      branchName: formattedBranchName,
    });
    if (existingBranch) {
      throw new Error('Branch Name is already entered!');
    }

    const createdBranch = new this.branchModel({
      ...createBranchDto,
      branchName: formattedBranchName,
      employeeId: convertedEmployeeId,
    });
    return createdBranch.save();
  }

  async updateBranch(id: string, updateBranchDto: UpdateBranchDto): Promise<BranchDocument> {
    const branchExists = await this.branchModel.findById(id).exec();

    if (!branchExists) {
      throw new NotFoundException('Branch does not exist');
    }
    try {
      const editedBranch = await this.branchModel
        .findOneAndUpdate({ _id: id }, { $set: updateBranchDto }, { new: true })
        .exec();
      return editedBranch;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update branch: ', error.message);
    }
  }

  async deleteBranch(id: string): Promise<void> {
    try {
      await this.branchModel.findByIdAndDelete(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
