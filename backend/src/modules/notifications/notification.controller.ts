import { Body, Controller, HttpStatus, Param, Post, Get, UseGuards } from '@nestjs/common';
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
import { CreateNotificationRequestDto } from './dto/request/create-notification-req.dto';
import { NotificationService } from './notification.service';
import { CreateNotificationResponseDto } from './dto/response/create-notification-res.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AllowedRoles } from 'src/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { NotificationDocument } from './notification.schema';

@ApiTags('Notification')
@Controller('notification')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Cashier, Role.Chef)
  @ApiOperation({ summary: 'Create a new Notification' })
  @ApiBody({ type: CreateNotificationRequestDto })
  @ResponseMessage('Notification created successfully')
  @ApiCreatedResponse({
    description: 'Notification created successfully',
    type: CreateNotificationResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Failed to create notification' })
  async createNotification(
    @Body() createNotificationDto: CreateNotificationRequestDto,
  ): Promise<CreateNotificationResponseDto> {
    return this.notificationService.createNotification(createNotificationDto);
  }

  @Get(':id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Cashier, Role.Chef)
  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiParam({ name: 'id', description: 'ID of the notification to retrieve', type: String })
  @ResponseMessage('Notification fetched successfully by ID')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Notification by ID fetched successfully',
  })
  @ApiNotFoundResponse({ description: 'Notification not found' })
  @ApiBadRequestResponse({ description: 'Invalid ID format' })
  async getNotificationById(@Param('id') id: string): Promise<NotificationDocument> {
    return this.notificationService.getNotificationById(id);
  }

  @Get()
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Cashier, Role.Chef)
  @ApiOperation({ summary: 'Retrieve all notifications' })
  @ResponseMessage('All notifications fetched successfully')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'All notifications fetched successfully',
  })
  @ApiNotFoundResponse({ description: 'No notifications found' })
  async getAllNotifications(): Promise<NotificationDocument[]> {
    return this.notificationService.getAllNotifications();
  }

  @Get('created-by/:id')
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Cashier, Role.Chef)
  @ApiOperation({ summary: 'Get notifications by createdBy ID' })
  @ApiParam({ name: 'id', description: 'ID of the creator', type: String })
  @ResponseMessage('Notifications fetched successfully by createdBy ID')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Notifications fetched successfully by createdBy ID',
  })
  @ApiNotFoundResponse({ description: 'No notifications found for this creator' })
  async getNotificationsByCreatedBy(
    @Param('id') createdBy: string,
  ): Promise<NotificationDocument[]> {
    return this.notificationService.getNotificationsByCreatedBy(createdBy);
  }

  @Get('type/:type')
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Cashier, Role.Chef)
  @ApiOperation({ summary: 'Get notifications by type' })
  @ApiParam({ name: 'type', description: 'Type of the notifications', type: String })
  @ResponseMessage('Notifications fetched successfully by type')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Notifications fetched successfully by type',
  })
  @ApiNotFoundResponse({ description: 'No notifications found for this type' })
  async getNotificationsByType(@Param('type') type: string): Promise<NotificationDocument[]> {
    return this.notificationService.getNotificationsByType(type);
  }
}
