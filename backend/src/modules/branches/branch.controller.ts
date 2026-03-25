import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AllowedRoles } from 'src/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { BranchDocument } from './branch.schema';

@ApiTags('Branch')
@Controller('branch')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Get()
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Retrieve all branches' })
  @ResponseMessage('Retrieved all branches successfully')
  @ApiResponse({ status: HttpStatus.OK, description: 'Branches fetched successfully' })
  async getAllBranches(): Promise<BranchDocument[]> {
    return this.branchService.getAllBranches();
  }

  @Get(':id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Retrieve a specific branch by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the branch to retrieve',
    type: String,
  })
  @ResponseMessage('Retrieved branch successfully')
  @ApiResponse({ status: HttpStatus.OK, description: 'Branch fetched successfully' })
  async getBranchById(@Param('id') id: string): Promise<BranchDocument> {
    return this.branchService.getBranchesById(id);
  }

  @Post()
  @AllowedRoles(Role.SuperAdmin, Role.Admin)
  @ApiOperation({ summary: 'Create a new branch' })
  @ApiBody({ type: CreateBranchDto })
  @ResponseMessage('Branch created successfully')
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Branch added successfully' })
  async createBranch(@Body() createBranchDto: CreateBranchDto): Promise<BranchDocument> {
    return this.branchService.createBranch(createBranchDto);
  }

  @Put(':id')
  @AllowedRoles(Role.SuperAdmin, Role.Admin)
  @ApiOperation({ summary: 'Update an existing branch' })
  @ApiParam({
    name: 'id',
    description: 'ID of the branch to update',
    type: String,
  })
  @ApiBody({ type: UpdateBranchDto })
  @ResponseMessage('Branch updated successfully')
  @ApiResponse({ status: HttpStatus.OK, description: 'Branch updated successfully' })
  async updateBranch(
    @Param('id') id: string,
    @Body() updateBranchDto: UpdateBranchDto,
  ): Promise<BranchDocument> {
    return this.branchService.updateBranch(id, updateBranchDto);
  }

  @Delete(':id')
  @AllowedRoles(Role.SuperAdmin, Role.Admin)
  @ApiOperation({ summary: 'Delete a branch by ID' })
  @ApiParam({
    name: 'id',
    description: 'ID of the branch to delete',
    type: String,
  })
  @ResponseMessage('Branch deleted successfully')
  @ApiResponse({ status: HttpStatus.OK, description: 'Branch deleted successfully' })
  async deleteBranch(@Param('id') id: string): Promise<void> {
    await this.branchService.deleteBranch(id);
  }
}
