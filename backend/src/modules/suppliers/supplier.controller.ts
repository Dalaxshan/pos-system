import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';
import { SupplierService } from './supplier.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AllowedRoles } from 'src/decorators/role.decorator';
import { SupplierRegistrationDto } from './dto/request/supplier-registration.dto';
import { UpdateSupplierDto } from './dto/request/update-supplier.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/common/file-upload/file-upload.service';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { Role } from 'src/common/enums/role.enum';
import { SupplierDocument } from './supplier.schema';

@ApiTags('Supplier')
@Controller('supplier')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupplierController {
  constructor(
    private readonly supplierService: SupplierService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Get()
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Get all suppliers' })
  @ApiNotFoundResponse({ description: 'No suppliers found' })
  @ResponseMessage('All suppliers fetched successfully')
  async getAllSuppliers(): Promise<SupplierDocument[]> {
    return this.supplierService.getAllSuppliers();
  }

  @Get(':id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Get supplier by ID' })
  @ApiParam({ name: 'id', description: 'ID of the supplier to retrieve', type: String })
  @ApiNotFoundResponse({ description: 'Supplier not found' })
  @ApiBadRequestResponse({ description: 'Failed to fetch supplier' })
  @ResponseMessage('Supplier fetched successfully')
  async getSupplierById(@Param('id') id: string): Promise<SupplierDocument> {
    return this.supplierService.getSupplierById(id);
  }

  @Post()
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @UseInterceptors(
    FileInterceptor('logo', {
      limits: {
        fileSize: 1024 * 1024 * 3, // 3MB
      },
    }),
  )
  @ApiOperation({ summary: 'Register a new supplier' })
  @ApiBody({ type: SupplierRegistrationDto })
  @ApiCreatedResponse({
    description: 'Supplier registered successfully',
    type: SupplierRegistrationDto,
  })
  @ApiBadRequestResponse({ description: 'Failed to register supplier' })
  @ResponseMessage('Supplier registered successfully')
  async supplierRegistration(
    @UploadedFile() file: Express.Multer.File,
    @Body() supplierRegistrationDto: SupplierRegistrationDto,
  ): Promise<SupplierDocument> {
    let logoUrl: string = '';
    if (file) {
      const logoUrls = await this.fileUploadService.uploadFilesToS3([file]);
      logoUrl = logoUrls[0];
    }
    return this.supplierService.registerSupplier(supplierRegistrationDto, logoUrl);
  }

  @Put(':id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @UseInterceptors(
    FileInterceptor('logo', {
      limits: {
        fileSize: 1024 * 1024 * 3, // 3MB
      },
    }),
  )
  @ApiOperation({ summary: 'Update supplier by ID' })
  @ApiParam({ name: 'id', description: 'ID of the supplier to update', type: String })
  @ApiBody({ type: UpdateSupplierDto })
  @ApiBadRequestResponse({ description: 'Failed to update supplier' })
  @ApiNotFoundResponse({ description: 'Supplier not found' })
  @ResponseMessage('Supplier updated successfully')
  async updateSupplier(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ): Promise<SupplierDocument> {
    let logoUrl: string = '';
    if (file) {
      const logoUrls = await this.fileUploadService.uploadFilesToS3([file]);
      logoUrl = logoUrls[0];
    }
    return this.supplierService.updateSupplier(id, updateSupplierDto, logoUrl);
  }

  @Delete(':id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Delete supplier by ID' })
  @ApiParam({ name: 'id', description: 'ID of the supplier to delete', type: String })
  @ApiOkResponse({
    description: 'Supplier deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Supplier not found' })
  @ApiBadRequestResponse({ description: 'Failed to delete supplier' })
  @ResponseMessage('Supplier deleted successfully')
  async deleteSupplier(@Param('id') id: string): Promise<void> {
    await this.supplierService.deleteSupplier(id);
  }
}
