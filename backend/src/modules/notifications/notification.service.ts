import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NotificationDocument } from './notification.schema';
import { CreateNotificationRequestDto } from './dto/request/create-notification-req.dto';
import { EmployeeService } from 'src/modules/employees/employee.service';
import { EventPayloads } from 'src/common/event-emitters/interface/event-types.interface';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification')
    private readonly notificationModel: Model<NotificationDocument>,
    private readonly employeeService: EmployeeService,
  ) {}

  // Create notification
  async createNotification(
    createNotificationRequest: CreateNotificationRequestDto,
  ): Promise<NotificationDocument> {
    try {
      const admin = await this.employeeService.getEmployeeById(
        createNotificationRequest.createdBy.toString(),
      );

      if (!admin) {
        throw new NotFoundException('Admin Not Found');
      }

      const newNotification = new this.notificationModel({
        ...createNotificationRequest,
        adminId: admin._id,
      });

      return await newNotification.save();
    } catch (error) {
      throw error;
    }
  }

  @OnEvent('item.created')
  async emitCreateNotification(data: EventPayloads['item.created']): Promise<void> {
    try {
      let admin = null;

      const { createdBy, name, type, itemId } = data;
      if (createdBy) {
        admin = await this.employeeService.getEmployeeById(createdBy);

        if (!admin) {
          throw new NotFoundException('Admin Not Found');
        }
      }

      const notificationData: {
        type: string;
        name: string;
        createdBy: Types.ObjectId;
        itemId: Types.ObjectId;
      } = { type, name, createdBy: null, itemId };

      if (name) {
        notificationData.name = name;
      }

      if (createdBy) {
        notificationData.createdBy = admin._id;
      }

      const notification = new this.notificationModel(notificationData);
      await notification.save();
    } catch (error) {
      throw error;
    }
  }

  @OnEvent('sales.created')
  async emitCreateSalesNotification(data: EventPayloads['sales.created']): Promise<void> {
    try {
      let admin = null;

      const { createdBy, name, type, salesId } = data;
      if (createdBy) {
        admin = await this.employeeService.getEmployeeById(createdBy);

        if (!admin) {
          throw new NotFoundException('Admin Not Found');
        }
      }

      const notificationData: {
        type: string;
        name: string;
        createdBy: Types.ObjectId;
        salesId: Types.ObjectId;
      } = { type, name, createdBy: null, salesId };

      if (name) {
        notificationData.name = name;
      }

      if (createdBy) {
        notificationData.createdBy = admin._id;
      }

      const notification = new this.notificationModel(notificationData);
      await notification.save();
    } catch (error) {
      throw error;
    }
  }

  @OnEvent('recipe.created')
  async emitCreateRecipeNotification(data: EventPayloads['recipe.created']): Promise<void> {
    try {
      const { createdBy, name, type, recipeId } = data;
      let chef = null;
      if (createdBy) {
        chef = await this.employeeService.getEmployeeById(createdBy);
        if (!chef) {
          throw new NotFoundException('Chef Not Found');
        }
      }
      const notificationData = {
        type,
        name: name || 'New Recipe', // Default name if not provided
        createdBy: chef?._id || null, // Ensure it's set to the chef's ID
        recipeId, // Pass the recipeId correctly
      };

      const notification = new this.notificationModel(notificationData);
      await notification.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @OnEvent('purchase.created')
  async emitCreatePurchaseNotification(data: EventPayloads['purchase.created']): Promise<void> {
    try {
      let admin = null;

      const { createdBy, name, type, purchaseId } = data;
      if (createdBy) {
        admin = await this.employeeService.getEmployeeById(createdBy);

        if (!admin) {
          throw new NotFoundException('Admin Not Found');
        }
      }
      const notificationData: {
        type: string;
        name: string;
        createdBy: Types.ObjectId;
        purchaseId: Types.ObjectId;
      } = { type, name, createdBy: null, purchaseId };

      if (name) {
        notificationData.name = name;
      }

      if (createdBy) {
        notificationData.createdBy = admin._id;
      }

      const notification = new this.notificationModel(notificationData);
      await notification.save();
    } catch (error) {
      throw error;
    }
  }

  // get notification by notification id
  async getNotificationById(id: string): Promise<NotificationDocument> {
    const notification = await this.notificationModel.findById(id).lean().exec();

    if (!notification) {
      throw new NotFoundException(`Notification with ID "${id}" not found`);
    }
    return notification;
  }

  // // Fetch all notifications
  async getAllNotifications(): Promise<NotificationDocument[]> {
    return this.notificationModel
      .find()
      .populate({ path: 'createdBy', select: 'name _id' })
      .populate({ path: 'itemId', select: 'name _id' })
      .populate({ path: 'salesId', select: '_id orderId' })
      .populate({ path: 'purchaseId', select: '_id orderId' })
      .populate({
        path: 'recipeId',
        select: '_id saleItemId',
        populate: { path: 'saleItemId', select: 'name' },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  // Fetch all notifications by createdBy ID
  async getNotificationsByCreatedBy(createdBy: string): Promise<NotificationDocument[]> {
    const notifications = await this.notificationModel
      .find({ createdBy: new Types.ObjectId(createdBy) })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    if (!notifications || notifications.length === 0) {
      throw new NotFoundException(`No notifications found for createdBy ID "${createdBy}"`);
    }
    return notifications;
  }

  // Fetch all notifications by notification type
  async getNotificationsByType(type: string): Promise<NotificationDocument[]> {
    return this.notificationModel
      .find({ type: type })
      .populate({ path: 'createdBy', select: 'name _id' })
      .populate({ path: 'itemId', select: 'name _id' })
      .populate({ path: 'salesId', select: 'orderId _id' })
      .populate({ path: 'purchaseId', select: '_id orderId' })
      .populate({
        path: 'recipeId',
        select: '_id saleItemId',
        populate: { path: 'saleItemId', select: 'name' },
      })
      .sort({ createdAt: -1 })
      .exec();
  }
}
