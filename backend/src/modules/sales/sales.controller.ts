import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSalesDto } from './dto/request/create-sales.dto';
import { UpdatePaymentStatusDto } from './dto/request/update-sales-payment-status.dto';
import { UpdateSalesDto } from './dto/request/update-sales.dto';
import { UpdateOrderStatusDto } from './dto/request/update-order-status.dto';
import { SalesPaymentStatus } from './enum/sales-payment-status';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AllowedRoles } from 'src/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { SalesDocument } from './sales.schema';
import { ItemQuantity } from './interfaces/item-quantity';

@ApiTags('Sales')
@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Cashier)
  @ApiOperation({ summary: 'Create a new Sale' })
  @ApiBody({ type: CreateSalesDto })
  @ApiCreatedResponse({ description: 'Sale created successfully', type: CreateSalesDto })
  @ApiBadRequestResponse({ description: 'Failed to create sales' })
  @ResponseMessage('Sale created successfully')
  async createSale(@Body() createSalesDto: CreateSalesDto): Promise<SalesDocument> {
    return this.salesService.createSale(createSalesDto);
  }

  @Get(':id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Cashier, Role.Chef)
  @ApiOperation({ summary: 'Get Sale by ID' })
  @ApiParam({ name: 'id', description: 'ID of the Sale to retrieve', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sale retrieved successfully',
    type: CreateSalesDto,
  })
  @ApiNotFoundResponse({ description: 'Sale not found' })
  @ResponseMessage('Successfully retrieved sale by ID')
  async getSaleById(@Param('id') id: string): Promise<SalesDocument> {
    return this.salesService.getSaleById(id);
  }

  @Get()
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Chef, Role.Cashier)
  @ApiOperation({ summary: 'Get all Sales' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of all Sales', type: [CreateSalesDto] })
  @ApiNotFoundResponse({ description: 'No Sales found' })
  @ResponseMessage('Successfully retrieved all sales')
  async getAllSales(): Promise<SalesDocument[]> {
    return this.salesService.getAllSales();
  }

  @Get('count/items')
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Count total items' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Total items quantity fetched', type: Number })
  @ResponseMessage('Total item quantities fetched successfully')
  async countTotalItems(): Promise<ItemQuantity[]> {
    return this.salesService.countTotalItemQuantity();
  }

  @Get('customer/:customerId')
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Get Sales by Customer ID' })
  @ApiParam({ name: 'customerId', description: 'Customer ID to filter sales by', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of Sales by Customer ID',
    type: [CreateSalesDto],
  })
  @ApiNotFoundResponse({ description: 'No Sales found for the given Customer ID' })
  @ResponseMessage('Sales retrieved successfully by Customer ID')
  async getSalesByCustomerId(@Param('customerId') customerId: string): Promise<SalesDocument[]> {
    return this.salesService.getSalesByCustomerID(customerId);
  }

  @Put('payment-status/:id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Cashier)
  @ApiOperation({ summary: 'Update Sale Payment Status by Order ID' })
  @ApiParam({ name: 'id', description: 'Order ID of the Sale to update', type: String })
  @ApiBody({ type: UpdatePaymentStatusDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sale payment status updated successfully',
    type: CreateSalesDto,
  })
  @ApiNotFoundResponse({ description: 'Sale payment status not found' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ResponseMessage('Order payment status updated successfully')
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() updatePaymentStatusDto: UpdatePaymentStatusDto,
  ): Promise<SalesDocument> {
    return this.salesService.updateSalePaymentStatus(id, updatePaymentStatusDto.paymentStatus);
  }

  @Put('order-status/:id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Chef)
  @ApiOperation({ summary: 'Update Order Status by Order ID' })
  @ApiParam({ name: 'id', description: 'Order ID of the Sale to update', type: String })
  @ApiBody({ type: UpdateOrderStatusDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order status updated successfully',
    type: CreateSalesDto,
  })
  @ApiNotFoundResponse({ description: 'Order status not found' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ResponseMessage('Order status updated successfully')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<SalesDocument> {
    return this.salesService.updateSaleStatus(id, updateOrderStatusDto);
  }

  @Get('payment-status/:paymentStatus')
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Get Sales by Payment Status' })
  @ApiParam({
    name: 'paymentStatus',
    description: 'Payment status to filter sales by',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of Sales by Payment Status',
    type: [CreateSalesDto],
  })
  @ApiNotFoundResponse({ description: 'No Sales found for the given Payment Status' })
  @ResponseMessage('Orders retrieved successfully by payment status')
  async getSalesByPaymentStatus(
    @Param('paymentStatus') paymentStatus: SalesPaymentStatus,
  ): Promise<SalesDocument[]> {
    return this.salesService.getSalesByPaymentStatus(paymentStatus);
  }

  @Put(':id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Cashier)
  @ApiOperation({ summary: 'Update an existing Sale' })
  @ApiParam({ name: 'id', description: 'ID of the Sale to update', type: String })
  @ApiBody({ type: UpdateSalesDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sale updated successfully',
    type: CreateSalesDto,
  })
  @ApiNotFoundResponse({ description: 'Sale not found' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ResponseMessage('Sale updated successfully')
  async updateSale(
    @Param('id') id: string,
    @Body() updateSalesDto: UpdateSalesDto,
  ): Promise<SalesDocument> {
    return this.salesService.updateSale(id, updateSalesDto);
  }

  @Delete(':id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Delete an existing Sale' })
  @ApiParam({ name: 'id', description: 'ID of the Sale to delete', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Sale deleted successfully' })
  @ApiNotFoundResponse({ description: 'Sale not found' })
  @ResponseMessage('Sale deleted successfully')
  async deleteSale(@Param('id') id: string): Promise<void> {
    await this.salesService.deleteSale(id);
  }
}
