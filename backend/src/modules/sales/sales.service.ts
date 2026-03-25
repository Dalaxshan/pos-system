import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSalesDto } from './dto/request/create-sales.dto';
import { ItemService } from 'src/modules/items/item.service';
import { CustomerService } from 'src/modules/customers/customer.service';
import { SalesDocument } from './sales.schema';
import { SalesPaymentStatus } from './enum/sales-payment-status';
import { UpdateSalesDto } from './dto/request/update-sales.dto';
import { SalesServiceStatus } from './enum/sales-service-status';
import { EmployeeService } from 'src/modules/employees/employee.service';
import { OrderStatus } from './enum/order-status';
import { UpdateOrderStatusDto } from './dto/request/update-order-status.dto';
import { TableStatus } from '../tables/enum/table-status';
import { TableService } from 'src/modules/tables/table.service';
import { Cron } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationType } from 'src/common/enums/notification-type';
import { toObjectId } from 'src/utils/to-object-id';
import { ItemQuantity } from './interfaces/item-quantity';
import { ITotalSale } from '../purchases/interfaces/profit.interface';

@Injectable()
export class SalesService {
  private readonly serviceChargePercentage = 10;
  private readonly logger = new Logger(SalesService.name);
  constructor(
    @InjectModel('Sales')
    private readonly orderModel: Model<SalesDocument>,
    private readonly itemService: ItemService,
    private readonly customerService: CustomerService,
    private readonly employeeService: EmployeeService,
    private readonly tableService: TableService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * create sales order
   * @param orderDto
   * @returns
   */
  async createSale(orderDto: CreateSalesDto): Promise<SalesDocument> {
    try {
      // Handle customer creation or retrieval based on contactNo
      let customer;
      if (orderDto.contactNo) {
        customer = await this.customerService.getCustomerByContactNumber(orderDto.contactNo);
        if (!customer) {
          const newCustomerDto = {
            contactNo: orderDto.contactNo,
            customerName: orderDto.customerName,
          };

          try {
            customer = await this.customerService.registerCustomer(newCustomerDto);
          } catch (error) {
            throw new BadRequestException('Failed to create customer record', error.message);
          }
        }
      }

      // Validate employee existence
      const employee = await this.employeeService.getEmployeeById(orderDto.employeeId);
      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      // Ensure items array is not empty
      if (!orderDto.items || orderDto.items.length === 0) {
        throw new BadRequestException('Items array must not be empty');
      }

      // Convert employee and table IDs to ObjectId
      const convertedEmployeeId = toObjectId(orderDto.employeeId);
      let convertedTableId;
      if (orderDto.tableId) {
        convertedTableId = toObjectId(orderDto.tableId);
        await this.tableService.updateTableStatus(convertedTableId, {
          tableStatus: TableStatus.Occupied,
        });
      }
      // Process and map items, fetch data from item service
      const items = await Promise.all(
        orderDto.items.map(async (orderItem) => {
          const item = await this.itemService.getItemById(orderItem.itemId);
          if (!item) {
            throw new NotFoundException(`Item not found for id ${orderItem.itemId}`);
          }

          const totalPriceItem = orderItem.totalAmount * orderItem.quantity;
          return {
            ...orderItem,
            unitPrice: item.netPrice,
            totalPriceItem,
            _id: item._id,
            itemId: item.itemId,
            itemName: item.name,
            discount: item.discount || 0,
            customizations: orderItem.customizations || [],
          };
        }),
      );

      // Calculate subTotal and discount
      let subTotal = items.reduce((total, item) => total + item.totalPriceItem, 0);
      const quantity = items.length;
      const discountAmount = (subTotal * (orderDto.discount || 0)) / 100;

      // Add service charge for dine-in orders
      let serviceCharge = 0;
      if (orderDto.serviceStatus === SalesServiceStatus.DineIn) {
        serviceCharge = (subTotal * this.serviceChargePercentage) / 100;
      }

      // const preOrderDate = orderDto.preOrderDate ? new Date(orderDto.preOrderDate) : null;
      // Handle pre-order logic
      if (orderDto.serviceStatus === SalesServiceStatus.PreOrder) {
        const today = new Date();
        const preOrderDate = new Date(orderDto.preOrderDate);
        const dayBeforePreOrderDate = new Date(preOrderDate);
        dayBeforePreOrderDate.setDate(preOrderDate.getDate() - 1);

        if (today.toDateString() === dayBeforePreOrderDate.toDateString()) {
          orderDto.orderStatus = OrderStatus.Placed;
        } else {
          orderDto.orderStatus = OrderStatus.Hold;
        }
      }

      // Calculate grand total
      const grandTotal = subTotal - discountAmount + serviceCharge;

      // Create a new sales order
      const newOrder = new this.orderModel({
        ...orderDto,
        items,
        quantity,
        subTotal,
        serviceCharge,
        grandTotal,
        customerId: customer?._id,
        employeeId: convertedEmployeeId,
        tableId: convertedTableId,
        preOrderDate: orderDto.preOrderDate || null,
      });

      // Save the order and emit an event
      const savedOrder = await newOrder.save();
      this.eventEmitter.emit('sales.created', {
        createdBy: savedOrder.employeeId,
        type: NotificationType.NewSalesOrder,
        salesId: savedOrder._id,
        name: savedOrder.orderId,
      });

      return savedOrder;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * This cron job will run every day at 12 AM to refresh the pre-order logic.
   */
  @Cron('0 0 * * *')
  async refreshPreOrders(): Promise<void> {
    const currentDate = new Date();

    // Find all pre-orders that are in Hold status and need to be updated
    const preOrders = await this.orderModel
      .find({
        orderStatus: OrderStatus.Hold,
        preOrderDate: { $exists: true },
      })
      .exec();

    preOrders.forEach(async (order) => {
      const preOrderDate = new Date(order.preOrderDate);
      const dayBeforePreOrderDate = new Date(preOrderDate);
      dayBeforePreOrderDate.setDate(preOrderDate.getDate() - 1);

      // If today matches the day before the preOrderDate, update the order status to Placed
      if (currentDate.toDateString() === dayBeforePreOrderDate.toDateString()) {
        order.orderStatus = OrderStatus.Placed;
        await order.save();
      }
    });

    this.logger.log(`Pre-order status refreshed at ${currentDate}`);
  }

  /**
   * get sales by ID
   * @param id
   * @returns
   */
  async getSaleById(id: string): Promise<SalesDocument> {
    const order = await this.orderModel
      .findById(id)
      .populate('tableId')
      .populate('employeeId', {
        employeeId: 1,
        name: 1,
        contactNo: 1,
        address: 1,
        email: 1,
      })
      .populate('customerId')
      .sort({ createdAt: -1 })
      .exec();

    if (!order) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    return order;
  }

  /**
   * getAll orders
   * @returns all orders
   */
  async getAllSales(): Promise<SalesDocument[]> {
    const sales = await this.orderModel
      .find()
      .populate('employeeId', {
        employeeId: 1,
        name: 1,
        contactNo: 1,
        address: 1,
        email: 1,
      })
      .populate('customerId')
      .sort({ createdAt: -1 })
      .exec();

    return sales;
  }

  /**
   * getAll total sold items Qty
   * @returns top 4 items with highest total quantity
   */
  async countTotalItemQuantity(): Promise<ItemQuantity[]> {
    const sales = await this.getAllSales();
    const itemQuantities: Record<string, { itemName: string; quantity: number }> = {};

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        const itemId = item.itemId.toString();

        const itemQuantity =
          typeof item.quantity === 'object' ? item.quantity.value : item.quantity;

        if (itemQuantities[itemId]) {
          // Increment the value of quantity
          itemQuantities[itemId].quantity += itemQuantity;
        } else {
          itemQuantities[itemId] = {
            itemName: item.itemName,
            quantity: itemQuantity,
          };
        }
      });
    });

    // Convert object to array and sort by quantity in descending order
    const itemQuantitiesArray = Object.entries(itemQuantities)
      .map(([itemId, itemDetails]) => ({
        itemId,
        itemName: itemDetails.itemName,
        quantity: itemDetails.quantity,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 4);

    return itemQuantitiesArray;
  }

  async getSalesByCustomerID(customerID: string): Promise<SalesDocument[]> {
    const customer = await this.customerService.getCustomerById(customerID);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerID} not found`);
    }

    return await this.orderModel.find({ customerId: customer._id }).exec();
  }

  async getSalesByItemID(ItemID: string): Promise<SalesDocument[]> {
    const item = await this.itemService.getItemById(ItemID);
    if (!item) {
      throw new NotFoundException(`Item with ID ${item} not found`);
    }
    return await this.orderModel.find({ 'items.itemId': item._id }).exec();
  }

  async updateSale(id: string, updateOrderDto: UpdateSalesDto): Promise<SalesDocument> {
    const orderExists = await this.orderModel.findById(id).exec();
    if (!orderExists) {
      throw new NotFoundException('Sales does not exist');
    }

    let customer;

    if (updateOrderDto.contactNo) {
      customer = await this.customerService.getCustomerByContactNumber(updateOrderDto.contactNo);
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

    //update current and new table status
    let currentTableId = orderExists.tableId;
    let newTableId = updateOrderDto.tableId;

    //update table status when select diffrent service status(take away or pre-order)
    if (updateOrderDto.serviceStatus !== SalesServiceStatus.DineIn) {
      if (currentTableId) {
        await this.tableService.updateTableStatus(currentTableId.toString(), {
          tableStatus: TableStatus.Available,
        });
        newTableId = null;
      }
    }

    if (currentTableId && newTableId && currentTableId.toString() !== newTableId) {
      //change currrent table ID status to available
      await this.tableService.updateTableStatus(currentTableId.toString(), {
        tableStatus: TableStatus.Available,
      });

      //change new table ID status to occupied
      await this.tableService.updateTableStatus(newTableId, {
        tableStatus: TableStatus.Occupied,
      });
    }
    const items = await Promise.all(
      updateOrderDto.items.map(async (orderItem) => {
        const item = await this.itemService.getItemById(orderItem.itemId);
        if (!item) {
          throw new NotFoundException(`Item not found for id ${orderItem.itemId}`);
        }
        return {
          ...orderItem,
          unitPrice: item.netPrice,
          totalPriceItem: item.netPrice * orderItem.quantity,
          _id: item._id,
          itemId: item.itemId,
          itemName: item.name,
          discount: item.discount || 0,
        };
      }),
    );
    let subTotal = items.reduce((total, item) => total + item.totalPriceItem, 0);

    const quantity = items.length;
    const discountAmount = subTotal * (updateOrderDto.discount / 100) || 0;

    let serviceCharge = 0;
    if (updateOrderDto.serviceStatus === SalesServiceStatus.DineIn) {
      serviceCharge = subTotal * (this.serviceChargePercentage / 100);
    }

    const grandTotal = subTotal - discountAmount + serviceCharge;

    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      id,
      {
        ...updateOrderDto,
        tableId: newTableId,
        items,
        quantity,
        customer: customer?._id,
        subTotal,
        serviceCharge,
        grandTotal,
      },
      { new: true },
    );

    if (!updatedOrder) {
      throw new NotFoundException(`Sales Order with ID ${id} not found`);
    }

    return updatedOrder;
  }

  async deleteSale(id: string): Promise<void> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Sales Order with ID ${id} not found`);
    }
    await this.orderModel.findByIdAndDelete(id);
  }

  async getSalesByPaymentStatus(paymentStatus: SalesPaymentStatus): Promise<SalesDocument[]> {
    return await this.orderModel.find({ paymentStatus }).exec();
  }

  //update payment status
  async updateSalePaymentStatus(
    id: string,
    paymentStatus: SalesPaymentStatus,
  ): Promise<SalesDocument> {
    const order = await this.orderModel.findById(id);

    if (!order) {
      throw new NotFoundException('Sale not found');
    }

    if (order.tableId) {
      const convertedTableId = order.tableId.toString();
      //change the table status when payment status changed
      if (paymentStatus === SalesPaymentStatus.Paid) {
        await this.tableService.updateTableStatus(convertedTableId, {
          tableStatus: TableStatus.Available,
        });
      } else {
        await this.tableService.updateTableStatus(convertedTableId, {
          tableStatus: TableStatus.Occupied,
        });
      }
    }
    // order.paymentStatus = paymentStatus;
    const updateOrder = await this.orderModel
      .findByIdAndUpdate({ _id: id }, { paymentStatus }, { new: true })
      .exec();

    //check order has updated
    if (!updateOrder) {
      throw new BadRequestException('Failed to update order status');
    }
    return updateOrder;
  }

  //update order status
  async updateSaleStatus(
    id: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<SalesDocument> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException('Sale not found');
    }

    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, { orderStatus: updateOrderStatusDto.orderStatus }, { new: true })
      .exec();

    if (!updatedOrder) {
      throw new BadRequestException('Failed to update order status');
    }

    return updatedOrder;
  }

  async getAggregatedTotal(): Promise<ITotalSale[]> {
    const result = await this.orderModel
      .aggregate([
        {
          $match: {
            serviceStatus: { $ne: SalesServiceStatus.PreOrder },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }, // Group by date
            },
            totalGrandPrice: { $sum: '$grandTotal' },
          },
        },
        {
          $project: {
            _id: 0, // Ensure no reference to _id is output
            date: '$_id', // Rename _id to date
            totalGrandPrice: 1,
          },
        },
        {
          $sort: { date: 1 }, // Optional: Sort by date in ascending order
        },
      ])
      .exec();
    return result;
  }
}
