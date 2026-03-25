import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { EmployeeService } from './employee.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AllowedRoles } from 'src/decorators/role.decorator';
import { EmployeeFullRegistrationDto } from './dto/request/employee-full-registration.dto';
import { UpdateEmployeeDto } from './dto/request/update-employee.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';
import { Role } from 'src/common/enums/role.enum';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { EmployeeDocument } from './employee.schema';

@ApiTags('Employee')
@Controller('employee')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeeController {
  constructor(
    private employeeService: EmployeeService,
    private fileUploadService: FileUploadService,
  ) {}

  @Get('admin')
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Get all admins' })
  @ResponseMessage('All admins fetched successfully')
  @ApiResponse({ status: HttpStatus.OK, description: 'All admins fetched successfully' })
  @ApiNotFoundResponse({ description: 'No admins found' })
  async getAllAdmins(): Promise<EmployeeDocument[]> {
    return this.employeeService.getAllAdmins();
  }

  @Get()
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Get all employees' })
  @ResponseMessage('All employees fetched successfully')
  @ApiResponse({ status: HttpStatus.OK, description: 'All employees fetched successfully' })
  @ApiBadRequestResponse({ description: 'Failed to fetch employees' })
  @ApiNotFoundResponse({ description: 'No employees found' })
  async getAllEmployees(): Promise<EmployeeDocument[]> {
    return this.employeeService.getAllEmployees();
  }

  @Get(':id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Cashier, Role.Chef)
  @ApiOperation({ summary: 'Get employee by id' })
  @ApiParam({
    name: 'id',
    description: 'ID of the employee to retrieve',
    type: String,
  })
  @ResponseMessage('Employee fetched successfully')
  @ApiResponse({ status: HttpStatus.OK, description: 'Employee fetched successfully' })
  @ApiNotFoundResponse({ description: 'No employee found' })
  @ApiBadRequestResponse({ description: 'Failed to fetch employee' })
  async getEmployeeById(@Param('id') id: string): Promise<EmployeeDocument> {
    return this.employeeService.getEmployeeById(id);
  }

  @Post()
  @AllowedRoles(Role.SuperAdmin, Role.Admin)
  @ApiOperation({ summary: 'Register a new employee' })
  @UseInterceptors(
    FileInterceptor('profilePhoto', {
      limits: {
        fileSize: 1024 * 1024 * 3, // 3MB
      },
    }),
  )
  @ApiBody({ type: EmployeeFullRegistrationDto })
  @ResponseMessage('Employee registered successfully')
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Employee registered successfully' })
  @ApiBadRequestResponse({ description: 'Failed to register employee' })
  async employeeRegistration(
    @UploadedFile() file: Express.Multer.File,
    @Body() employeeFullRegistration: EmployeeFullRegistrationDto,
  ): Promise<EmployeeDocument> {
    let profilePhotoUrl = '';

    if (file) {
      const profilePhotoUrls = await this.fileUploadService.uploadFilesToS3([file]);
      profilePhotoUrl = profilePhotoUrls[0];
    }
    return this.employeeService.registerEmployee(employeeFullRegistration, profilePhotoUrl);
  }

  @Put(':id')
  @AllowedRoles(Role.SuperAdmin, Role.Admin, Role.Cashier, Role.Chef)
  @ApiOperation({ summary: 'Update employee by id' })
  @UseInterceptors(
    FileInterceptor('profilePhoto', {
      limits: {
        fileSize: 1024 * 1024 * 3, // 3MB
      },
    }),
  )
  @ApiParam({
    name: 'id',
    description: 'ID of the employee to update',
    type: String,
  })
  @ApiBody({ type: UpdateEmployeeDto })
  @ResponseMessage('Employee updated successfully')
  @ApiResponse({ status: HttpStatus.OK, description: 'Employee updated successfully' })
  @ApiBadRequestResponse({ description: 'Failed to update employee' })
  @ApiNotFoundResponse({ description: 'No employee found' })
  async updateEmployee(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<EmployeeDocument> {
    let profilePhotoUrl: string = '';

    if (file) {
      const profilePhotoUrls = await this.fileUploadService.uploadFilesToS3([file]);
      profilePhotoUrl = profilePhotoUrls[0];
    }

    return this.employeeService.updateEmployee(id, updateEmployeeDto, profilePhotoUrl);
  }

  @Delete(':id')
  @AllowedRoles(Role.SuperAdmin, Role.Admin)
  @ApiOperation({ summary: 'Delete employee by id' })
  @ApiParam({
    name: 'id',
    description: 'ID of the employee to delete',
    type: String,
  })
  @ResponseMessage('Employee deleted successfully')
  @ApiResponse({ status: HttpStatus.OK, description: 'Employee deleted successfully' })
  @ApiBadRequestResponse({ description: 'Failed to delete employee' })
  @ApiNotFoundResponse({ description: 'No employee found' })
  async deleteEmployee(@Param('id') id: string): Promise<void> {
    await this.employeeService.deleteEmployee(id);
  }
}
