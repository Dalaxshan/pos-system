import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminDocument } from './admin.schema';
import * as bcrypt from 'bcrypt';
import { CreateAdminRequestDto } from './dto/request/create-admin-req.dto';
import { UpdateAdminTokenDto } from './dto/request/update-admin-token.dto';

@Injectable()
export class AdminService {
  constructor(@InjectModel('Admin') private readonly adminModel: Model<AdminDocument>) {}

  /**
   * Get All Admin Users
   * @returns All Admin users
   */
  async getAdmins(): Promise<AdminDocument[]> {
    const admins = await this.adminModel.find().exec();
    return admins;
  }

  /**
   * Get Admin User by Id
   * @param id admin id
   * @returns Admin User
   */
  async getAdminById(id: string): Promise<AdminDocument | null> {
    const admin = await this.adminModel.findById(id).exec();
    return admin;
  }

  /**
   * Get Admin User by Email
   * @param email admin email
   * @returns Admin User
   */
  async getAdminByEmail(email: string): Promise<AdminDocument | null> {
    const admin = await this.adminModel.findOne({ email }).exec();
    return admin;
  }

  /**
   * Get Admin user with hashed password
   * @param email admin email
   * @returns Admin user with hashed password
   */
  async getAdminByEmailWithPassword(email: string): Promise<AdminDocument | null> {
    const admin = await this.adminModel.findOne({ email }).select('+password');
    return admin;
  }

  /**
   * Create Admin User
   * @param createAdminDto Create Admin DTO
   * @returns Created Admin User
   */
  async createAdminUser(createAdminDto: CreateAdminRequestDto): Promise<AdminDocument> {
    const adminExists = await this.getAdminByEmail(createAdminDto.email);
    if (adminExists) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    const newAdmin = new this.adminModel({
      name: createAdminDto.name,
      email: createAdminDto.email,
      password: hashedPassword,
    });

    return newAdmin.save();
  }

  async updateAdminToken(updateAdminTokenDto: UpdateAdminTokenDto): Promise<boolean> {
    const adminExists = await this.getAdminByEmail(updateAdminTokenDto.email);
    if (adminExists) {
      const hashedToken = await bcrypt.hash(updateAdminTokenDto.refreshToken, 10);
      Object.assign(adminExists, {
        refreshToken: hashedToken,
      });
      await adminExists.save();
    } else {
      throw new ForbiddenException('User does not exist');
    }

    return true;
  }

  /**
   * Delete Admin User
   * @param id Admin User ID
   */
  async deleteAdminUser(id: string): Promise<void> {
    const adminExists = await this.adminModel.findById(id);

    if (!adminExists) {
      throw new BadRequestException('Admin not found');
    } else {
      await adminExists.deleteOne();
    }
  }
}
