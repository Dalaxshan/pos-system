import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SupplierDocument } from './supplier.schema';
import { SupplierRegistrationDto } from './dto/request/supplier-registration.dto';
import { UpdateSupplierDto } from './dto/request/update-supplier.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';

@Injectable()
export class SupplierService {
  constructor(
    @InjectModel('Supplier')
    private readonly supplierModel: Model<SupplierDocument>,
    private readonly eventEmitter: EventEmitter2,
    private readonly fileUploadService: FileUploadService,
  ) {}

  //get all suppliers
  async getAllSuppliers(): Promise<SupplierDocument[]> {
    return await this.supplierModel.find().sort({ createdAt: -1 });
  }

  async getSupplierById(id: string): Promise<SupplierDocument> {
    const supplier = await this.supplierModel.findById(id).sort({ createdAt: -1 }).lean().exec();
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }
    return supplier;
  }

  async getSupplierByEmail(email: string): Promise<SupplierDocument> {
    return await this.supplierModel.findOne({ email }).exec();
  }

  async getSupplierByEmailWithPassword(email: string): Promise<SupplierDocument> {
    const supplier = await this.supplierModel.findOne({ email }).select('+password');
    return supplier;
  }

  async registerSupplier(
    supplierRegistrationDto: SupplierRegistrationDto,
    logoUrl: string,
  ): Promise<SupplierDocument> {
    const supplierExists = await this.getSupplierByEmail(supplierRegistrationDto.email);
    if (supplierExists) {
      throw new ConflictException('Email already exists');
    }
    const existingName = await this.supplierModel
      .findOne({ name: { $regex: new RegExp(`^${supplierRegistrationDto.name}$`, 'i') } })
      .exec();
    if (existingName) {
      throw new ConflictException('Item with this name already exists');
    }
    const newSupplier = new this.supplierModel({
      ...supplierRegistrationDto,
      logoUrl,
    });
    return await newSupplier.save();
  }

  async updateSupplier(
    id: string,
    updateSupplierDto: UpdateSupplierDto,
    logo: string,
  ): Promise<SupplierDocument> {
    const supplierExists = await this.supplierModel.findById(id).exec();

    if (!supplierExists) {
      throw new NotFoundException('Supplier does not exist');
    }

    // Check if the email is already taken
    if (updateSupplierDto.email && updateSupplierDto.email !== supplierExists.email) {
      const supplier = await this.getSupplierByEmail(updateSupplierDto.email);
      if (supplier) {
        throw new ConflictException('Email already exists');
      }
    }
    try {
      const updateFields: Partial<UpdateSupplierDto & { logoUrl: string | null }> = {
        ...updateSupplierDto,
        logoUrl: supplierExists.logoUrl,
      };
      if (logo) {
        if (supplierExists.logoUrl) {
          await this.fileUploadService.deleteFileFromS3(supplierExists.logoUrl);
        }
        updateFields.logoUrl = logo;
      }

      const editedSupplier = await this.supplierModel
        .findOneAndUpdate({ _id: id }, updateFields, { new: true })
        .exec();
      return editedSupplier;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update supplier: ', error.message);
    }
  }

  async deleteSupplier(id: string): Promise<void> {
    try {
      const supplier = await this.supplierModel.findById(id).exec();
      if (!supplier) {
        throw new NotFoundException('Supplier not found');
      }
      if (supplier.logoUrl) {
        await this.fileUploadService.deleteFileFromS3(supplier.logoUrl);
      }

      await supplier.deleteOne();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
