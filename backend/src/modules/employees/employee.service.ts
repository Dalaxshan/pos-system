import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmployeeDocument } from './employee.schema';
import { EmployeeFullRegistrationDto } from './dto/request/employee-full-registration.dto';
import { UpdateEmployeeTokenDto } from './dto/request/update-employee-token.dto';
import { UpdateEmployeeDto } from './dto/request/update-employee.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel('Employee')
    private readonly employeeModel: Model<EmployeeDocument>,
    private readonly eventEmitter: EventEmitter2,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async getAllEmployees(): Promise<EmployeeDocument[]> {
    return await this.employeeModel.find().sort({ createdAt: -1 });
  }

  async getEmployeeById(id: string): Promise<EmployeeDocument> {
    const employee = await this.employeeModel.findById(id);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return employee;
  }

  async getEmployeesByRole(role: string): Promise<EmployeeDocument[]> {
    const employees = await this.employeeModel.find({ role }).sort({ createdAt: -1 }).exec();
    if (employees.length === 0) {
      throw new NotFoundException(`No employees found with role ${role}`);
    }
    return employees;
  }

  async getEmployeeByEmail(email: string): Promise<EmployeeDocument> {
    return await this.employeeModel.findOne({ email }).exec();
  }

  async getEmployeeByEmailWithPassword(email: string): Promise<EmployeeDocument> {
    const employee = await this.employeeModel.findOne({ email }).select('+password');
    return employee;
  }

  async registerEmployee(
    employeeFullRegistrationDto: EmployeeFullRegistrationDto,
    profilePhotoUrl: string,
  ): Promise<EmployeeDocument> {
    const employeeExists = await this.getEmployeeByEmail(employeeFullRegistrationDto.email);
    if (employeeExists) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(employeeFullRegistrationDto.password, 10);

    const newEmployee = new this.employeeModel({
      ...employeeFullRegistrationDto,
      profilePhoto: profilePhotoUrl,
      password: hashedPassword,
    });

    if (employeeFullRegistrationDto.role === Role.Cashier) {
      this.eventEmitter.emit('cashierRegistered', {
        email: employeeFullRegistrationDto.email,
      });
    }

    return await newEmployee.save();
  }

  async updateEmployee(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
    profilePhotoUrl: string | null,
  ): Promise<EmployeeDocument> {
    const employeeExists = await this.employeeModel.findById(id).exec();

    if (!employeeExists) {
      throw new NotFoundException('Employee not found');
    }

    const emailExists = await this.getEmployeeByEmail(updateEmployeeDto.email);

    if (emailExists && emailExists._id.toString() !== id) {
      throw new ConflictException('Email already exists');
    }

    try {
      const updateFields: Partial<UpdateEmployeeDto & { profilePhoto: string | null }> = {
        ...updateEmployeeDto,
        profilePhoto: employeeExists.profilePhoto,
      };
      if (profilePhotoUrl) {
        if (employeeExists.profilePhoto) {
          await this.fileUploadService.deleteFileFromS3(employeeExists.profilePhoto);
        }
        updateFields.profilePhoto = profilePhotoUrl;
      }

      const updatedEmployee = await this.employeeModel
        .findByIdAndUpdate({ _id: id }, updateFields, { new: true })
        .exec();

      return updatedEmployee;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update employee: ', error.message);
    }
  }

  async deleteEmployee(id: string): Promise<void> {
    try {
      const employee = await this.employeeModel.findById(id).exec();
      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      if (employee.profilePhoto) {
        await this.fileUploadService.deleteFileFromS3(employee.profilePhoto);
      }
      await employee.deleteOne();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async saveForgotPasswordToken(email: string, token: string): Promise<void> {
    const employee = await this.getEmployeeByEmail(email);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    Object.assign(employee, { forgotPasswordToken: token });
    await employee.save();
  }

  async resetPassword(email: string, password: string): Promise<void> {
    const employee = await this.getEmployeeByEmail(email);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    Object.assign(employee, { password: hashedPassword });
    await employee.save();
  }

  async updateEmployeeToken(updateEmployeeTokenDto: UpdateEmployeeTokenDto): Promise<boolean> {
    const employeeExists = await this.getEmployeeByEmail(updateEmployeeTokenDto.email);
    if (employeeExists) {
      const hashedToken = await bcrypt.hash(updateEmployeeTokenDto.refreshToken, 10);
      Object.assign(employeeExists, {
        refreshToken: hashedToken,
      });
      await employeeExists.save();
    } else {
      throw new ForbiddenException('Employee does not exist');
    }

    return true;
  }

  async getAllAdmins(): Promise<EmployeeDocument[]> {
    const admins = await this.getEmployeesByRole(Role.Admin);
    if (admins.length === 0) {
      throw new NotFoundException('No admins found');
    }
    return admins;
  }
}
