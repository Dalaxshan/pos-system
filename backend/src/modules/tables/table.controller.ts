import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { TableService } from './table.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableStatusDto } from './dto/update-table-status.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AllowedRoles } from 'src/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { TableDocument } from './table.schema';

@ApiTags('Table')
@Controller('table')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TableController {
  constructor(private readonly tableService: TableService) {}

  @Get('list-all')
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Cashier)
  @ApiOperation({ summary: 'Fetch all tables' })
  @ResponseMessage('All tables fetched successfully')
  @ApiNotFoundResponse({ description: 'No tables found' })
  async getAllTables(): Promise<TableDocument[]> {
    return this.tableService.getAllTables();
  }

  @Get(':id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Cashier)
  @ApiOperation({ summary: 'Fetch table by ID' })
  @ApiParam({ name: 'id', description: 'ID of the table to retrieve', type: String })
  @ResponseMessage('Table fetched successfully')
  @ApiNotFoundResponse({ description: 'Table not found' })
  @ApiBadRequestResponse({ description: 'Failed to fetch table' })
  async getTableById(@Param('id') id: string): Promise<TableDocument> {
    return this.tableService.getTableById(id);
  }

  @Get('branch/:branchId')
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Cashier)
  @ApiOperation({ summary: 'Fetch tables by branch ID' })
  @ApiParam({
    name: 'branchId',
    description: 'ID of the branch to retrieve tables from',
    type: String,
  })
  @ResponseMessage('Tables for branch fetched successfully')
  @ApiNotFoundResponse({ description: 'No tables found for the branch' })
  @ApiBadRequestResponse({ description: 'Failed to fetch tables for the branch' })
  async getTablesByBranchId(@Param('branchId') branchId: string): Promise<TableDocument[]> {
    return this.tableService.getTablesByBranchId(branchId);
  }

  @Post()
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Create a new table' })
  @ApiBody({ type: CreateTableDto })
  @ResponseMessage('Table created successfully')
  @ApiBadRequestResponse({ description: 'Failed to create table' })
  async createTable(@Body() createTableDto: CreateTableDto): Promise<TableDocument> {
    return this.tableService.createTable(createTableDto);
  }

  @Get()
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Cashier)
  @ApiOperation({ summary: 'Fetch all available tables' })
  @ResponseMessage('Available tables fetched successfully')
  @ApiNotFoundResponse({ description: 'No available tables found' })
  async getAllAvailableTables(): Promise<TableDocument[]> {
    return this.tableService.getAllAvailableTables();
  }

  @Put('table-status/:id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Update table status by ID' })
  @ApiParam({ name: 'id', description: 'ID of the table to update', type: String })
  @ApiBody({ type: UpdateTableStatusDto })
  @ResponseMessage('Table status updated successfully')
  @ApiNotFoundResponse({ description: 'Table not found' })
  @ApiBadRequestResponse({ description: 'Failed to update table status' })
  async updateTableStatus(
    @Param('id') id: string,
    @Body() tableStatusDto: UpdateTableStatusDto,
  ): Promise<TableDocument> {
    return this.tableService.updateTableStatus(id, tableStatusDto);
  }

  @Delete(':id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Delete a table by ID' })
  @ApiParam({ name: 'id', description: 'ID of the table to delete', type: String })
  @ResponseMessage('Table deleted successfully')
  @ApiNotFoundResponse({ description: 'Table not found' })
  @ApiBadRequestResponse({ description: 'Failed to delete table' })
  async deleteTable(@Param('id') id: string): Promise<void> {
    await this.tableService.deleteTable(id);
  }
}
