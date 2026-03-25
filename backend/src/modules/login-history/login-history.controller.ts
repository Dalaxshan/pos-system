import { Body, Controller, Get, Post, Put, Param, HttpStatus, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { LoginHistoryService } from './login-history.service';
import { CreateLoginHistoryDto } from './dto/create-login-history.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AllowedRoles } from 'src/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { LoginHistoryDocument } from './login-history.schema';
import { Types } from 'mongoose';

@ApiTags('Login History')
@Controller('login-history')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LoginHistoryController {
  constructor(private readonly loginHistoryService: LoginHistoryService) {}

  @Get()
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Retrieve all login history' })
  @ResponseMessage('All login history fetched successfully')
  @ApiResponse({ status: HttpStatus.OK, description: 'Login history retrieved successfully' })
  @ApiNotFoundResponse({ description: 'No login history found' })
  async getAllLoginHistory(): Promise<LoginHistoryDocument[]> {
    return this.loginHistoryService.getLoginHistory();
  }

  @Post()
  @AllowedRoles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Create login history' })
  @ApiBody({ type: CreateLoginHistoryDto })
  @ResponseMessage('Login history created successfully')
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Login history created successfully' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async createLoginHistory(
    @Body() createLoginHistoryDto: CreateLoginHistoryDto,
  ): Promise<LoginHistoryDocument> {
    const { employeeId, name, role, isAuthenticated } = createLoginHistoryDto;
    return this.loginHistoryService.createLoginHistory(employeeId, name, role, isAuthenticated);
  }

  @Put(':employeeId')
  @AllowedRoles(Role.Admin, Role.SuperAdmin, Role.Cashier, Role.Chef)
  @ApiOperation({ summary: 'Update logout date by employee ID' })
  @ApiParam({ name: 'employeeId', description: 'ID of the employee', type: String })
  @ApiBody({ description: 'Logout date', type: Date })
  @ResponseMessage('Logout date updated successfully')
  @ApiResponse({ status: HttpStatus.OK, description: 'Logout date updated successfully' })
  @ApiNotFoundResponse({ description: 'Login history not found' })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  async updateLogoutDate(
    @Param('employeeId') employeeId: string,
    @Body('logout') logout: Date,
  ): Promise<LoginHistoryDocument> {
    const employeeIdObj = new Types.ObjectId(employeeId);
    return this.loginHistoryService.updateLogoutDate(employeeIdObj, logout);
  }
}
