import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePurchaseDto } from './dto/request/create-purchase.dto';
import { PurchaseStatus } from './enum/purchase-status';
import { ItemService } from 'src/modules/items/item.service';
import { SupplierService } from 'src/modules/suppliers/supplier.service';
import { PurchaseDocument } from './purchase.schema';
import { PurchasePaymentStatus } from './enum/purchase-payment-status';
import { UpdateOrderDto } from './dto/request/update-purchase.dto';
import { EmployeeService } from 'src/modules/employees/employee.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationType } from 'src/common/enums/notification-type';
import { ITotalPurchase } from './interfaces/profit.interface';
import { PurchaseItem } from './interfaces/purchase-item';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectModel('Purchase')
    private readonly orderModel: Model<PurchaseDocument>,
    private readonly itemService: ItemService,
    private readonly supplierService: SupplierService,
    private readonly employeeService: EmployeeService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * create new purchase order
   * @param orderDto - CreatePurchaseDto
   * @return the created order
   */
  async createOrder(orderDto: CreatePurchaseDto): Promise<PurchaseDocument> {
    try {
      const supplier = await this.supplierService.getSupplierById(orderDto.supplierId.toString());

      if (!supplier) {
        throw new NotFoundException('Supplier not found');
      }

      const employee = await this.employeeService.getEmployeeById(orderDto.employeeId.toString());

      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      if (!orderDto.items || orderDto.items.length === 0) {
        throw new BadRequestException('Items array must not be empty');
      }

      // Check for duplicate itemIds
      const itemIds = orderDto.items.map((orderItem) => orderItem.itemId);
      const uniqueItemIds = new Set(itemIds);

      if (itemIds.length !== uniqueItemIds.size) {
        throw new BadRequestException('Duplicate itemId found in items array');
      }

      const items = await Promise.all(
        orderDto.items.map(async (orderItem) => {
          const item = await this.itemService.getItemById(orderItem.itemId);

          if (!item) {
            throw new NotFoundException(`Item not found for id ${orderItem.itemId}`);
          }

          return {
            ...orderItem,
            unitPrice: item.netPrice,
            totalPriceItem: item.netPrice * orderItem.quantity.value,
            _id: item._id,
            itemId: item.itemId,
            itemName: item.name,
            quantity: {
              value: orderItem.quantity.value,
              volume: orderItem.quantity.volume,
            },
            discount: item.discount || 0,
          };
        }),
      );

      const grossPrice = items.reduce((total, item) => total + item.totalPriceItem, 0);
      const discountAmount = grossPrice * (orderDto.discount / 100) || 0;
      const netPrice = grossPrice - discountAmount;

      const newOrder = new this.orderModel({
        ...orderDto,
        supplierId: supplier._id,
        employeeId: employee._id,
        items,
        netPrice,
        grossPrice,
      });

      const savedOrder = await newOrder.save();

      // Trigger a notification after successfully creating the order
      this.eventEmitter.emit('purchase.created', {
        createdBy: savedOrder.employeeId,
        type: NotificationType.NewPurchaseOrder,
        purchaseId: savedOrder._id,
        name: savedOrder.orderId,
      });
      return savedOrder;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getOrderById(id: string): Promise<PurchaseDocument> {
    const order = await this.orderModel
      .findById(id)
      .populate('employeeId', {
        employeeId: 1,
        name: 1,
        contactNo: 1,
        address: 1,
        email: 1,
      })
      .populate('supplierId')
      .sort({ createdAt: -1 })
      .exec();

    if (!order) {
      throw new NotFoundException(`Purchase with ID ${id} not found`);
    }

    return order;
  }

  /**
   * get all items in a purchase orders
   */
  async getAllPurchaseItem(): Promise<PurchaseItem[]> {
    const purchases = await this.orderModel.find().exec();
    const allItems = purchases.flatMap((purchase) => {
      return purchase.items;
    });
    return allItems;
  }

  /**
   * calculate the total purchases
   * @return total stock of each item
   */
  async calculateTotalPurchase(): Promise<PurchaseItem[]> {
    const purchaseStock = await this.getAllPurchaseItem();

    //calculate total stock in same item
    const totalStock = purchaseStock.reduce((acc, item) => {
      const found = acc.find((stock) => stock.itemId === item.itemId);
      if (found) {
        found.itemId = item.itemId;
        found.itemName = item.itemName;
        found.quantity.value += item.quantity.value;
        return acc;
      }
      return [...acc, item];
    }, []);

    return totalStock;
  }

  /**
   * getAll purchase
   * @returns all supplier order details
   */
  async getAllOrders(): Promise<PurchaseDocument[]> {
    const purchase = await this.orderModel
      .find()
      .populate('supplierId')
      .populate('employeeId', {
        employeeId: 1,
        name: 1,
        contactNo: 1,
        address: 1,
        email: 1,
      })
      .sort({ createdAt: -1 })
      .exec();

    return purchase;
  }

  /**
   *
   * Get all suborders by Supplier ID
   * @param supplierID Supplier ID
   * @returns sub orders by Supplier ID
   */
  async getOrdersBySupplierID(supplierID: string): Promise<PurchaseDocument[]> {
    const supplier = await this.supplierService.getSupplierById(supplierID);
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${supplierID} not found`);
    }

    const Orders = await this.orderModel
      .find({
        supplierId: supplier._id,
      })
      .sort({ createdAt: -1 })
      .populate('supplierId')
      .exec();

    return Orders;
  }

  async getOrdersByItemID(itemId: string): Promise<PurchaseDocument[]> {
    const item = await this.itemService.getItemById(itemId);
    if (!item) {
      throw new NotFoundException(`Item with ID ${itemId} not found`);
    }

    return await this.orderModel.find({ 'items.itemId': item._id }).exec();
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<PurchaseDocument> {
    const orderExists = await this.orderModel.findById(id).exec();
    if (!orderExists) {
      throw new NotFoundException('Order does not exist');
    }

    const supplier = await this.supplierService.getSupplierById(
      updateOrderDto.supplierId.toString(),
    );
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    const employee = await this.employeeService.getEmployeeById(
      updateOrderDto.employeeId.toString(),
    );

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    if (!updateOrderDto.items || updateOrderDto.items.length === 0) {
      throw new BadRequestException('Items array must not be empty');
    }
    const items = await Promise.all(
      updateOrderDto.items.map(async (orderItem) => {
        const item = await this.itemService.getItemById(orderItem.itemId);
        if (!item) {
          throw new NotFoundException(`Item not found for id ${orderItem.itemId}`);
        }

        //update the new netPrice value
        const updatedItem = await this.itemService.updateNetPrice(
          item._id.toString(),
          orderItem.discount,
        );

        return {
          ...orderItem,
          unitPrice: item.netPrice,
          totalPriceItem: updatedItem.netPrice * orderItem.quantity.value,
          _id: updatedItem._id,
          itemId: updatedItem.itemId,
          itemName: updatedItem.name,
          discount: updatedItem.discount || 0,
        };
      }),
    );

    const grossPrice = items.reduce((total, item) => total + item.totalPriceItem, 0);
    const quantity = items.length;
    const discountAmount = grossPrice * (updateOrderDto.discount / 100) || 0;
    const netPrice = grossPrice - discountAmount;

    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      id,
      {
        ...updateOrderDto,
        supplierId: supplier._id,
        employeeId: employee._id,
        items,
        quantity,
        netPrice,
        grossPrice,
      },
      { new: true },
    );

    if (!updatedOrder) {
      throw new BadRequestException('Failed to update item');
    }
    return updatedOrder;
  }

  async updatePurchaseStatus(id: string, status: PurchaseStatus): Promise<PurchaseDocument> {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.deliveryStatus = status;
    return await order.save();
  }

  async updatePurchasePaymentStatus(
    id: string,
    paymentStatus: PurchasePaymentStatus,
  ): Promise<PurchaseDocument> {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.paymentStatus = paymentStatus;
    return await order.save();
  }

  async getOrdersByStatus(status: PurchaseStatus): Promise<PurchaseDocument[]> {
    return await this.orderModel.find({ deliveryStatus: status }).sort({ createdAt: -1 }).exec();
  }

  async getOrdersByPaymentStatus(
    paymentStatus: PurchasePaymentStatus,
  ): Promise<PurchaseDocument[]> {
    return await this.orderModel.find({ paymentStatus }).exec();
  }

  async deleteOrder(id: string): Promise<void> {
    try {
      await this.orderModel.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAggregatedTotalPurchases(): Promise<ITotalPurchase[]> {
    const result = await this.orderModel.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          totalNetPrice: { $sum: '$netPrice' },
          totalPurchases: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          totalNetPrice: 1,
          totalPurchases: 1,
        },
      },
      {
        $sort: { date: 1 },
      },
    ]);
    return result;
  }
}
