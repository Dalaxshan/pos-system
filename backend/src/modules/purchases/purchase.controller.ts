import { Body, Controller, Get, Post, Param, UseGuards, Put, Delete, Logger } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PurchaseService } from './purchase.service';
import { SalesService } from '../sales/sales.service';
import { CreatePurchaseDto } from './dto/request/create-purchase.dto';
import { UpdateOrderStatusDto } from './dto/request/update-purchase-status.dto';
import { UpdatePaymentStatusDto } from './dto/request/update-purchase-payment-status.dto';
import { PurchaseStatus } from './enum/purchase-status';
import { PurchasePaymentStatus } from './enum/purchase-payment-status';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AllowedRoles } from 'src/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { UpdateOrderDto } from './dto/request/update-purchase.dto';
import { PurchaseDocument } from './purchase.schema';
import { PurchaseItem } from './interfaces/purchase-item';
import { Cron } from '@nestjs/schedule';
import { IAggregatedProfit } from './interfaces/profit.interface';

@ApiTags('Purchase')
@Controller('purchase')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PurchaseController {
  private readonly logger: Logger = new Logger(PurchaseController.name);
  constructor(
    private readonly orderService: PurchaseService,
    private readonly salesService: SalesService,
  ) {}

  @Post()
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Chef)
  @ApiOperation({ summary: 'Create a new Purchase' })
  @ApiBody({ type: CreatePurchaseDto })
  @ResponseMessage('Purchase created successfully')
  @ApiCreatedResponse({
    description: 'Purchase created successfully',
    type: CreatePurchaseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async createOrder(@Body() createPurchaseDto: CreatePurchaseDto): Promise<PurchaseDocument> {
    return this.orderService.createOrder(createPurchaseDto);
  }

  @Get()
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Retrieve all purchases' })
  @ResponseMessage('Successfully retrieved all purchases')
  @ApiOkResponse({
    description: 'All purchases retrieved successfully',
    type: [CreatePurchaseDto],
  })
  @ApiNotFoundResponse({ description: 'No Purchases found' })
  async getAllOrders(): Promise<PurchaseDocument[]> {
    return this.orderService.getAllOrders();
  }

  //getAll items in purchase order
  @Get('items')
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Retrieve all items in purchase order' })
  @ResponseMessage('Successfully retrieved all items in purchase order')
  @ApiOkResponse({
    description: 'All items in purchase order retrieved successfully',
    type: [CreatePurchaseDto],
  })
  @ApiNotFoundResponse({ description: 'No items found in purchase order' })
  async getAllPurchaseItem(): Promise<PurchaseItem[]> {
    return this.orderService.getAllPurchaseItem();
  }

  //calculate the total stock
  @Get('total')
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Calculate total stock' })
  @ResponseMessage('Total stock calculated successfully')
  async calculateTotalStock(): Promise<PurchaseItem[]> {
    return this.orderService.calculateTotalPurchase();
  }

  @Get('profit')
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Get aggregated average profit' })
  @ResponseMessage('Successfully retrieved aggregated average profit')
  @ApiOkResponse({
    description: 'Aggregated average profit retrieved successfully',
    type: Object, // Optionally replace with a DTO type if needed
  })
  @ApiBadRequestResponse({ description: 'Invalid request' })
  async getAggregatedAverageProfit(): Promise<IAggregatedProfit> {
    const totalSales = await this.salesService.getAggregatedTotal();
    const totalPurchases = await this.orderService.getAggregatedTotalPurchases();
    const totalProfit =
      totalSales.reduce((sum, sale) => sum + sale.totalGrandPrice, 0) -
      totalPurchases.reduce((sum, purchase) => sum + purchase.totalNetPrice, 0);
    return {
      totalSales,
      totalPurchases,
      profit: totalProfit,
    };
  }

  @Cron('0 0 1 * *')
  async refreshMonthlyProfit(): Promise<void> {
    const currentDate = new Date();
    this.logger.log(`Monthly profit refresh started at ${currentDate}`);

    await this.getAggregatedAverageProfit();
    this.logger.log(`Monthly profit refresh completed at ${new Date()}`);
  }

  @Get('supplier/:supplierId')
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Get Purchases by Supplier ID' })
  @ApiParam({ name: 'supplierId', description: 'ID of the supplier', type: String })
  @ResponseMessage('Purchases retrieved successfully by supplier ID')
  @ApiOkResponse({
    description: 'Purchases by supplier retrieved successfully',
    type: [CreatePurchaseDto],
  })
  @ApiNotFoundResponse({ description: 'No Purchases found for this supplier' })
  async getOrdersBySupplierId(
    @Param('supplierId') supplierId: string,
  ): Promise<PurchaseDocument[]> {
    return this.orderService.getOrdersBySupplierID(supplierId);
  }

  @Get('item/:itemId')
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Chef)
  @ApiOperation({ summary: 'Get Purchases by Item ID' })
  @ApiParam({ name: 'itemId', description: 'ID of the item', type: String })
  @ResponseMessage('Purchases retrieved successfully by item ID')
  @ApiOkResponse({
    description: 'Purchases by item retrieved successfully',
    type: [CreatePurchaseDto],
  })
  @ApiNotFoundResponse({ description: 'No Purchases found for this item' })
  async getOrdersByItemId(@Param('itemId') itemId: string): Promise<PurchaseDocument[]> {
    return this.orderService.getOrdersByItemID(itemId);
  }

  @Get('status/:status')
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Get Purchases by Status' })
  @ApiParam({ name: 'status', description: 'Purchase status', enum: PurchaseStatus })
  @ResponseMessage('Purchases retrieved successfully by status')
  @ApiOkResponse({
    description: 'Purchases by status retrieved successfully',
    type: [CreatePurchaseDto],
  })
  @ApiNotFoundResponse({ description: 'No Purchases found for this status' })
  async getOrdersByStatus(@Param('status') status: PurchaseStatus): Promise<PurchaseDocument[]> {
    return this.orderService.getOrdersByStatus(status);
  }

  @Get('payment-status/:paymentStatus')
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Get Purchases by Payment Status' })
  @ApiParam({ name: 'paymentStatus', description: 'Payment status', enum: PurchasePaymentStatus })
  @ResponseMessage('Purchases retrieved successfully by payment status')
  @ApiOkResponse({
    description: 'Purchases by payment status retrieved successfully',
    type: [CreatePurchaseDto],
  })
  @ApiNotFoundResponse({ description: 'No Purchases found for this payment status' })
  async getOrdersByPaymentStatus(
    @Param('paymentStatus') paymentStatus: PurchasePaymentStatus,
  ): Promise<PurchaseDocument[]> {
    return this.orderService.getOrdersByPaymentStatus(paymentStatus);
  }

  @Get(':id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Chef)
  @ApiOperation({ summary: 'Get Purchase by ID' })
  @ApiParam({ name: 'id', description: 'ID of the purchase', type: String })
  @ResponseMessage('Successfully retrieved purchase by ID')
  @ApiOkResponse({
    description: 'Purchase retrieved successfully',
    type: CreatePurchaseDto,
  })
  @ApiNotFoundResponse({ description: 'No Purchase found' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async getOrderById(@Param('id') id: string): Promise<PurchaseDocument> {
    return this.orderService.getOrderById(id);
  }

  @Put('status/:id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Update Purchase Status by ID' })
  @ApiParam({ name: 'id', description: 'ID of the purchase', type: String })
  @ApiBody({ type: UpdateOrderStatusDto })
  @ResponseMessage('Purchase status updated successfully')
  @ApiOkResponse({
    description: 'Purchase status updated successfully',
    type: CreatePurchaseDto,
  })
  @ApiNotFoundResponse({ description: 'Purchase not found' })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() orderStatusDto: UpdateOrderStatusDto,
  ): Promise<PurchaseDocument> {
    return this.orderService.updatePurchaseStatus(id, orderStatusDto.status);
  }

  @Put('payment-status/:id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Update Payment Status by Order ID' })
  @ApiParam({ name: 'id', description: 'ID of the purchase', type: String })
  @ApiBody({ type: UpdatePaymentStatusDto })
  @ResponseMessage('Payment status updated successfully')
  @ApiOkResponse({
    description: 'Payment status updated successfully',
    type: [UpdatePaymentStatusDto],
  })
  @ApiNotFoundResponse({ description: 'Payment status not found' })
  async updatePaymentOrderStatus(
    @Param('id') id: string,
    @Body() paymentStatusDto: UpdatePaymentStatusDto,
  ): Promise<PurchaseDocument> {
    return this.orderService.updatePurchasePaymentStatus(id, paymentStatusDto.paymentStatus);
  }

  @Put(':id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Update Purchase by ID' })
  @ApiParam({ name: 'id', description: 'ID of the purchase', type: String })
  @ApiBody({ type: UpdateOrderDto })
  @ResponseMessage('Purchase updated successfully')
  @ApiOkResponse({
    description: 'Purchase updated successfully',
    type: UpdateOrderDto,
  })
  @ApiNotFoundResponse({ description: 'Purchase not found' })
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<PurchaseDocument> {
    return this.orderService.updateOrder(id, updateOrderDto);
  }

  @Delete(':id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Delete Purchase by ID' })
  @ApiParam({ name: 'id', description: 'ID of the purchase', type: String })
  @ResponseMessage('Purchase deleted successfully')
  @ApiOkResponse({
    description: 'Purchase deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Purchase not found' })
  async deleteOrder(@Param('id') id: string): Promise<void> {
    await this.orderService.deleteOrder(id);
  }
}
