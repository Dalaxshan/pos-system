import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/request/create-stocks.dto';
import { UpdateStockDto } from './dto/request/update-stocks.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AllowedRoles } from 'src/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { StockDocument } from './stock.schema';
import { PurchaseItem } from '../purchases/interfaces/purchase-item';

@ApiTags('Stock')
@Controller('stock')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Get all stocks' })
  @ApiNotFoundResponse({ description: 'No stocks found' })
  @ResponseMessage('All stocks fetched successfully')
  async getAllStocks(): Promise<StockDocument[]> {
    return this.stockService.getAllStocks();
  }

  //get all items in stock
  @Get('items')
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Retrieve all items in stock' })
  @ResponseMessage('Successfully retrieved all items in purchase order')
  @ApiOkResponse({
    description: 'All items in purchase order retrieved successfully',
    type: [CreateStockDto],
  })
  @ApiNotFoundResponse({ description: 'No items found in purchase order' })
  async getAllPurchaseItem(): Promise<PurchaseItem[]> {
    return this.stockService.getAllStockItems();
  }

  //calculate total stock into item
  @Get('total')
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Calculate total stock' })
  @ResponseMessage('Total stock calculated successfully')
  async calculateTotalStock(): Promise<PurchaseItem[]> {
    return this.stockService.calculateTotalStock();
  }

  //calculate the current stock
  @Get('current')
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Calculate current stock' })
  @ResponseMessage('Current stock calculated successfully')
  async calculateCurrentStock(): Promise<PurchaseItem[]> {
    return this.stockService.calculateRemainingStock();
  }

  @Get(':id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Chef)
  @ApiOperation({ summary: 'Get stock by ID' })
  @ApiParam({ name: 'id', description: 'ID of the stock to retrieve', type: String })
  @ApiNotFoundResponse({ description: 'Stock not found' })
  @ApiBadRequestResponse({ description: 'Failed to fetch stock' })
  @ResponseMessage('Stock fetched successfully')
  async getStockById(@Param('id') id: string): Promise<StockDocument> {
    return this.stockService.getStockById(id);
  }

  @Post()
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Register a new stock' })
  @ApiBody({ type: CreateStockDto })
  @ApiBadRequestResponse({ description: 'Failed to register stock' })
  @ResponseMessage('Stock registered successfully')
  async stockRegistration(@Body() createStockDto: CreateStockDto): Promise<StockDocument> {
    return this.stockService.registerStock(createStockDto);
  }

  @Put(':id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Update stock by ID' })
  @ApiParam({ name: 'id', description: 'ID of the stock to update', type: String })
  @ApiBody({ type: UpdateStockDto })
  @ApiBadRequestResponse({ description: 'Failed to update stock' })
  @ApiNotFoundResponse({ description: 'Stock not found' })
  @ResponseMessage('Stock updated successfully')
  async updateStock(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStockDto,
  ): Promise<StockDocument> {
    return this.stockService.updateStock(id, updateStockDto);
  }

  @Delete(':id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Delete stock by ID' })
  @ApiParam({ name: 'id', description: 'ID of the stock to delete', type: String })
  @ApiOkResponse({
    description: 'Stock deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Stock not found' })
  @ApiBadRequestResponse({ description: 'Failed to delete stock' })
  @ResponseMessage('Stock deleted successfully')
  async deleteStock(@Param('id') id: string): Promise<void> {
    await this.stockService.deleteStock(id);
  }
}
