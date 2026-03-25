import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateAdminRequestDto } from './dto/request/create-admin-req.dto';
import { CreateAdminResponseDto } from './dto/response/create-admin-res.dto';
import { AllowedRoles } from 'src/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AdminDocument } from './admin.schema';
import { ResponseMessage } from 'src/decorators/response.decorator';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Create a new admin user' })
  @ResponseMessage('Created a new admin successfully')
  async createAdminUser(
    @Body() createAdminDto: CreateAdminRequestDto,
  ): Promise<CreateAdminResponseDto> {
    return this.adminService.createAdminUser(createAdminDto);
  }

  @Get()
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Retrieve all admin users' })
  @ResponseMessage('Retrieved all admins successfully')
  async getAllAdmins(): Promise<AdminDocument[]> {
    return this.adminService.getAdmins();
  }

  @Get(':id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Retrieve a specific admin user by ID' })
  @ResponseMessage('Retrieved the admin by ID successfully')
  async findOne(@Param('id') id: string): Promise<CreateAdminResponseDto> {
    return this.adminService.getAdminById(id);
  }

  @Delete(':id')
  @AllowedRoles(Role.SuperAdmin)
  @ApiOperation({ summary: 'Delete an admin user by ID' })
  @ResponseMessage('Deleted the admin successfully')
  async deleteAdminUser(@Param('id') id: string): Promise<void> {
    await this.adminService.deleteAdminUser(id);
  }
}
