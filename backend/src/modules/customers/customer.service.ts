import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomerDocument } from './customer.schema';
import { CreateCustomerDto } from './dto/request/create-customer.dto';
import { UpdateCustomerDto } from './dto/request/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel('Customer')
    private readonly customerModel: Model<CustomerDocument>,
  ) {}

  async getAllCustomers(): Promise<CustomerDocument[]> {
    return await this.customerModel.find().sort({ createdAt: -1 });
  }

  async getCustomerById(id: string): Promise<CustomerDocument> {
    const customer = await this.customerModel.findById(id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async getCustomerByContactNumber(contactNo: string): Promise<CustomerDocument> {
    const customer = await this.customerModel.findOne({ contactNo }).exec();
    return customer;
  }

  async registerCustomer(createCustomerDto: CreateCustomerDto): Promise<CustomerDocument> {
    const customerNoExists = await this.getCustomerByContactNumber(createCustomerDto.contactNo);
    if (customerNoExists) {
      throw new BadRequestException('Contact number already exists');
    }

    const newCustomer = new this.customerModel({
      ...createCustomerDto,
    });

    return await newCustomer.save();
  }

  async updateCustomer(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<CustomerDocument> {
    const customerExists = await this.customerModel.findById(id).exec();
    if (!customerExists) {
      throw new NotFoundException('Customer does not exist');
    }
    try {
      const editedCustomer = await this.customerModel
        .findOneAndUpdate({ _id: id }, updateCustomerDto, { new: true })
        .exec();

      return editedCustomer;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update customer: ', error.message);
    }
  }

  async deleteCustomer(id: string): Promise<void> {
    try {
      await this.customerModel.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
