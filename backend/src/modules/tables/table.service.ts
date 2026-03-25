import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TableDocument } from './table.schema';
import { CreateTableDto } from './dto/create-table.dto';
import { TableStatus } from './enum/table-status';
import { UpdateTableStatusDto } from './dto/update-table-status.dto';
import { toObjectId } from 'src/utils/to-object-id';

@Injectable()
export class TableService {
  constructor(
    @InjectModel('Table')
    private readonly tableModel: Model<TableDocument>,
  ) {}

  async getAllTables(): Promise<TableDocument[]> {
    const tables = this.tableModel.find().populate('branchId').sort({ createdAt: -1 }).exec();

    if (!tables) {
      throw new NotFoundException('No tables found');
    }
    return tables;
  }

  async getTableById(id: string): Promise<TableDocument> {
    const table = await this.tableModel.findById(id);
    if (!table) {
      throw new NotFoundException('Table not found');
    }
    return table;
  }

  async getTableByName(tableName: string): Promise<TableDocument> {
    return await this.tableModel.findOne({ tableName }).exec();
  }

  async getTablesByBranchId(branchId: string): Promise<TableDocument[]> {
    const tables = await this.tableModel.find({ branchId: toObjectId(branchId) }).exec();

    return tables;
  }

  async createTable(createTableDto: CreateTableDto): Promise<TableDocument> {
    const formattedTableName = createTableDto.tableName.toUpperCase();
    const convertedBranchId = toObjectId(createTableDto.branchId);
    const existingTable = await this.tableModel.findOne({
      tableName: formattedTableName,
    });
    if (existingTable) {
      throw new ConflictException('Table Name is already entered!');
    }

    const createdTable = new this.tableModel({
      ...createTableDto,
      tableName: formattedTableName,
      branchId: convertedBranchId,
    });
    return createdTable.save();
  }

  /**
   * Get all available tables
   * @returns availableTables
   */
  async getAllAvailableTables(): Promise<TableDocument[]> {
    const tables = await this.tableModel
      .find({ tableStatus: TableStatus.Available })
      .sort({ createdAt: -1 })
      .exec();

    if (tables.length === 0) {
      return [];
    }
    return tables;
  }

  /**
   * Update table staus
   * @param tableId
   * @return occupied or available
   */
  async updateTableStatus(id: string, status: UpdateTableStatusDto): Promise<TableDocument> {
    const table = await this.tableModel.findById(id).exec();
    if (!table) {
      throw new NotFoundException('Tables are not found');
    }

    try {
      const updateTableStatus = await this.tableModel
        .findByIdAndUpdate(id, { tableStatus: status.tableStatus }, { new: true })
        .exec();

      if (!updateTableStatus) {
        throw new BadRequestException('Failed to update table status');
      }
      return updateTableStatus;
    } catch (err) {
      throw new InternalServerErrorException('Failed to update table: ', err.message);
    }
  }

  async deleteTable(id: string): Promise<void> {
    try {
      const table = await this.tableModel.findById(id).exec();
      if (!table) {
        throw new NotFoundException('Table not found');
      }
      await this.tableModel.findByIdAndDelete(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
